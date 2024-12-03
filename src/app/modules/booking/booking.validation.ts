import { z } from 'zod';

const isoDateTimeSchema = z
  .string()
  .refine(
    (dateTime) => {
      const regex =
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
      return regex.test(dateTime);
    },
    {
      message:
        'Invalid ISO 8601 date-time format. Expected YYYY-MM-DDTHH:mm[:ss[.sss]]Z or with timezone offset.',
    },
  )
  .transform((dateTime) => {
    // Convert ISO date string to a timestamp in seconds
    return Math.floor(new Date(dateTime).getTime() / 1000);
  });

const bookingValidationSchema = z.object({
  body: z.object({
    date: isoDateTimeSchema,
    user: z.string().nonempty(),
    carId: z.string().nonempty(),
    startTime: isoDateTimeSchema,
    endTime: z
      .string()
      .nullable()
      .optional()
      .refine(
        (time) =>
          !time ||
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/.test(
            time,
          ),
        {
          message: 'Invalid ISO 8601 date-time format for endTime.',
        },
      ),
    totalCost: z.number().nonnegative().default(0),
  }),
});

export const BookingValidation = {
  bookingValidationSchema,
};
