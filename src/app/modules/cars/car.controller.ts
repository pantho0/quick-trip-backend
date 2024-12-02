import { CarServices } from './car.service';
import sendResponse from '../../utils/sendResponse';
import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';

const createCar: RequestHandler = catchAsync(async (req, res) => {
  const result = await CarServices.createCarIntoDB(req.body.cars);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car created successfully',
    data: result,
  });
});

export const CarControllers = {
  createCar,
};
