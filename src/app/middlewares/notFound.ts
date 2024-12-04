import { NextFunction, Request, Response } from 'express';
import sendResponse from '../utils/sendResponse';
import httpStatus from 'http-status';

const notFound = async (req: Request, res: Response, next: NextFunction) => {
  return sendResponse(res, {
    statusCode: httpStatus.NOT_FOUND,
    success: false,
    message: 'Route not found',
    data: null,
  });
};

export default notFound;
