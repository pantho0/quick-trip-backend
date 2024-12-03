import express from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { User_Role } from './user.const';

const router = express.Router();

router.get('/', auth(User_Role.admin), UserControllers.getAllUser);
router.get('/:userEmail', auth(User_Role.admin), UserControllers.getSingleUser);

export const UserRoutes = router;
