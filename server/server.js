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
  const newEmployees = req.body; // This should now be an array of employees
  console.log(newEmployees);
  
  // Add validation for newEmployees here if needed

  // Start building the SQL command
  let sql = `BEGIN TRANSACTION;`;

  // Build a separate INSERT statement for each employee
  for (let newEmployee of newEmployees) {
      sql += `INSERT INTO Employees (ID, Sex, FirstName, MiddleName, LastName, Email, StartDate, PositionID, BranchID, SupervisorID, Status) 
              VALUES (${newEmployee.ID}, '${newEmployee.Sex}', '${newEmployee.FirstName}', '${newEmployee.MiddleName}', 
                      '${newEmployee.LastName}', '${newEmployee.Email}', '${newEmployee.StartDate}', ${newEmployee.PositionID},
                      ${newEmployee.BranchID}, ${newEmployee.SupervisorID}, '${newEmployee.Status}');`
  }

  // Finish building the SQL command
  sql += `COMMIT;`;

  // Execute the SQL command
  db.exec(sql, function(err) {
      if (err) {
          console.log(err);
          res.status(500).json({ error: err.message });
          return;
      }

      // If successful, respond with the number of inserted employees
      res.json({ insertedCount: newEmployees.length });
  });
});

// Return all rows in the Employees table
app.get('/api/employees', (req, res) => {
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
