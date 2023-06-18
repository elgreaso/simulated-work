// Import necessary modules and components
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Define an asynchronous function to initialize the database
async function initializeDatabase() {
  // Send a fetch request to the server to initialize the database
  const response = await fetch('http://localhost:3001/initialize');
  // Parse the JSON response from the server
  const data = await response.json();
  // Log the message from the server to the console
  console.log(data.message);
}

// Call the function to initialize the database
initializeDatabase()
  .then(() => {
    // Once the database has been initialized, create the root React component
    const root = ReactDOM.createRoot(
      document.getElementById('root') as HTMLElement
    );
    // Render the App component within the root component
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch((error) => {
    // If there was an error initializing the database, log the error to the console
    console.error('Failed to initialize database:', error);
    // TODO: Add error handling logic here
  });

// Call the reportWebVitals function (used for measuring performance in a production environment)
reportWebVitals();
