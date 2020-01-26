import { Request, Response } from 'express';
import createError from 'http-errors';
import bcrypt from 'bcryptjs';

import logger from '../lib/logger';
import User, { IUserModel } from './user.model';

export async function getAllUsers(req: Request, res: Response) {
  logger.info('Incoming request for retrieving all users');

  try {
    const users: IUserModel[] = await User.find();
    res.status(200).json(users);
  } catch (error) {
    logger.error('Retrieving all users has failed', req.id, error);
    return res.status(500).send();
  }
}

export async function getUser(req: Request, res: Response) {
  const { id } = req.params;
  logger.info(`Incoming request for retrieving user with ID "${id}"`);

  let user: IUserModel;

  try {
    user = await User.findOne({ _id: id });
  } catch (error) {
    logger.error('Retrieving a user has failed', { id }, req.id, error);
    return res.status(500).send();
  }

  if (!user) {
    return res
      .status(404)
      .json(new createError.NotFound(`User with ID "${id}" not found`));
  }

  res.status(200).json(user);
}

export async function createUser(req: Request, res: Response) {
  const { firstName, lastName, userName, password } = req.body;

  let hashedPassword: string;

  try {
    const salt: string = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  } catch (error) {
    logger.error('bcrypt password encryption failed', req.id, error);
    return res.status(500).send();
  }

  const user: IUserModel = new User({
    firstName,
    lastName,
    userName,
    password: hashedPassword,
    avatar: null
  });

  try {
    await user.save();
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json(new createError.Conflict('Username already taken'));
    } else {
      // NOTE: Do not panic, user.toJSON() will exclude the password from the logs
      logger.error('Saving user after creation has failed', { user: user.toJSON() }, req.id, error);
      return res.status(500).send();
    }
  }

  res.status(201).send(user.toJSON());
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;
  const result = await User.deleteOne({ _id: id });

  if (!result.deletedCount) {
    return res
      .status(404)
      .json(new createError.NotFound(`User with ID "${id}" not found`));
  }

  res.status(200).send();
}

export async function setUserAvatar(req: Request, res: Response) {
  const { id } = req.params;
  const { url } = req.body;

  let user: IUserModel;

  try {
    user = await User.findOne({ _id: id });
  } catch (error) {
    logger.error('Retrieving a user has failed', { id }, req.id, error);
    return res.status(500).send();
  }

  if (!user) {
    return res
      .status(404)
      .json(new createError.NotFound(`User with ID "${id}" not found`));
  }

  user.avatar = url;

  try {
    await user.save();
  } catch (error) {
    logger.error('Saving a user after avatar update has failed', { userId: id, avatarUrl: url }, req.id, error);
    return res.status(500).send();
  }

  res.status(200).send();
}
