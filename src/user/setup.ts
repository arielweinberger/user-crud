import { Application, Router } from 'express';
import {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  setUserAvatar
} from './user.handlers';

export default function setupUsersModule(app: Application) {
  const router: Router = Router();

  router.get('/', getAllUsers);
  router.get('/:id', getUser);
  router.post('/', createUser);
  router.delete('/:id', deleteUser);
  router.patch('/:id/avatar', setUserAvatar);

  app.use('/user', router);
}
