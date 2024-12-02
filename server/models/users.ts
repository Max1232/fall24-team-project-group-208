import mongoose, { Model } from 'mongoose';
import userSchema from './schema/user';
import { User } from '../types';

/**
 * Mongoose model for the User collection.
 * This model provides an interface to interact with the User documents in the MongoDB database.
 *
 * @type {Model<User>}
 */
const UserModel: Model<User> = mongoose.model<User>('User', userSchema);

export default UserModel;
