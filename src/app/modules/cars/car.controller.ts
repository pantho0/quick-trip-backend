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

const gatAllCars: RequestHandler = catchAsync(async (req, res) => {
  const result = await CarServices.getAllCarsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cars are retrived successfully',
    data: result,
  });
});

const gatSingleCars: RequestHandler = catchAsync(async (req, res) => {
  const { carId } = req.params;
  const result = await CarServices.getSingleCarsFromDB(carId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car retrived successfully',
    data: result,
  });
});

const updateCar: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await CarServices.updateCarIntoDB(id, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car updated successfully',
    data: result,
  });
});

export const CarControllers = {
  createCar,
  gatAllCars,
  gatSingleCars,
  updateCar,
};
