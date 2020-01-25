import { ValidationSchema } from 'express-validator';
import mongoose from 'mongoose';

export const getUserSchema: ValidationSchema = {
  id: {
    in: ['params'],
    errorMessage: 'ID must be a valid ObjectId',
    custom: {
      options: value => mongoose.Types.ObjectId.isValid(value)
    }
  }
};