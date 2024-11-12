/* eslint-disable @typescript-eslint/no-var-requires */
import express, { Response } from 'express';
import admin from 'firebase-admin';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as dotenv from 'dotenv';
import * as path from 'path';
import { AuthRequest, FakeSOSocket, ProfileCreatedPayload } from '../types';
import UserModel from '../models/users';

// Initialize Firebase Admin SDK

dotenv.config();

const SERVICE_ACCOUNT_PATH = process.env.KEY_PATH;
if (!SERVICE_ACCOUNT_PATH) {
  throw new Error('KEY_PATH is not defined in the environment variables');
}

// eslint-disable-next-line import/no-dynamic-require
const serviceAccount = require(path.resolve(SERVICE_ACCOUNT_PATH));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

/**
 * Controller for handling authentication-related routes.
 *
 * @param socket - The WebSocket server instance for real-time updates
 * @returns Express router configured with auth routes
 */
const authController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Middleware to verify Firebase token from request headers
   */
  const verifyToken = async (req: AuthRequest, res: Response, next: express.NextFunction) => {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      res.status(401).send('No token provided');
      return;
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = { uid: decodedToken.uid };
      next();
    } catch (error) {
      socket.emit('authError', { message: 'Invalid token' });
      res.status(401).send('Invalid token');
    }
  };

  /**
   * Creates a new user profile after Firebase authentication
   */
  const createUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { username } = req.body;
      const { uid } = req.user!;

      if (!username || !uid) {
        res.status(400).send('Username and UID are required');
        return;
      }

      // Check if username is taken
      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
        socket.emit('authError', { message: 'Username already taken' });
        res.status(400).send('Username already taken');
        return;
      }

      // Create user profile
      const user = await UserModel.create({
        uid,
        username,
        reputation: 0,
        joinedDate: new Date(),
      });

      const profilePayload: ProfileCreatedPayload = {
        username: user.username,
        reputation: user.reputation,
        joinedDate: user.joinedDate,
      };

      socket.emit('profileCreated', profilePayload);

      res.status(201).json(profilePayload);
    } catch (error) {
      socket.emit('authError', {
        message: `Error creating user profile: ${(error as Error).message}`,
      });
      res.status(500).send(`Error creating user profile: ${(error as Error).message}`);
    }
  };

  /**
   * Retrieves a user's profile by username
   */
  const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { username } = req.params;
      const user = await UserModel.findOne({ username }).select('-uid');

      if (!user) {
        res.status(404).send('User not found');
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).send(`Error fetching profile: ${(error as Error).message}`);
    }
  };

  // Test route
  router.get('/test', (_, res) => {
    res.json({ message: 'Auth controller is working' });
  });

  // Add routes
  router.post('/profile', verifyToken, createUserProfile);
  router.get('/profile/:username', getUserProfile);

  return router;
};

export default authController;
