import { body, param } from 'express-validator';
import mongoose from 'mongoose';

const idPathParamValidator = param('id')
  .custom(value => mongoose.Types.ObjectId.isValid(value))
  .withMessage('must be a valid ObjectId');

const createUserValidators = [
  body('firstName')
    .isAlpha('en-GB')
    .withMessage('Must be alphabetic (en)')
    .isLength({ min: 2, max: 12 })
    .withMessage('Must be between 2 and 12 characters long'),
  body('lastName')
    .isAlpha('en-GB')
    .withMessage('Must be alphabetic (en)')
    .isLength({ min: 2, max: 12 })
    .withMessage('Must be between 2 and 12 characters long'),
  body('userName')
    .isLength({ min: 2, max: 20 })
    .withMessage('Must be between 2 and 20 characters long'),
  body('password')
    .isLength({ min: 6, max: 50 })
    .withMessage('Must be between 6 and 50 characters long')
];

const avatarValidator = body('url')
  .isURL()
  .withMessage('Must be a valid URL');

export {
  idPathParamValidator,
  createUserValidators,
  avatarValidator
};