import { Router } from 'express';
import { CarControllers } from './car.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CarValidations } from './car.validation';

const router = Router();

router.post(
  '/',
  validateRequest(CarValidations.createCarValidationSchema),
  CarControllers.createCar,
);

router.get('/', CarControllers.gatAllCars);
router.get('/:carId', CarControllers.gatSingleCars);
router.patch('/:id', CarControllers.updateCar);

export const CarRoutes = router;
