import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';

async function initializeDatabase() {
  const db = await open({
    filename: '../db/database.db',
    driver: sqlite3.Database,
  });

  const initScript = fs.readFileSync(path.resolve(__dirname, '../db/init.sql')).toString();

  await db.exec(initScript);

  console.log('Database initialized');
}

initializeDatabase().then(() => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}).catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
