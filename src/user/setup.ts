import { Application, Router } from 'express';
import { checkSchema, validationResult } from 'express-validator';

import {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  setUserAvatar
} from './user.handlers';
import {
  getUserSchema,
} from './user.schemas';
import handleValidationResult from '../util/handleValidationResult';

export default function setupUsersModule(app: Application) {
  const router: Router = Router();

  router.get('/', getAllUsers);
  router.get('/:id', checkSchema(getUserSchema), handleValidationResult, getUser);
  router.post('/', createUser);
  router.delete('/:id', deleteUser);
  router.patch('/:id/avatar', setUserAvatar);

  app.use('/user', router);
}
