"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const user_validation_1 = require("../users/user.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = (0, express_1.Router)();
router.post('/signup', (0, validateRequest_1.default)(user_validation_1.UserValidations.createUserValidationSchema), auth_controller_1.AuthControllers.signUp);
router.post('/signin', auth_controller_1.AuthControllers.loginUser);
router.post('/refresh-token', auth_controller_1.AuthControllers.refreshToken);
exports.AuthRoutes = router;
