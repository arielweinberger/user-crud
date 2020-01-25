import { Schema, Document, model } from 'mongoose';

export interface IUserModel extends Document {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  avatar: string;
}

const userSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
});

/**
 * Strip sensitive data from the document's JSON representation
 */
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default model<IUserModel>('User', userSchema);