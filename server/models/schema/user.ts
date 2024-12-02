import { Schema } from 'mongoose';

/**
 * Mongoose schema for the User model.
 * Defines the structure of the user documents in the MongoDB collection.
 */
const userSchema: Schema = new Schema(
  {
    /**
     * Unique identifier for the user.
     * @type {String}
     * @required
     */
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    /**
     * Username of the user.
     * @type {String}
     * @required
     */
    username: {
      type: String,
      required: true,
      unique: true,
    },
    /**
     * Reputation points of the user.
     * @type {Number}
     * @default 0
     */
    reputation: {
      type: Number,
      default: 0,
    },
    /**
     * Level of the user.
     * @type {Number}
     * @default 0
     */
    level: {
      type: Number,
      default: 0,
    },
    /**
     * Threshold for the next level.
     * @type {Number}
     * @default 0
     */
    levelThreshold: {
      type: Number,
      default: 0,
    },
    /**
     * Progress towards the next level.
     * @type {Number}
     * @default 0
     */
    levelProgress: {
      type: Number,
      default: 0,
    },
    /**
     * Number of answers provided by the user.
     * @type {Number}
     * @default 0
     */
    answers: {
      type: Number,
      default: 0,
    },
    /**
     * Number of questions asked by the user.
     * @type {Number}
     * @default 0
     */
    questions: {
      type: Number,
      default: 0,
    },
    /**
     * Number of accepted answers by the user.
     * @type {Number}
     * @default 0
     */
    acceptedAnswers: {
      type: Number,
      default: 0,
    },
    /**
     * Number of comments made by the user.
     * @type {Number}
     * @default 0
     */
    comments: {
      type: Number,
      default: 0,
    },
    /**
     * Date when the user joined.
     * @type {Date}
     * @default Date.now
     */
    joinedDate: {
      type: Date,
      default: Date.now,
    },
    /**
     * Version key for the document.
     * @type {Number}
     * @default 0
     */
    __v: {
      type: Number,
      default: 0,
    },
    /**
     * List of badges earned by the user.
     * @type {String[]}
     * @default []
     */
    badges: {
      type: [String],
      default: [],
    },
    /**
     * Role of the user.
     * @type {Number}
     * @default 1
     */
    role: {
      type: Number,
      default: 1,
    },
  },
  {
    collection: 'users',
  },
);

export default userSchema;
