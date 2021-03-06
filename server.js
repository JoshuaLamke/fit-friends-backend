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
                res.status(201).send(userInfo);
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
            password: md5(req.body.password),
            role_model: 'none'
        };
        let sql = `INSERT INTO person (name, email, password) VALUES ($1, $2, $3) RETURNING *`;
        let params = [data.name, data.email, data.password];
        //Query database and insert a new person into it
        db.query(sql, params, (err, response) => {
            if(err) {
                res.status(400).json({
                    "error": err
                });
            }
            else{
                let row = response.rows[0];
                const token = jwt.sign({p_id: row.p_id}, process.env.SECRET);
                res.status(201).json({
                    "message": "success",
                    "data": row,
                    "token": token
                });
            }
        });
    }
})

//Update the user's height.
app.post('/api/user/update/height', auth, async (req, res) => {
    if(!req.body.height) {
        res.status(200).send({"Success": "Endpoint successfully reached but no update occurred as height was empty"});
        return;
    }
    else{
        try{
            let response = await db.query(`UPDATE person SET height = $1 WHERE p_id = $2`, [req.body.height,req.user.p_id]);
            if(response.rowCount > 0) {
                res.status(200).send({"Success": "Height successfully updated."});
                return;
            }
            else{
                throw new Exception();
            }
        } catch(e) {
            res.status(400).send({"Error": "Something went wrong with updating height"});
            return;
        }
    }
})

//Update the user's weight.
app.post('/api/user/update/weight', auth, async (req, res) => {
    if(!req.body.weight) {
        res.status(200).send({"Success": "Endpoint successfully reached but no update occurred as weight was empty"});
        return;
    }
    else{
        try{
            let response = await db.query(`UPDATE person SET weight = $1 WHERE p_id = $2`, [req.body.weight,req.user.p_id]);
            if(response.rowCount > 0) {
                res.status(200).send({"Success": "Weight successfully updated."});
                return;
            }
            else{
                throw new Exception();
            }
        } catch(e) {
            res.status(400).send({"Error": "Something went wrong with updating weight"});
            return;
        }
    }
})

//Update the user's calorie goal for a date.
app.post('/api/user/info/update/caloriegoal', auth, async (req, res) => {
    if(!req.body.date) {
        res.status(400).send({"Error": "Must specify date for the calorie goal change."})
        return;
    }
    if(!req.body.calorie_goal) {
        res.status(200).send({"Error": "Must specify a calorie goal for the calorie goal change."});
        return;
    }
    else{
        try{
            let response = await db.query(`UPDATE day SET calorie_goal = $1 WHERE p_fk = $2 AND date_ = $3`, [req.body.calorie_goal,req.user.p_id, req.body.date]);
            if(response.rowCount > 0) {
                res.status(200).send({"Success": "Calorie goal successfully updated."});
                return;
            }
            else{
                throw new Exception();
            }
        } catch(e) {
            res.status(400).send({"Error": "Something went wrong with updating the calorie goal"});
            return;
        }
    }
})

//Update the user's gender.
app.post('/api/user/update/gender', auth, async (req, res) => {
    if(!req.body.gender) {
        res.status(200).send({"Success": "Endpoint successfully reached but no update occurred as gender was empty"});
        return;
    }
    else{
        try{
            let response = await db.query(`UPDATE person SET gender = $1 WHERE p_id = $2`, [req.body.gender,req.user.p_id]);
            if(response.rowCount > 0) {
                res.status(200).send({"Success": "Gender successfully updated."});
                return;
            }
            else{
                throw new Exception();
            }
        } catch(e) {
            res.status(400).send({"Error": "Something went wrong with updating gender"});
            return;
        }
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
        calorie_goal: null,
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
    if(!req.body.type) {
        errors.push("Need to specify type. eg. breakfast, lunch, etc")
    }
    if(errors.length !== 0) {
        res.status(400).send(errors);
        return;
    }
    let calorieData;
    try{
        let result = await db.query('SELECT d_id FROM day WHERE date_ = $1 AND p_fk = $2',[req.body.date, req.user.p_id]);
        calorieData = [result.rows[0].d_id,req.body.amount,req.body.description ? req.body.description : null, req.body.type];
    } catch(e) {
        res.status(400).send({"error": "something went wrong when searching for the correct day from the date given"});
        return;
    }
    try{
        let response = await db.query('INSERT INTO calories (d_id,amount,description,type) VALUES($1, $2, $3, $4) RETURNING c_id',calorieData);
        res.status(200).send({"Success": "calorie data successfully","c_id": response.rows[0].c_id});
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
        exerciseData = [result.rows[0].d_id,req.body.amount,req.body.description ? req.body.description : null,req.body.sets ? req.body.sets : null,req.body.reps ? req.body.reps : null];
    } catch(e) {
        res.status(400).send({"error": "something went wrong when searching for the correct day from the date given"});
        return;
    }
    try{
        let response = await db.query('INSERT INTO exercises (d_id,amount,description,sets,reps) VALUES($1, $2, $3, $4, $5) RETURNING e_id',exerciseData);
        res.status(200).send({"Success": "exercise data successfully added","e_id": response.rows[0].e_id});
    } catch(e) {
        res.status(400).send({"error": "could not add exercise data"});
    }
})

// Endpoint to set a role model
// Use when the user wants to set a role model
app.post('/api/roleModel', auth, async (req, res) => {
    if(!req.body.role_model) {
        res.status(400).send({"Error":"Need to specify a role model"});
        return;
    }
    try{
        let response = await db.query('UPDATE person SET role_model = $1 WHERE p_id = $2', [req.body.role_model, req.user.p_id]);
        if(response.rowCount === 0) {
            throw new Exception();
        }
        res.status(200).send({"Success": `Role model updated to '${req.body.role_model}'`});
    } catch(e) {
        res.status(400).send({"Error": `Could not update role model for person with p_id '${req.user.p_id}'`});
    }
    
})

// Endpoint for deleting calories
// Use when a user wants to remove something they ate
app.delete('/api/calories', auth, async (req, res) => {
    if(!req.body.c_id) {
        res.status(400).send({"Error": "Need to specify the c_id (calorie id) that you want to delete."});
        return;
    }
    try{
        let response = await db.query("DELETE FROM calories WHERE c_id = $1", [req.body.c_id]);
        if(response.rowCount === 0) {
           throw new Exception(); 
        }
        res.status(200).send({"Success": `Calorie with c_id '${req.body.c_id}' deleted`});
    } catch(e) {
        res.status(400).send({"Error":"Could not delete calorie with c_id '" + req.body.c_id + "'"});
    }

});

// Endpoint for deleting exercises
// Use when a user wants to remove an exercise
app.delete('/api/exercises', auth, async (req, res) => {
    if(!req.body.e_id) {
        res.status(400).send({"Error": "Need to specify the e_id (exercise id) that you want to delete."});
        return;
    }
    try{
        let response = await db.query("DELETE FROM exercises WHERE e_id = $1", [req.body.e_id]);
        if(response.rowCount === 0) {
           throw new Exception(); 
        }
        res.status(200).send({"Success": `Exercise with e_id '${req.body.e_id}' deleted`});
    } catch(e) {
        res.status(400).send({"Error":"Could not delete exercise with e_id '" + req.body.e_id + "'"});
    }
});

// Endpoint to delete an account
// Use when the user wants to delete their account
app.delete('/api/user', auth, async (req, res) => {
    let p_id = req.user.p_id;
    try {
        let response = await db.query('DELETE FROM person WHERE p_id = $1',[p_id]);
        if(response.rowCount === 0) {
            throw new Exception();
        }
        res.status(200).send({"Success": "User successfully deleted"});
    } catch (error) {
        res.status(400).send({"Error": "Could not delete user"});
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