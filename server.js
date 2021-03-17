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

//Allow the express ap to parse json and read urlencoded data
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
                const token = jwt.sign({id: row.id}, process.env.SECRET);
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
    if(!req.body.password) {
        errors.push("No password specified.");
    }
    if(!req.body.email) {
        errors.push("No email specified.");
    }
    if(!req.body.name) {
        errors.push("No name specified.");
    }
    if(errors.length !== 0) {
        res.status(400).json({
            "error":errors
        })
    }
    else{
        let data = {
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password)
        }
        let sql = `INSERT INTO person (name, email, password) VALUES ($1, $2, $3) RETURNING p_id`;
        let params = [data.name, data.email, data.password];
        db.query(sql, params, function(err, result) {
            if(err) {
                res.status(400).json({
                    "error": err
                });
            }
            else{
                const token = jwt.sign({id: result.rows[0].id}, process.env.SECRET);
                res.json({
                    "message": "success",
                    "data": data,
                    "token": token
                });
            }
        });
    }
})