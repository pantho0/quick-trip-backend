"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidation = void 0;
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
const bookingValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        date: isoDateTimeSchema,
        carId: zod_1.z.string().nonempty(),
        startTime: isoDateTimeSchema,
        endTime: zod_1.z
            .string()
            .nullable()
            .optional()
            .refine((time) => !time ||
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/.test(time), {
            message: 'Invalid ISO 8601 date-time format for endTime.',
        }),
        totalCost: zod_1.z.number().nonnegative().default(0),
    }),
});
exports.BookingValidation = {
    bookingValidationSchema,
};
