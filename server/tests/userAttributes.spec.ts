import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';
import UserModel from '../models/users';
import { saveAnswer } from '../models/application';
import { User, Answer } from '../types';

let mongoServer: MongoMemoryServer;

describe('User Leveling Integration Tests', () => {
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
    await new Promise(resolve => {
      setTimeout(resolve, 100);
    }); // Wait for the database to update

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
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.reputation).toBe(5); // Reputation increased by 5
    expect(updatedUser?.level).toBe(1); // Level increased by 1
    expect(updatedUser?.answers).toBe(1); // Answer count increased by 1
  });
});
