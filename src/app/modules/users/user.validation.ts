import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    users: z.object({
      name: z.string(),
      email: z.string(),
      role: z.string().optional(),
      password: z
        .string({
          invalid_type_error: 'Password must be string type',
        })
        .min(8, { message: 'Password must be at least 8 characters long' })
        .max(20, { message: 'Password must be at most 50 characters long' }),
      phone: z.string(),
      address: z.string(),
    }),
  }),
});

export const UserValidations = {
  createUserValidationSchema,
};
