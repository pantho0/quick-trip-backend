"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = require("express");
const booking_controller_1 = require("./booking.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_const_1 = require("../users/user.const");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const booking_validation_1 = require("./booking.validation");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(user_const_1.User_Role.user), (0, validateRequest_1.default)(booking_validation_1.BookingValidation.bookingValidationSchema), booking_controller_1.BookingControllers.createBooking);
router.get('/', (0, auth_1.default)(user_const_1.User_Role.admin), booking_controller_1.BookingControllers.getAllBooking);
router.get('/my-bookings', (0, auth_1.default)(user_const_1.User_Role.user), booking_controller_1.BookingControllers.getMyBooking);
exports.BookingRoutes = router;
