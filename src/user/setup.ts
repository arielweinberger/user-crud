import { Application, Router } from 'express';

import {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  setUserAvatar
} from './user.handlers';
import {
  idPathParamValidator, createUserValidator, avatarValidator,
} from './validators';
import handleValidationResult from '../util/handleValidationResult';

export default function setupUsersModule(app: Application) {
  const router: Router = Router();

  router.get('/', getAllUsers);
  router.get('/:id', idPathParamValidator, handleValidationResult, getUser);
  router.post('/', createUserValidator, handleValidationResult, createUser);
  router.delete('/:id', idPathParamValidator, handleValidationResult, deleteUser);
  router.patch('/:id/avatar', [idPathParamValidator, avatarValidator], handleValidationResult, setUserAvatar);

  app.use('/user', router);
}
