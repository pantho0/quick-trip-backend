"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarRoutes = void 0;
const express_1 = require("express");
const car_controller_1 = require("./car.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const car_validation_1 = require("./car.validation");
const user_const_1 = require("../users/user.const");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(user_const_1.User_Role.admin), 
// validateRequest(CarValidations.createCarValidationSchema),
car_controller_1.CarControllers.createCar);
router.get('/', car_controller_1.CarControllers.getAllCars);
router.get('/:carId', car_controller_1.CarControllers.getSingleCars);
router.patch('/:id', (0, auth_1.default)(user_const_1.User_Role.admin), (0, validateRequest_1.default)(car_validation_1.CarValidations.updateCarValidationSchema), car_controller_1.CarControllers.updateCar);
router.put('/return', (0, auth_1.default)(user_const_1.User_Role.admin), (0, validateRequest_1.default)(car_validation_1.CarValidations.carReturnValidationSchema), car_controller_1.CarControllers.returnCar);
router.delete('/:id', (0, auth_1.default)(user_const_1.User_Role.admin), car_controller_1.CarControllers.deleteCar);
exports.CarRoutes = router;
