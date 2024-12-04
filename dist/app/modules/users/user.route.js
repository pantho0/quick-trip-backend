"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_const_1 = require("./user.const");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(user_const_1.User_Role.admin), user_controller_1.UserControllers.getAllUser);
router.get('/:userEmail', (0, auth_1.default)(user_const_1.User_Role.admin), user_controller_1.UserControllers.getSingleUser);
exports.UserRoutes = router;
