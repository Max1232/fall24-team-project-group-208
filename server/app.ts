import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import * as http from 'http';

import answerController from './controller/answer';
import questionController from './controller/question';
import tagController from './controller/tag';
import commentController from './controller/comment';
import { FakeSOSocket } from './types';

dotenv.config();

const MONGO_URL = `${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'}/fake_so`;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const port = parseInt(process.env.PORT || '8000');

mongoose
    .connect(MONGO_URL)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log('MongoDB connection error: ', err));

const app = express();
const server = http.createServer(app);
const socket: FakeSOSocket = new Server(server, {
    cors: { origin: '*' },
});

// Authentication middleware
const authenticateRequest = (req: Request, res: Response, next: Function) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(); // Allow requests without auth header for now
    }

    // If you want to verify Firebase tokens on the server side:
    // const token = authHeader.split('Bearer ')[1];
    // admin.auth().verifyIdToken(token)
    //   .then(decodedToken => {
    //     req.user = decodedToken;
    //     next();
    //   })
    //   .catch(error => {
    //     res.status(401).json({ error: 'Unauthorized' });
    //   });

    next();
};

// CORS configuration
app.use(
    cors({
        credentials: true,
        origin: [CLIENT_URL],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);

app.use(express.json());
app.use(authenticateRequest); // Add authentication middleware

app.get('/', (req: Request, res: Response) => {
    res.send('hello world');
});

app.use('/question', questionController(socket));
app.use('/tag', tagController());
app.use('/answer', answerController(socket));
app.use('/comment', commentController(socket));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error('Server error:', err);
    res.status(500).send('Internal Server Error');
});

// Socket connection handling
socket.on('connection', socket => {
    console.log('A user connected ->', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Graceful shutdown
process.on('SIGINT', () => {
    server.close(() => {
        mongoose.disconnect();
        console.log('Server closed.');
        process.exit(0);
    });
    socket.close();
});

function startServer() {
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export { app, server, startServer };