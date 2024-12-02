import { Router } from 'express';
import { UserRoutes } from '../modules/users/user.route';
import { CarRoutes } from '../modules/cars/car.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/cars',
    route: CarRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
