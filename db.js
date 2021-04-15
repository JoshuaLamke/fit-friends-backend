//Require postgress
const {Client} = require('pg');

//Create client
let client;
if(!process.env.DATABASE_URL) {
  client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'fit-friends',
    password: 'joshua',
    port: 5432,
  });
}
else {
  client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
  })
}
//Connect to client
client.connect();

const CREATE_PERSON_TABLE_SQL =`CREATE TABLE person (
  p_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL, 
  email TEXT UNIQUE NOT NULL, 
  password TEXT NOT NULL,
  height TEXT DEFAULT '',
  weight TEXT DEFAULT '',
  gender TEXT DEFAULT '',
  role_model TEXT NOT NULL DEFAULT 'none'
  );`
//Query the db to see if connection was successful
client.query(CREATE_PERSON_TABLE_SQL, (err, res) => {
  if(err) {
  }
  else {
    console.log('Person table successfully created.')
  }
  });
const CREATE_DAY_TABLE_SQL =`CREATE TABLE day (
  d_id SERIAL PRIMARY KEY,
  date_ DATE NOT NULL,
  calorie_goal INT DEFAULT 2000,
  p_fk INT NOT NULL,
  CONSTRAINT person_fk FOREIGN KEY(p_fk) 
  REFERENCES person(p_id)
  ON DELETE CASCADE
  );`
client.query(CREATE_DAY_TABLE_SQL, (err, res) => {
  if(err) {
  }
  else {
    console.log('Day table successfully created.')
  }
});
const CREATE_CALORIES_TABLE_SQL = `CREATE TABLE calories (
  c_id SERIAL PRIMARY KEY,
  amount INT NOT NULL,
  description TEXT,
  d_id INT NOT NULL,
  type TEXT NOT NULL,
  CONSTRAINT day_calorie_fk FOREIGN KEY(d_id)
  REFERENCES day(d_id)
  ON DELETE CASCADE
);`
client.query(CREATE_CALORIES_TABLE_SQL, (err, res) => {
  if(err) {
  }
  else {
    console.log('Calories table successfully created.')
  }
});
const CREATE_EXERCISES_TABLE_SQL = `CREATE TABLE exercises (
  e_id SERIAL PRIMARY KEY,
  amount DECIMAL NOT NULL,
  description TEXT,
  d_id INT NOT NULL,
  sets INT,
  reps INT,
  CONSTRAINT day_calorie_fk FOREIGN KEY(d_id)
  REFERENCES day(d_id)
  ON DELETE CASCADE
);`
client.query(CREATE_EXERCISES_TABLE_SQL, (err, res) => {
  if(err) {
  }
  else {
    console.log('Exercises table successfully created.')
  }
});
module.exports = client;
