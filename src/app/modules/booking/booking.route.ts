import { Router } from 'express';
import { BookingControllers } from './booking.controller';

const router = Router();

router.post('/', BookingControllers.createBooking);
router.get('/', BookingControllers.getAllBooking);

export const BookingRoutes = router;
