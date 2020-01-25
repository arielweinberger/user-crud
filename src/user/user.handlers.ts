import { Request, Response } from "express";
import createError from "http-errors";

import User, { IUserModel } from "./user.model";

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users: IUserModel[] = await User.find();
    res.status(200).json(users);
  } catch (error) {
    return res.status(500).send();
  }
}

export async function getUser(req: Request, res: Response) {
  const { id } = req.params;

  let user: IUserModel;

  try {
    user = await User.findOne({ _id: id });
  } catch (error) {
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

  const user: IUserModel = new User({
    firstName,
    lastName,
    userName,
    password,
    avatar: null
  });

  try {
    await user.save();
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json(new createError.Conflict('Username already taken'));
    } else {
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
    return res.status(500).send();
  }

  res.status(200).send();
}
