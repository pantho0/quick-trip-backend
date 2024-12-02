import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = await schema.parseAsync({
        body: req.body,
      });

      req.body = parsedData.body;
      req.cookies = parsedData.cookies;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
