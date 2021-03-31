//Require dotenv for env vars
require('dotenv').config();

//Require express for the server
const express = require('express');

//create express app
let app = express();

//import the database
let db = require('./db');

//require cors middleware
let cors = require('cors') 
app.use(cors())

//Require md5 (for password hashing)
let md5 = require('md5');

//Require jsonwebtoken for authentication
let jwt = require('jsonwebtoken');

//Require authentication middleware
let auth = require('./middleware/auth');
const { response } = require('express');

//Allow the express app to parse json and read urlencoded data
app.use(express.json());
app.use(express.urlencoded());


//Start server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}.`);
});

//Define root
app.get("/",(req, res) => {
    res.send({message: "connected"});
});

// Get a user based on email and password
// Used for getting user info after they log in to the app
app.post("/api/user/login", (req, res) => {
    let sql = "SELECT * FROM person WHERE email = $1 AND password = $2";
    let params = [req.body.email, md5(req.body.password)];
    db.query(sql, params, (err, response) => {
        if(err) {
            res.status(400).json({"error": err.message});
            return;
        }
        else {
            if(response.rowCount === 0) {
                res.status(404).send({"error": "Could not find user with that login information, try again or sign up."});
            }
            else{
                let row = response.rows[0]
                const token = jwt.sign({p_id: row.p_id}, process.env.SECRET);
                userId = row.id;
                userInfo = {
                    "message": "Success",
                    "data": row,
                    "Token": token
                };
                res.status(200).send(userInfo);
            }
        }
    })
    

})

// Create a new user
// Used for creating a new profile when the user signs up
app.post("/api/user/signup", (req, res) => {
    let errors = [];
    //Check if all pieces of information are there
    if(!req.body.password) {
        errors.push("No password specified.");
    }
    if(!req.body.email) {
        errors.push("No email specified.");
    }
    if(!req.body.name) {
        errors.push("No name specified.");
    }
    //If info is not there, return error
    if(errors.length !== 0) {
        res.status(400).json({
            "error":errors
        });
    }
    else{
        let data = {
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password)
        };
        let sql = `INSERT INTO person (name, email, password) VALUES ($1, $2, $3) RETURNING p_id`;
        let params = [data.name, data.email, data.password];
        //Query database and insert a new person into it
        db.query(sql, params, (err, result) => {
            if(err) {
                res.status(400).json({
                    "error": err
                });
            }
            else{
                const token = jwt.sign({id: result.rows[0].p_id}, process.env.SECRET);
                res.json({
                    "message": "success",
                    "data": data,
                    "token": token
                });
            }
        });
    }
})

//Get back User's Info
//Used for getting user info for that day after the user logs in
app.post('/api/user/info', auth, async (req, res) => {
    if(!req.body.date) {
        res.status(400).send({"error": "No date specified."});
        return;
    }
    let date = req.body.date;
    let user = req.user;
    let query = `SELECT * FROM day WHERE p_fk = $1 AND date_ = $2`;
    let json = {
        d_id: null,
        date_: null,
        p_fk: null,
        calories: [],
        exercises: []
    }
    let params = [user.p_id, date];
    let result;
    try{
        result = await db.query(query, params);
    } catch(e) {
        res.status(400).send({"Error": "An error occurred while fetching the day"});
        return;
    }
    if(result.rows.length !== 0) {
        json = {...json,...result.rows[0]}
        try{
            result = await db.query(`SELECT * FROM calories WHERE d_id = $1`,[json.d_id]);
            if(result.rows.length !== 0) {
                json.calories = [...result.rows]
            }
        } catch(e) {
            res.status(400).send({"error":"could not load in calories for this day"});
            return;
        }
        try{
            result = await db.query(`SELECT * FROM exercises WHERE d_id = $1`, [json.d_id]);
            if(result.rows.length !== 0) {
                json.exercises = [...result.rows];
            }
            res.status(200).send({"success": "the query was a success, info below", ...json});
        } catch(e) {
            res.status(400).send({"error":"could not load in exercises for this day"});
            return;
        }
    }
    else{
        try{
            result = await db.query(`INSERT INTO day (p_fk, date_) VALUES($1, $2) RETURNING *`, params);
        } catch(e) {
            res.status(400).send({"error": "error occurred when creating a new day for this date and person"});
            return;
        }
        json = {...json, ...result.rows[0]}
        res.status(200).send({"success": "day successfully created", ...json});
    }
})

//Add a new calories item for that day
//Used for when the user wants to add the calories for something they ate that day
app.post('/api/user/info/addCalories', auth, async (req, res) => {
    let errors = [];
    if(!req.body.date) {
        errors.push("Need to specify a date");
    }
    if(!req.body.amount) {
        errors.push("Need to specify an amount");
    }
    if(errors.length !== 0) {
        res.status(400).send(errors);
        return;
    }
    let calorieData;
    try{
        let result = await db.query('SELECT d_id FROM day WHERE date_ = $1 AND p_fk = $2',[req.body.date, req.user.p_id]);
        calorieData = [result.rows[0].d_id,req.body.amount,req.body.description ? req.body.description : null];
    } catch(e) {
        res.status(400).send({"error": "something went wrong when searching for the correct day from the date given"});
        return;
    }
    try{
        await db.query('INSERT INTO calories (d_id,amount,description) VALUES($1, $2, $3)',calorieData);
        res.status(200).send({"Success": "calorie data successfully added"});
    } catch(e) {
        res.status(400).send({"error": "could not add calorie data"});
    }
})
//Add a new exercises item for that day
//Used for when the user wants to add an exercise they did that day
app.post('/api/user/info/addExercises', auth, async (req, res) => {
    let errors = [];
    if(!req.body.date) {
        errors.push("Need to specify a date");
    }
    if(!req.body.amount) {
        errors.push("Need to specify an amount");
    }
    if(errors.length !== 0) {
        res.status(400).send(errors);
        return;
    }
    let exerciseData;
    try{
        let result = await db.query('SELECT d_id FROM day WHERE date_ = $1 AND p_fk = $2',[req.body.date, req.user.p_id]);
        exerciseData = [result.rows[0].d_id,req.body.amount,req.body.description ? req.body.description : null];
    } catch(e) {
        res.status(400).send({"error": "something went wrong when searching for the correct day from the date given"});
        return;
    }
    try{
        await db.query('INSERT INTO exercises (d_id,amount,description) VALUES($1, $2, $3)',exerciseData);
        res.status(200).send({"Success": "exercise data successfully added"});
    } catch(e) {
        res.status(400).send({"error": "could not add exercise data"});
    }
})
app.delete('/api/days', (req, res) => {
    db.query('DELETE FROM day', (err, result) => {
        if(err) {
            res.status(400).send({"err": "couldnt delete rows"});
        }
        else {
            res.status(200).send("successfully deleted all (day) rows.")
        }
    })
}) 