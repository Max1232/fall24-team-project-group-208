import express from 'express';
import { FakeSOSocket } from '../types';
import { updateQuizReputation } from '../models/application';

const quizController = (socket: FakeSOSocket) => {
  const router = express.Router();

  router.post('/reputation', async (req, res) => {
    const { username, isCorrect } = req.body;
    const result = await updateQuizReputation(username, isCorrect);

    if (result.success) {
      socket.emit('reputationUpdate', { username });
      res.json({ success: true });
    } else {
      res.status(500).json({ error: result.error });
    }
  });

  return router;
};

export default quizController;
