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
import authController from './controller/auth';  // Add this import
import { FakeSOSocket } from './types';

dotenv.config();

const MONGO_URL = `${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'}/fake_so`;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const port = parseInt(process.env.PORT || '8000');

mongoose
    .connect(MONGO_URL)
    .then(() => console.log('MongoDB connected successfully'))  // Add success log
    .catch(err => console.log('MongoDB connection error: ', err));

const app = express();
const server = http.createServer(app);
const socket: FakeSOSocket = new Server(server, {
  cors: { origin: '*' },
});

function startServer() {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

socket.on('connection', socket => {
  console.log('A user connected ->', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    mongoose.disconnect();
    console.log('Server closed.');
    process.exit(0);
  });
  socket.close();
});

// CORS configuration with more detailed options
app.use(
    cors({
      credentials: true,
      origin: [CLIENT_URL],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Add explicit methods
      allowedHeaders: ['Content-Type', 'Authorization'],      // Add Authorization header
    }),
);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
  res.end();
});

// Add auth routes before other routes
app.use('/auth', authController(socket));

app.use('/question', questionController(socket));
app.use('/tag', tagController());
app.use('/answer', answerController(socket));
app.use('/comment', commentController(socket));

// Add basic error handling
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error('Server error:', err);
  res.status(500).send('Internal Server Error');
});

// Export the app instance
export { app, server, startServer };