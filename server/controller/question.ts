import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  Question,
  FindQuestionRequest,
  FindQuestionByIdRequest,
  AddQuestionRequest,
  VoteRequest,
  FakeSOSocket,
  UpdateTagsRequest,
} from '../types';
import {
  addVoteToQuestion,
  fetchAndIncrementQuestionViewsById,
  filterQuestionsByAskedBy,
  filterQuestionsBySearch,
  getQuestionsByOrder,
  processTags,
  populateDocument,
  saveQuestion,
  filterQuestionsByTag,
  updateQuestionTagsAndIndex,
} from '../models/application';

/**
 * Controller for handling question-related routes.
 *
 * @param socket - The WebSocket server instance for real-time updates
 * @returns Express router configured with question routes
 */
const questionController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Retrieves questions based on filter criteria.
   *
   * @param req - The request object containing filter criteria
   * @param res - The response object to send the filtered questions
   */
  const getQuestionsByFilter = async (req: FindQuestionRequest, res: Response): Promise<void> => {
    try {
      const { order, search, askedBy } = req.query;

      let qlist: Question[] = await getQuestionsByOrder(order);

      if (typeof search === 'string' && search !== 'undefined' && search.trim()) {
        qlist = await filterQuestionsBySearch(qlist, search);
      }

      if (typeof askedBy === 'string' && askedBy.trim()) {
        qlist = filterQuestionsByAskedBy(qlist, askedBy);
      }

      res.json(qlist);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching questions by filter: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching questions by filter`);
      }
    }
  };

  /**
   * Retrieves questions based on a specific tag.
   *
   * @param req - The request object containing the tag
   * @param res - The response object to send the filtered questions
   */
  const getQuestionsByTag = async (req: FindQuestionRequest, res: Response): Promise<void> => {
    const { order } = req.query;
    const { search } = req.query;
    try {
      const qlist: Question[] = await getQuestionsByOrder(order);

      const resqlist: Question[] = await filterQuestionsByTag(qlist, search);

      res.json(resqlist);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching questions by filter: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching questions by filter`);
      }
    }
  };

  /**
   * Retrieves a question by its ID.
   *
   * @param req - The request object containing the question ID
   * @param res - The response object to send the question
   */
  const getQuestionById = async (req: FindQuestionByIdRequest, res: Response): Promise<void> => {
    const { qid } = req.params;
    const { username } = req.query;

    if (!ObjectId.isValid(qid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    if (username === undefined) {
      res.status(400).send('Invalid username requesting question.');
      return;
    }

    try {
      const q = await fetchAndIncrementQuestionViewsById(qid, username);

      if (q && !('error' in q)) {
        socket.emit('viewsUpdate', q);
        res.json(q);
        return;
      }

      throw new Error('Error while fetching question by id');
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching question by id: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching question by id`);
      }
    }
  };

  /**
   * Validates the question body.
   *
   * @param question - The question object to validate
   * @returns True if the question body is valid, false otherwise
   */
  const isQuestionBodyValid = (question: Question): boolean =>
    question.title !== undefined &&
    question.title !== '' &&
    question.text !== undefined &&
    question.text !== '' &&
    question.tags !== undefined &&
    question.tags.length > 0 &&
    question.askedBy !== undefined &&
    question.askedBy !== '' &&
    question.askDateTime !== undefined &&
    question.askDateTime !== null;

  /**
   * Adds a new question.
   *
   * @param req - The request object containing the question data
   * @param res - The response object to send the added question
   */
  const addQuestion = async (req: AddQuestionRequest, res: Response): Promise<void> => {
    if (!isQuestionBodyValid(req.body)) {
      res.status(400).send('Invalid question body');
      return;
    }
    const question: Question = req.body;
    try {
      const questionswithtags: Question = {
        ...question,
        tags: await processTags(question.tags),
      };
      if (questionswithtags.tags.length === 0) {
        throw new Error('Invalid tags');
      }
      const result = await saveQuestion(questionswithtags);
      if ('error' in result) {
        throw new Error(result.error);
      }

      const populatedQuestion = await populateDocument(result._id?.toString(), 'question');

      if (populatedQuestion && 'error' in populatedQuestion) {
        throw new Error(populatedQuestion.error);
      }

      socket.emit('questionUpdate', populatedQuestion as Question);
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving question: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving question`);
      }
    }
  };

  /**
   * Handles voting on a question.
   *
   * @param req - The request object containing the vote data
   * @param res - The response object to send the vote result
   * @param type - The type of vote ('upvote' or 'downvote')
   */
  const voteQuestion = async (
    req: VoteRequest,
    res: Response,
    type: 'upvote' | 'downvote',
  ): Promise<void> => {
    if (!req.body.qid || !req.body.username) {
      res.status(400).send('Invalid request');
      return;
    }

    const { qid, username } = req.body;

    try {
      let status;
      if (type === 'upvote') {
        status = await addVoteToQuestion(qid, username, type);
      } else {
        status = await addVoteToQuestion(qid, username, type);
      }

      if (status && 'error' in status) {
        throw new Error(status.error as string);
      }

      socket.emit('voteUpdate', { qid, upVotes: status.upVotes, downVotes: status.downVotes });
      res.json({ msg: status.msg, upVotes: status.upVotes, downVotes: status.downVotes });
    } catch (err) {
      res.status(500).send(`Error when ${type}ing: ${(err as Error).message}`);
    }
  };

  /**
   * Upvotes a question.
   *
   * @param req - The request object containing the vote data
   * @param res - The response object to send the vote result
   */
  const upvoteQuestion = async (req: VoteRequest, res: Response): Promise<void> => {
    voteQuestion(req, res, 'upvote');
  };

  /**
   * Downvotes a question.
   *
   * @param req - The request object containing the vote data
   * @param res - The response object to send the vote result
   */
  const downvoteQuestion = async (req: VoteRequest, res: Response): Promise<void> => {
    voteQuestion(req, res, 'downvote');
  };

  /**
   * Updates the tags of a question.
   *
   * @param req - The request object containing the updated tags
   * @param res - The response object to send the updated question
   */
  const updateQuestionTags = async (req: UpdateTagsRequest, res: Response): Promise<void> => {
    const { qid, tags, correctAnswerIndex } = req.body;

    if (!qid || !ObjectId.isValid(qid) || !tags) {
      res.status(400).send('Invalid request parameters');
      return;
    }

    try {
      const result = await updateQuestionTagsAndIndex(qid, tags, correctAnswerIndex);

      if ('error' in result) {
        throw new Error(result.error);
      }

      socket.emit('questionUpdate', result);
      res.json(result);
    } catch (err) {
      res.status(500).send(`Error updating question tags: ${(err as Error).message}`);
    }
  };

  // Define routes
  router.get('/getQuestion', getQuestionsByFilter);
  router.get('/getQuestionByTag', getQuestionsByTag);
  router.get('/getQuestionById/:qid', getQuestionById);
  router.post('/addQuestion', addQuestion);
  router.post('/upvoteQuestion', upvoteQuestion);
  router.post('/downvoteQuestion', downvoteQuestion);
  router.post('/updateTags', updateQuestionTags);

  return router;
};

export default questionController;
