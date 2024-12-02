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

const createCarValidationSchema = z.object({
  body: z.object({
    cars: z.object({
      name: z.string({
        required_error: 'Name is required',
      }),
      description: z.string({
        required_error: 'Description is required',
      }),
      color: z.string({
        required_error: 'Color is required',
      }),
      isElectric: z.boolean({
        required_error: 'You must define if the car is electric or not',
      }),
      status: z.enum(['available', 'booked']).optional().default('available'),
      features: z.array(z.string(), {
        required_error: 'Features are required',
      }),
      pricePerHour: z.number({
        required_error: 'Price per hour is required',
      }),
      isDeleted: z.boolean().optional().default(false),
    }),
  }),
});

const updateCarValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .optional(),
    description: z
      .string({
        required_error: 'Description is required',
      })
      .optional(),
    color: z
      .string({
        required_error: 'Color is required',
      })
      .optional(),
    isElectric: z
      .boolean({
        required_error: 'You must define if the car is electric or not',
      })
      .optional(),
    status: z.enum(['available', 'booked']).optional().default('available'),
    features: z
      .array(z.string(), {
        required_error: 'Features are required',
      })
      .optional(),
    pricePerHour: z
      .number({
        required_error: 'Price per hour is required',
      })
      .optional(),
    isDeleted: z.boolean().optional().default(false),
  }),
});

const carReturnValidationSchema = z.object({
  body: z.object({
    bookingId: z.string(),
    endTime: isoDateTimeSchema,
  }),
});

export const CarValidations = {
  createCarValidationSchema,
  updateCarValidationSchema,
  carReturnValidationSchema,
};
