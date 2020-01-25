import { Router } from 'express';
import { getAllUsers, getUser, deleteUser, setUserAvatar } from './user.handlers';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);
router.patch('/:id/avatar', setUserAvatar);

export default UserRouter;