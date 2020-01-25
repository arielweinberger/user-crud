import { Request, Response } from "express";
import createError from "http-errors";

import User, { IUserModel } from "./user.model";

export async function getAllUsers(req: Request, res: Response) {
  const users: IUserModel[] = await User.find();
  res.status(200).json(users);
}

export async function getUser(req: Request, res: Response) {
  const { id } = req.params;
  const user: IUserModel = await User.findOne({ _id: id });

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
    console.log("TODO: handle error");
    res.sendStatus(500);
  }

  res.sendStatus(201);
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;
  const result = await User.deleteOne({ _id: id });

  if (!result.deletedCount) {
    return res
      .status(404)
      .json(new createError.NotFound(`User with ID "${id}" not found`));
  }

  res.sendStatus(200);
}

export async function setUserAvatar(req: Request, res: Response) {
  const { id } = req.params;
  const { url } = req.body;

  // TODO: validate URL schema

  const user: IUserModel = await User.findOne({ _id: id });

  if (!user) {
    return res
      .status(404)
      .json(new createError.NotFound(`User with ID "${id}" not found`));
  }

  user.avatar = url;

  try {
    await user.save();
  } catch (error) {
    console.log("TOOD: handle error");
    res.sendStatus(500);
  }

  res.sendStatus(200);
}
