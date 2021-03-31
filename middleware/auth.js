const jwt = require("jsonwebtoken");
let db = require("../db");
const authenticate = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, process.env.SECRET);
    } catch(err) {
        res.status(400).json({"Error": "Please Authenticate"})
        return;
    }
    if(!decodedToken.p_id){
        res.status(400).json({"Error": "Please Authenticate"})
        return;
    }
    let p_id = decodedToken.p_id;
    db.query(`SELECT * FROM person WHERE p_id = ${p_id}`, (err, result) => {
        if(!result.rows.length) {
            res.status(401).send({
                "Error": "Cannot find user, make sure you have the correct authentication"
            });
        }
        else {
            req.user = result.rows[0];
            next();
        }
    })
}
module.exports = authenticate 