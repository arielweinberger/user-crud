import { Application, Router } from 'express';

import logger from '../lib/logger';
import {
  handleGetAllUsers,
  handleGetUser,
  handleCreateUser,
  handleDeleteUser,
  handleSetUserAvatar,
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

  router.get('/', handleGetAllUsers);
  router.get('/:id', [idPathParamValidator, handleValidationResult], handleGetUser);
  router.post('/', [...createUserValidators, handleValidationResult], handleCreateUser);
  router.delete('/:id', [idPathParamValidator, handleValidationResult], handleDeleteUser);
  router.patch('/:id/avatar', [idPathParamValidator, avatarValidator], handleValidationResult, handleSetUserAvatar);

  app.use('/user', router);

  logger.info(`User module set-up successfully`);
}
