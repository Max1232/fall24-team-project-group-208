import express, { Request, Response } from 'express';
import UserModel from '../models/users';

const userController = () => {
  const router = express.Router();

  /**
   * Get user profile data by username
   */
  const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username } = req.params;
      const user = await UserModel.findOne({ username });

      if (!user) {
        res.status(404).send('User not found');
        return;
      }

      res.json({
        username: user.username,
        reputation: user.reputation,
        level: user.level,
        levelThreshold: user.levelThreshold,
        levelProgress: user.levelProgress,
        answers: user.answers,
        questions: user.questions,
        acceptedAnswers: user.acceptedAnswers,
        comments: user.comments,
        joinedDate: user.joinedDate,
        badges: user.badges,
      });
    } catch (err) {
      res.status(500).send(`Error fetching user profile: ${(err as Error).message}`);
    }
  };

  // Add the route
  router.get('/:username', getUserProfile);

  return router;
};

export default userController;
