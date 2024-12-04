"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const zod_1 = require("zod");
const createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        users: zod_1.z.object({
            name: zod_1.z.string(),
            email: zod_1.z.string(),
            role: zod_1.z.string().optional(),
            password: zod_1.z
                .string({
                invalid_type_error: 'Password must be string type',
            })
                .min(8, { message: 'Password must be at least 8 characters long' })
                .max(20, { message: 'Password must be at most 50 characters long' }),
            phone: zod_1.z.string(),
            address: zod_1.z.string(),
        }),
    }),
});
exports.UserValidations = {
    createUserValidationSchema,
};
