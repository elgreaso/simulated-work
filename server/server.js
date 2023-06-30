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

/**
 * Function: initializeDatabase
 *
 * This function initializes the database by creating a new SQLite database file and running an initialization script.
 * The function first reads the contents of the database directory and filters out any files that do not match the naming convention of "database-*.db".
 * It then determines the maximum number in the remaining file names and creates a new database file with a name that is one greater than the maximum number.
 * The function then reads the contents of the initialization script and executes it on the new database.
 *
 * @returns A Promise that resolves when the database has been successfully initialized and rejects if there is an error.
 */
async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    // Resolve the path to the database directory
    const dbDir = path.resolve(__dirname, '.', 'db');

    // Read the contents of the database directory
    fs.readdir(dbDir)
      .then(files => {
        // Filter out any files that do not match the naming convention of "database-*.db"
        const dbFiles = files.filter(f => f.startsWith('database-') && f.endsWith('.db'));

        // Determine the maximum number in the remaining file names
        let maxNumber = dbFiles.reduce((max, file) => {
          const number = parseInt(file.slice('database-'.length, -'.db'.length), 10);
          return isNaN(number) ? max : Math.max(max, number);
        }, 0);

        // Create a new database file with a name that is one greater than the maximum number
        const newDbFile = `database-${maxNumber + 1}.db`;
        const dbPath = path.join(dbDir, newDbFile);
        db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, err => {
          if (err) {
            console.error('Error creating database ', err);
            reject(err);
          } else {
            console.log('Database created at', dbPath);

            // Read the contents of the initialization script and execute it on the new database
            fs.readFile(path.join(__dirname, '.', 'db', 'init.sql'), { encoding: 'utf-8' })
              .then(data => {
                db.exec(data, err => {
                  if (err) {
                    console.error('Could not run init.sql:', err);
                    reject(err);
                  }
                  resolve();
                });
              })
              .catch(err => {
                console.error('Could not read from init.sql:', err);
                reject(err);
              });
          }
        });
      })
      .catch(err => {
        console.error('Could not read database directory:', err);
        reject(err);
      });
  });
}

/**
 * Endpoint: /initialize
 *
 * This endpoint initializes the database by calling the `initializeDatabase` function.
 * If the initialization is successful, the endpoint returns a JSON object with a message property set to "Database initialized".
 * If the initialization fails, the endpoint returns a JSON object with a message property set to "Failed to initialize database" and a status code of 500.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 *
 * @returns A Promise that resolves when the database has been successfully initialized and rejects if there is an error.
 */
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

/**
 * Endpoint: /api/employees
 *
 * This endpoint adds a new employee to the database by executing a bulk insert SQL command.
 * The endpoint expects an array of employee objects in the request body.
 * If the insert is successful, the endpoint returns a JSON object with a count property set to the number of inserted employees.
 * If the insert fails, the endpoint logs an error message to the console and returns a JSON object with an error property set to the error message and a status code of 500.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 *
 * @returns A Promise that resolves when the insert is successful and rejects if there is an error.
 */
app.post('/api/employees', (req, res) => {
    const newEmployees = req.body; // Assume this is an array of employee objects

    // Build a SQL command for a bulk insert
    const placeholders = newEmployees.map(() => '(?,?,?,?,?,?,?,?,?,?,?,?,?,?)').join(',');
    const sql = `INSERT INTO Employees (ID, DOB, Sex, FirstName, MiddleName, LastName, Email, StartDate, EndDate, EducationLevel, PositionID, BranchID, SupervisorID, Status) VALUES ${placeholders}`;

    // Flatten the employee objects into an array of parameters for the SQL command
    const params = newEmployees.flatMap(employee => [
        employee.ID, employee.DOB, employee.Sex, employee.FirstName, employee.MiddleName, 
        employee.LastName, employee.Email, employee.StartDate, employee.EndDate, employee.EducationLevel,
        employee.PositionID, employee.BranchID, employee.SupervisorID, employee.Status
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
