import { Request, Response } from 'express';
import createError from 'http-errors';

import logger from '../lib/logger';
import { IUserModel } from './user.model';
import * as UserService from './user.service';

export async function handleGetAllUsers(req: Request, res: Response) {
  logger.info('Incoming request for retrieving all users', {}, req.id);

  try {
    const users: IUserModel[] = await UserService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    logger.error(error, {}, req.id);
    return res.status(error.statusCode).send();
  }
}

export async function handleGetUser(req: Request, res: Response) {
  const { id } = req.params;
  logger.info(`Incoming request for retrieving a user`, { id }, req.id);

  let user: IUserModel;

  try {
    user = await UserService.getUserById(id);
  } catch (error) {
    logger.error('Retrieving a user has failed', { id }, req.id, error);
    return res.status(error.statusCode).send();
  }

  if (!user) {
    return res.status(404).json(new createError.NotFound(`User with ID "${id}" not found`));
  }

  return res.status(200).json(user);
}

export async function handleCreateUser(req: Request, res: Response) {
  const safeUserData = { ...req.body };
  delete safeUserData.password;

  logger.info('Incoming request for user creation', { userData: safeUserData }, req.id);

  try {
    const user: IUserModel = await UserService.createUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    logger.error(error, { userData: safeUserData }, req.id);
    return res.status(error.statusCode).json(error);
  }
}

export async function handleDeleteUser(req: Request, res: Response) {
  const { id } = req.params;

  logger.info('Incoming request for user deletion', { id }, req.id);

  try {
    await UserService.deleteUser(id);
    return res.status(200).send();
  } catch (error) {
    logger.error(error, { id }, req.id);
    return res.status(error.statusCode).json(error);
  }
}

export async function handleSetUserAvatar(req: Request, res: Response) {
  const { id } = req.params;
  const { url } = req.body;

  logger.info('Incoming request for avatar setting', { id, url }, req.id);

  try {
    await UserService.setUserAvatar(id, url);
    return res.status(200).send();
  } catch (error) {
    logger.error(error, { id, url }, req.id);
    return res.status(error.statusCode).json(error);
  }
}
