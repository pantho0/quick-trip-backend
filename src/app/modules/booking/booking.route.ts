import { Router } from 'express';
import { BookingControllers } from './booking.controller';
import auth from '../../middlewares/auth';
import { User_Role } from '../users/user.const';

const router = Router();

router.post(
  '/',
  auth(User_Role.admin, User_Role.user),
  BookingControllers.createBooking,
);
router.get('/', auth(User_Role.admin), BookingControllers.getAllBooking);

export const BookingRoutes = router;
