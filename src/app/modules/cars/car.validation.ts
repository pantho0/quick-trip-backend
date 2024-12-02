import { z } from 'zod';

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

export const CarValidations = {
  createCarValidationSchema,
};
