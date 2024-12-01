/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express';
import { UserServices } from './user.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body.users);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const getAllUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUserFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrived successfully',
    data: result,
  });
});

const getSingleUser: RequestHandler = catchAsync(async (req, res) => {
  const { userEmail } = req.params;
  const result = await UserServices.getSingleUserFromDB(userEmail);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrived successfully',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getAllUser,
  getSingleUser,
};
