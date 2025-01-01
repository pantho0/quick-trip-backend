import { NextFunction, Request, Response, Router } from 'express';
import { CarControllers } from './car.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CarValidations } from './car.validation';
import { User_Role } from '../users/user.const';
import auth from '../../middlewares/auth';
import { upload } from '../../utils/uploadImage';

const router = Router();

router.post(
  '/',
  auth(User_Role.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(CarValidations.createCarValidationSchema),
  CarControllers.createCar,
);

router.get('/', auth(User_Role.admin), CarControllers.getAllCars);
router.get('/:carId', CarControllers.getSingleCars);
router.patch(
  '/:id',
  auth(User_Role.admin),
  validateRequest(CarValidations.updateCarValidationSchema),
  CarControllers.updateCar,
);
router.put(
  '/return',
  auth(User_Role.admin),
  validateRequest(CarValidations.carReturnValidationSchema),
  CarControllers.returnCar,
);
router.delete('/:id', auth(User_Role.admin), CarControllers.deleteCar);

export const CarRoutes = router;
