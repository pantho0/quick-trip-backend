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
router.patch(
  '/:id',
  validateRequest(CarValidations.updateCarValidationSchema),
  CarControllers.updateCar,
);
router.put(
  '/return',
  validateRequest(CarValidations.carReturnValidationSchema),
  CarControllers.returnCar,
);
router.delete('/:id', CarControllers.deleteCar);

export const CarRoutes = router;
