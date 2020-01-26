import createError from 'http-errors';
import bcrypt from 'bcryptjs';

import User, { IUserModel } from './user.model';
import { CreateUserDto } from './createUser.dto';

export async function getAllUsers(): Promise<IUserModel[]> {
  try {
    return User.find();
  } catch (error) {
    throw createError(500, error, { message: 'User find failed' });
  }
}

export async function getUserById(id: string): Promise<IUserModel> {
  try {
    return User.findOne({ _id: id });
  } catch (error) {
    throw createError(500, error, { message: 'User findOne failed' });
  }
}

export async function createUser(createUserDto: CreateUserDto): Promise<IUserModel> {
  const { firstName, lastName, userName, password } = createUserDto;
  let hashedPassword: string;

  try {
    const salt: string = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  } catch (error) {
    throw createError(500, error, { message: 'bcrypt password hash failed' });
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
      throw createError(409, { message: 'Username already taken' });
    } else {
      throw createError(500, error, { message: 'User saving failed' });
    }
  }

  return user;
}

export async function deleteUser(id: string): Promise<void> {
  let result;

  try {
    result = await User.deleteOne({ _id: id });
  } catch (error) {
    throw createError(500, error, { message: 'Could not delete user' });
  }

  if (!result.deletedCount) {
    throw createError(404, { message: 'User not found' });
  }

  return;
}

export async function setUserAvatar(userId: string, avatarUrl: string): Promise<void> {
  const user = await getUserById(userId);
  user.avatar = avatarUrl;

  try {
    await user.save();
  } catch (error) {
    throw createError(500, { message: 'Setting avatar failed' });
  }
}
