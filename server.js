//This file is the server for the application.
//It creates a connection to the database and returns a confirmation message when the server is running.
//It will facilitate the communication between the front-end and the back-end.
//It closes the database connection when the server is closed.
//It is based on the code from the following tutorial: https://www.sqlitetutorial.net/sqlite-nodejs/connect/  

//import the sqlite3 module
const sqlite3 = require('sqlite3').verbose();

//import the express module and create an instance of it
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

//open the database connection as read-only and log a message when the connection is established
let db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

//return all rows in the Employees table, store them in an array and return the array as a JSON object
app.get('/employees', (req, res) => {
  const sql = "SELECT * FROM Employees";
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

//confirmation message for when the server is running
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

//listen for incoming requests on the port specified above
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//close the database connection
process.on('SIGINT', () => { 
  db.close(); 
  process.exit(0); 
});
