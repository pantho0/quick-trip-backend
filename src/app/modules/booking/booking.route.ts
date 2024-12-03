import { Router } from 'express';
import { BookingControllers } from './booking.controller';
import auth from '../../middlewares/auth';
import { User_Role } from '../users/user.const';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidation } from './booking.validation';

const router = Router();

router.post(
  '/',
  auth(User_Role.user),
  validateRequest(BookingValidation.bookingValidationSchema),
  BookingControllers.createBooking,
);
router.get('/', auth(User_Role.admin), BookingControllers.getAllBooking);

export const BookingRoutes = router;
