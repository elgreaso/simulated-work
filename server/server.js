// Import necessary modules
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const path = require('path');

// Initialize an Express.js app and enable CORS
const app = express();
app.use(cors());

// Initialize the database connection
let db;

let counter = 0;

// Helper function to initialize the database
async function initializeDatabase() {
  return new Promise((resolve, reject) => {
      // Resolve the database path
      const dbPath = path.resolve(__dirname, '.', 'db', `database-${counter++}.db`);

      db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.error('Error creating database ', err);
            reject(err);
        } else {
            console.log('Database created');
            fs.readFile(path.join(__dirname, '.', 'db', 'init.sql'), { encoding: 'utf-8' })
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

// Use middleware to parse JSON
app.use(express.json());

// POST endpoint for adding a new employee
app.post('/api/employees', (req, res) => {
    const newEmployees = req.body; // Assume this is an array of employee objects

    // Build a SQL command for a bulk insert
    const placeholders = newEmployees.map(() => '(?,?,?,?,?,?,?,?,?,?,?)').join(',');
    const sql = `INSERT INTO Employees (ID, Sex, FirstName, MiddleName, LastName, Email, StartDate, PositionID, BranchID, SupervisorID, Status) VALUES ${placeholders}`;

    // Flatten the employee objects into an array of parameters for the SQL command
    const params = newEmployees.flatMap(employee => [
        employee.ID, employee.Sex, employee.FirstName, employee.MiddleName, 
        employee.LastName, employee.Email, employee.StartDate, employee.PositionID,
        employee.BranchID, employee.SupervisorID, employee.Status
    ]);
  
    // Execute the SQL command
    db.run(sql, params, function(err) {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
            return;
        }

        // If successful, respond with the number of inserted employees
        res.json({ count: newEmployees.length });
    });
});

// Return rows from the Employees table
app.get('/api/employees', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : null;
  let sql = 'SELECT * FROM Employees';
  let params = [];

  if (limit) {
    sql += ' LIMIT ?';
    params.push(limit);
  }

  db.all(sql, params, (err, rows) => {
    if (err) {      throw err;
    }
    res.json(rows);
  });
});

// Confirmation message for when the server is running
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
const port = process.env.PORT || 3001;
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
