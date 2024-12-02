import mongoose from 'mongoose';
import AnswerModel from './models/answers';
import QuestionModel from './models/questions';
import TagModel from './models/tags';
import UserModel from './models/users';
import CommentModel from './models/comments';
import { Answer, Comment, Question, Tag, User } from './types';
import {
  Q1_DESC, Q1_TXT, Q2_DESC, Q2_TXT, Q3_DESC, Q3_TXT, Q4_DESC, Q4_TXT,
  A1_TXT, A2_TXT, A3_TXT, A4_TXT, A5_TXT, A6_TXT, A7_TXT, A8_TXT,
  T1_NAME, T1_DESC, T2_NAME, T2_DESC, T3_NAME, T3_DESC,
  T4_NAME, T4_DESC, T5_NAME, T5_DESC, T6_NAME, T6_DESC,
  C1_TEXT, C2_TEXT, C3_TEXT, C4_TEXT, C5_TEXT, C6_TEXT,
  C7_TEXT, C8_TEXT, C9_TEXT, C10_TEXT, C11_TEXT, C12_TEXT
} from './data/posts_strings';

const userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
  throw new Error('ERROR: You need to specify a valid mongodb URL as the first argument');
}

const mongoDB = userArgs[0];
mongoose.connect(mongoDB);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));


async function createUser(
    username: string,
    uid: string,
    initialReputation: number = 0,
    role: number = 1,
    badges: string[] = []
): Promise<User> {
  const user: User = {
    uid,
    username,
    reputation: initialReputation,
    level: Math.floor(initialReputation / 100) + 1,
    levelThreshold: (Math.floor(initialReputation / 100) + 1) * 100,
    levelProgress: initialReputation % 100,
    answers: 0,
    questions: 0,
    acceptedAnswers: 0,
    comments: 0,
    badges,
    joinedDate: new Date(),
    role
  };
  return await UserModel.create(user);
}

async function createQuizQuestion(
    title: string,
    text: string,
    tags: Tag[],
    askedBy: string,
    answerUsers: string[],
    answers: string[]
): Promise<Question> {
  const answerDocs = await Promise.all(
      answers.map(async (answerText, index) => {
        return await AnswerModel.create({
          text: answerText,
          ansBy: answerUsers[index],
          ansDateTime: new Date(),
          comments: []
        });
      })
  );

  return await QuestionModel.create({
    title,
    text,
    tags,
    askedBy,
    askDateTime: new Date(),
    answers: answerDocs,
    views: [],
    upVotes: [],
    downVotes: [],
    comments: []
  });
}

async function populate() {
  try {
    const users = await Promise.all([
      await createUser('john_mod', 'uid_john_mod', 2500, 0, ['Moderator', 'Expert', 'Teacher']),
      await createUser('sarah_expert', 'uid_sarah_expert', 2000, 1, ['Expert', 'Teacher', 'Quick Learner']),
      await createUser('JohnnyDev', 'uid_johnny_dev', 1500, 1, ['Helper', 'Enthusiast']),
      await createUser('alice_dev', 'uid_alice_dev', 1200, 1, ['Active Participant', 'Rising Star']),
      await createUser('bob_learner', 'uid_bob_learner', 500, 1, ['Newcomer']),
      await createUser('naiveFox', 'uid_naive_fox', 100, 1, ['Beginner'])
    ]);

    const tags = await Promise.all([
      await TagModel.create({ name: 'react', description: T1_DESC }),
      await TagModel.create({ name: 'javascript', description: T2_DESC }),
      await TagModel.create({ name: 'android-studio', description: T3_DESC }),
      await TagModel.create({ name: 'shared-preferences', description: T4_DESC }),
      await TagModel.create({ name: 'storage', description: T5_DESC })
    ]);

    // React Hooks Quiz
    await createQuizQuestion(
        'Understanding React useEffect Dependencies',
        'What is the correct way to handle useEffect dependencies for optimal performance?',
        [tags[0], tags[1]],
        'sarah_expert',
        ['bob_learner', 'alice_dev', 'JohnnyDev', 'john_mod'],
        [
          'Dependencies only matter for the cleanup function',
          'Empty dependency array runs effect only on mount and cleanup on unmount',
          'No dependency array means the effect runs on every render',
          'Dependencies should always include all state variables used in the effect'
        ]
    );

    // JavaScript Closure Quiz
    await createQuizQuestion(
        'JavaScript Closure Behavior',
        'What is the expected behavior of closures in JavaScript regarding variable scope?',
        [tags[1]],
        'JohnnyDev',
        ['john_mod', 'alice_dev', 'sarah_expert', 'naiveFox'],
        [
          'Closures only work with const variables',
          'Closures capture variables by reference from their outer scope',
          'Closures create a new copy of variables each time',
          'Closures only work in async functions'
        ]
    );

    // Android Storage Quiz
    await createQuizQuestion(
        'Android Data Persistence',
        'Which storage mechanism is most appropriate for small key-value pairs in Android?',
        [tags[2], tags[4]],
        'alice_dev',
        ['bob_learner', 'sarah_expert', 'john_mod', 'naiveFox'],
        [
          'Store everything in plain text files',
          'Use internal storage for all data types',
          'SharedPreferences with apply() for async writes',
          'Always use SQLite for all data storage'
        ]
    );

    // React State Quiz
    await createQuizQuestion(
        'React State Updates',
        'How does React handle multiple setState calls within the same event handler?',
        [tags[0]],
        'john_mod',
        ['JohnnyDev', 'alice_dev', 'sarah_expert', 'naiveFox'],
        [
          'Each setState causes an immediate re-render',
          'setState is synchronous in event handlers',
          'React may batch multiple setState calls for performance',
          'Updates are always processed in strict order'
        ]
    );

    // JavaScript Event Loop Quiz
    await createQuizQuestion(
        'JavaScript Event Loop and Promises',
        'How does the event loop handle Promises versus setTimeout?',
        [tags[1]],
        'sarah_expert',
        ['bob_learner', 'JohnnyDev', 'alice_dev', 'naiveFox'],
        [
          'They run in the order they are called',
          'Promise microtasks run before setTimeout macrotasks',
          'setTimeout always runs before Promises',
          'It depends on the browser implementation'
        ]
    );

    console.log('Database populated with quiz questions and users');
  } catch (err) {
    console.log('ERROR: ' + err);
  } finally {
    if (db) await db.close();
  }
}

populate().then(() => {
  console.log('Database population completed');
});