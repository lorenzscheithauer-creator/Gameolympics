import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        // In a real app, you'd want to handle this more gracefully
        // For now, logging and exiting is sufficient to see the error.
        console.error("DB Connection Error:", err.message);
        process.exit(1);
    }
    console.log('Connected to the SQlite database.');
});

export default db;
