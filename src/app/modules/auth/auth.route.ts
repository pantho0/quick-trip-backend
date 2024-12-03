import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import { UserValidations } from '../users/user.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

router.post(
  '/signup',
  validateRequest(UserValidations.createUserValidationSchema),
  AuthControllers.signUp,
);
router.post('/signin', AuthControllers.loginUser);

export const AuthRoutes = router;
