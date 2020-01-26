import { Application, Router } from 'express';

import logger from '../lib/logger';
import {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  setUserAvatar
} from './user.handlers';
import {
  idPathParamValidator,
  createUserValidators,
  avatarValidator
} from './validators';
import handleValidationResult from '../util/handleValidationResult';

export default function setupUsersModule(app: Application) {
  logger.info(`Setting up User module`);

  const router: Router = Router();

  router.get('/', getAllUsers);
  router.get('/:id', [idPathParamValidator, handleValidationResult], getUser);
  router.post('/', [...createUserValidators, handleValidationResult], createUser);
  router.delete('/:id', [idPathParamValidator, handleValidationResult], deleteUser);
  router.patch('/:id/avatar', [idPathParamValidator, avatarValidator], handleValidationResult, setUserAvatar);

  app.use('/user', router);

  logger.info(`User module set-up successfully`);
}
