import express from 'express';
import { UserControllers } from './user.controller';

const router = express.Router();

router.get('/', UserControllers.getAllUser);
router.get('/:userEmail', UserControllers.getSingleUser);
router.post('/create-user', UserControllers.createUser);

export const UserRoutes = router;
