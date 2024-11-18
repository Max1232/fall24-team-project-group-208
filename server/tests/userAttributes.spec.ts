/* eslint-disable no-console */
import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';
import UserModel from '../models/users';
import { saveAnswer, saveQuestion, saveComment } from '../models/application';
import { User, Answer, Question, Comment } from '../types';

let mongoServer: MongoMemoryServer;

describe('User Attribute Modification Tests', () => {
  beforeAll(async () => {
    // Create an in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    // Clean up after tests
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('should increase user reputation by 5 and level by 1 when an answer is posted', async () => {
    // Create initial user data
    const initialUser: User = {
      uid: new mongoose.Types.ObjectId().toString(),
      username: 'test_user',
      reputation: 0,
      joinedDate: new Date(),
      level: 0,
      levelThreshold: 0,
      levelProgress: 0,
      answers: 0,
      questions: 0,
      acceptedAnswers: 0,
      comments: 0,
      badges: [],
    };
    // Save the initial user to the database
    const savedUser = await UserModel.create(initialUser);
    expect(savedUser).toBeDefined();
    expect(savedUser.reputation).toBe(0);
    expect(savedUser.level).toBe(0);
    expect(savedUser.answers).toBe(0);

    const savedUserCopy = (await UserModel.findOne({ username: initialUser.username })) as User;
    expect(savedUserCopy).toBeDefined();
    expect(savedUserCopy.reputation).toBe(0);

    // Create an answer from this user
    const answer: Answer = {
      _id: new mongoose.Types.ObjectId(),
      text: 'This is a test answer',
      ansBy: initialUser.username,
      ansDateTime: new Date(),
      comments: [],
    };
    // Save the answer which should trigger user updates
    const savedAnswer = (await saveAnswer(answer)) as Answer;
    expect(savedAnswer).toBeDefined();
    expect(savedAnswer.ansBy).toBe(initialUser.username);
    // Verify user updates in the database
    const updatedUser = await UserModel.findOne({ username: initialUser.username });
    console.log('updatedUser:', updatedUser);
    console.log('updatedUser?.reputation:', updatedUser?.reputation);
    console.log('updatedUser?.level:', updatedUser?.level);
    console.log('updatedUser?.answers:', updatedUser?.answers);
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.reputation).toBe(5); // Reputation increased by 5
    expect(updatedUser?.level).toBe(1); // Level increased by 1
    expect(updatedUser?.answers).toBe(1); // Answer count increased by 1
  });

  test('should increase user reputation by 2 when a question is posted', async () => {
    const initialUser: User = {
      uid: new mongoose.Types.ObjectId().toString(),
      username: 'test_user_question',
      reputation: 0,
      joinedDate: new Date(),
      level: 0,
      levelThreshold: 0,
      levelProgress: 0,
      answers: 0,
      questions: 0,
      acceptedAnswers: 0,
      comments: 0,
      badges: [],
    };
    const savedUser = await UserModel.create(initialUser);
    expect(savedUser).toBeDefined();
    expect(savedUser.reputation).toBe(0);

    const question: Question = {
      title: 'Test Question',
      text: 'This is a test question',
      tags: [],
      askedBy: initialUser.username,
      askDateTime: new Date(),
      answers: [],
      views: [],
      upVotes: [],
      downVotes: [],
      comments: [],
    };
    const savedQuestion = await saveQuestion(question);
    expect(savedQuestion).toBeDefined();

    const updatedUser = await UserModel.findOne({ username: initialUser.username });
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.reputation).toBe(2); // Reputation increased by 2
    expect(updatedUser?.questions).toBe(1); // Question count increased by 1
  });

  test('should increase user comments count by 1 when a comment is posted', async () => {
    const initialUser: User = {
      uid: new mongoose.Types.ObjectId().toString(),
      username: 'test_user_comment',
      reputation: 0,
      joinedDate: new Date(),
      level: 0,
      levelThreshold: 0,
      levelProgress: 0,
      answers: 0,
      questions: 0,
      acceptedAnswers: 0,
      comments: 0,
      badges: [],
    };
    const savedUser = await UserModel.create(initialUser);
    expect(savedUser).toBeDefined();
    expect(savedUser.reputation).toBe(0);

    const comment: Comment = {
      text: 'This is a test comment',
      commentBy: initialUser.username,
      commentDateTime: new Date(),
    };
    const savedComment = await saveComment(comment);
    expect(savedComment).toBeDefined();

    const updatedUser = await UserModel.findOne({ username: initialUser.username });
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.reputation).toBe(1); // Reputation increased by 1
    expect(updatedUser?.comments).toBe(1); // Comment count increased by 1
  });

  test('should increase user level when reputation exceeds threshold', async () => {
    const initialUser: User = {
      uid: new mongoose.Types.ObjectId().toString(),
      username: 'test_user_level',
      reputation: 9,
      joinedDate: new Date(),
      level: 1,
      levelThreshold: 10,
      levelProgress: 0,
      answers: 0,
      questions: 0,
      acceptedAnswers: 0,
      comments: 0,
      badges: [],
    };
    const savedUser = await UserModel.create(initialUser);
    expect(savedUser).toBeDefined();
    expect(savedUser.reputation).toBe(9);
    expect(savedUser.level).toBe(1);

    const answer: Answer = {
      _id: new mongoose.Types.ObjectId(),
      text: 'This is a test answer',
      ansBy: initialUser.username,
      ansDateTime: new Date(),
      comments: [],
    };
    const savedAnswer = await saveAnswer(answer);
    expect(savedAnswer).toBeDefined();

    const updatedUser = await UserModel.findOne({ username: initialUser.username });
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.reputation).toBe(14); // Reputation increased by 5
    expect(updatedUser?.level).toBe(2); // Level increased by 1
    expect(updatedUser?.levelThreshold).toBe(40); // New level threshold
  });

  test('should increase user level when reputation exceeds threshold for level 2', async () => {
    const initialUser: User = {
      uid: new mongoose.Types.ObjectId().toString(),
      username: 'test_user_level_2',
      reputation: 39,
      joinedDate: new Date(),
      level: 2,
      levelThreshold: 40,
      levelProgress: 0,
      answers: 0,
      questions: 0,
      acceptedAnswers: 0,
      comments: 0,
      badges: [],
    };
    const savedUser = await UserModel.create(initialUser);
    expect(savedUser).toBeDefined();
    expect(savedUser.reputation).toBe(39);
    expect(savedUser.level).toBe(2);

    const answer: Answer = {
      _id: new mongoose.Types.ObjectId(),
      text: 'This is a test answer',
      ansBy: initialUser.username,
      ansDateTime: new Date(),
      comments: [],
    };
    const savedAnswer = await saveAnswer(answer);
    expect(savedAnswer).toBeDefined();

    const updatedUser = await UserModel.findOne({ username: initialUser.username });
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.reputation).toBe(44); // Reputation increased by 5
    expect(updatedUser?.level).toBe(3); // Level increased by 1
    expect(updatedUser?.levelThreshold).toBe(90); // New level threshold
  });

  test('should increase user level when reputation exceeds threshold for level 3', async () => {
    const initialUser: User = {
      uid: new mongoose.Types.ObjectId().toString(),
      username: 'test_user_level_3',
      reputation: 89,
      joinedDate: new Date(),
      level: 3,
      levelThreshold: 90,
      levelProgress: 0,
      answers: 0,
      questions: 0,
      acceptedAnswers: 0,
      comments: 0,
      badges: [],
    };
    const savedUser = await UserModel.create(initialUser);
    expect(savedUser).toBeDefined();
    expect(savedUser.reputation).toBe(89);
    expect(savedUser.level).toBe(3);

    const answer: Answer = {
      _id: new mongoose.Types.ObjectId(),
      text: 'This is a test answer',
      ansBy: initialUser.username,
      ansDateTime: new Date(),
      comments: [],
    };
    const savedAnswer = await saveAnswer(answer);
    expect(savedAnswer).toBeDefined();

    const updatedUser = await UserModel.findOne({ username: initialUser.username });
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.reputation).toBe(94); // Reputation increased by 5
    expect(updatedUser?.level).toBe(4); // Level increased by 1
    expect(updatedUser?.levelThreshold).toBe(160); // New level threshold
  });
});
