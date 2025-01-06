"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarValidations = void 0;
const zod_1 = require("zod");
const isoDateTimeSchema = zod_1.z.string().refine((dateTime) => {
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
    return regex.test(dateTime);
}, {
    message: 'Invalid ISO 8601 date-time format. Expected YYYY-MM-DDTHH:mm[:ss[.sss]]Z or with timezone offset.',
});
// .transform((dateTime) => {
//   // Convert ISO date string to a timestamp in seconds
//   return Math.floor(new Date(dateTime).getTime() / 1000);
// });
const createCarValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Name is required',
        }),
        images: zod_1.z.string().optional(),
        description: zod_1.z.string({
            required_error: 'Description is required',
        }),
        color: zod_1.z.string({
            required_error: 'Color is required',
        }),
        isElectric: zod_1.z.boolean({
            required_error: 'You must define if the car is electric or not',
        }),
        status: zod_1.z.enum(['available', 'booked']).optional().default('available'),
        features: zod_1.z.array(zod_1.z.string(), {
            required_error: 'Features are required',
        }),
        pricePerHour: zod_1.z.number({
            required_error: 'Price per hour is required',
        }),
        isDeleted: zod_1.z.boolean().optional().default(false),
    }),
});
const updateCarValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: 'Name is required',
        })
            .optional(),
        description: zod_1.z
            .string({
            required_error: 'Description is required',
        })
            .optional(),
        color: zod_1.z
            .string({
            required_error: 'Color is required',
        })
            .optional(),
        isElectric: zod_1.z
            .boolean({
            required_error: 'You must define if the car is electric or not',
        })
            .optional(),
        status: zod_1.z.enum(['available', 'booked']).optional().default('available'),
        features: zod_1.z
            .array(zod_1.z.string(), {
            required_error: 'Features are required',
        })
            .optional(),
        pricePerHour: zod_1.z
            .number({
            required_error: 'Price per hour is required',
        })
            .optional(),
        isDeleted: zod_1.z.boolean().optional().default(false),
    }),
});
const carReturnValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingId: zod_1.z.string(),
        endTime: isoDateTimeSchema,
    }),
});
exports.CarValidations = {
    createCarValidationSchema,
    updateCarValidationSchema,
    carReturnValidationSchema,
};
