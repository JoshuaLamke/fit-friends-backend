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
app.post('/api/user/info', auth, (req, res) => {
    if(!req.body.date) {
        res.status(400).send({"error": "No date specified."});
    }
    let date = req.body.date;
    let user = req.user;
    let query = `SELECT * FROM day WHERE p_fk = $1 AND date_ = $2`;
    let params = [user.p_id, date];
    db.query(query, params, (err, result) => {
        if(err) {
            res.status(400).send({"error" : "Something has gone wrong with fetching the day."});
        }
        else {
            if(result.rows[0]) {
                res.status(200).json({...result.rows[0]});
            }
            else {
                db.query(`INSERT INTO day (p_fk, date_) VALUES($1, $2) RETURNING *`, params, (err, result) => {
                    if(err) {
                        res.status(400).send({"error" : "something has gone wrong with creation of new day."});
                    }
                    else{
                        res.status(200).send({...result.rows[0]});
                    }
                })
            }
        }
    })
})
//Update the users information for that day
//Used for when you want to save the data that the user has inputted into the app
app.post('/api/user/info/update', auth, (req, res) => {
    
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