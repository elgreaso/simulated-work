// Import necessary modules
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite').verbose();
const fs = require('fs').promises;
const path = require('path');

// Initialize an Express.js app and enable CORS
const app = express();
app.use(cors());

// Initialize the database connection
let db;

// Helper function to initialize the database
async function initializeDatabase() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error('Error opening database ', err);
                reject(err);
            } else {
                console.log('Database connected');
                fs.readFile(path.join(__dirname, 'init.sql'), { encoding: 'utf-8' })
                    .then((data) => {
                        db.exec(data, (err) => {
                            if (err) {
                                console.error('Could not run init.sql:', err);
                                reject(err);
                            }
                            resolve();
                        });
                    })
                    .catch((err) => {
                        console.error('Could not read from init.sql:', err);
                        reject(err);
                    });
            }
        });
    });
}

// Endpoint to initialize the database
app.get('/initialize', async (req, res) => {
    try {
        await initializeDatabase();
        res.json({ message: 'Database initialized' });
    } catch (error) {
        console.error('Failed to initialize database:', error);
        res.status(500).json({ message: 'Failed to initialize database' });
    }
});

// Return all rows in the Employees table
app.get('/employees', (req, res) => {
  const sql = "SELECT * FROM Employees";
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

// Confirmation message for when the server is running
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const port = process.env.PORT || 3001;
// Start the server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Close the database connection on shutdown
process.on('SIGINT', () => { 
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Closed the database connection.');
  });
  server.close(() => {
    console.log('Server stopped.');
    process.exit(0);
  });
});
