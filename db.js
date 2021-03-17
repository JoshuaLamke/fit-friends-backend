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
  password TEXT NOT NULL
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
  calories TEXT,
  total_calories INT, 
  exercise TEXT,
  total_exercise INT,
  date_ DATE NOT NULL,
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
module.exports = client;
