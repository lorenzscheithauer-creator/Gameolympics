import express from 'express';
import cors from 'cors';
import path from 'path';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import db from './config/db.js'; // Import to initialize the db connection

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
const __dirname = path.resolve();
// server.js is in /backend, so we go up one level to the project root
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// API Routes
app.use('/api/users', userRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
