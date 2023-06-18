// Setting up a basic server with Node.js and Express.js
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const app = express();

app.use(cors());

// All your routes and database operations will go here.

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

// Creating a helper function to initialize the database
const fs = require('fs');
const path = require('path');

function initializeDatabase() {
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database ', err);
        } else {
            console.log('Database connected');
            const initSqlPath = path.join(__dirname, 'init.sql');
            fs.readFile(initSqlPath, { encoding: 'utf-8' }, (err, data) => {
                if (err) {
                    console.error('Could not read from init.sql:', err);
                    return;
                }
                db.exec(data, (err) => {
                    if (err) {
                        console.error('Could not run init.sql:', err);
                    }
                });
            });
        }
    });
}

// Creating an endpoint to initialize the database
app.get('/initialize', (req, res) => {
    initializeDatabase();
    res.json({ message: 'Database initialized' });
});
