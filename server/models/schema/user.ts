import { Schema } from 'mongoose';

const userSchema: Schema = new Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    reputation: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 0,
    },
    levelThreshold: {
      type: Number,
      default: 0,
    },
    levelProgress: {
      type: Number,
      default: 0,
    },
    answers: {
      type: Number,
      default: 0,
    },
    questions: {
      type: Number,
      default: 0,
    },
    acceptedAnswers: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
    __v: {
      type: Number,
      default: 0,
    },
    badges: {
      type: [String],
      default: [],
    },
  },
  {
    collection: 'users',
  },
);

export default userSchema;
