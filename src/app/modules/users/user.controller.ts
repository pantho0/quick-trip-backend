/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express';
import { UserServices } from './user.service';
import catchAsync from '../../utils/catchAsync';

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body.users);
  res.status(200).json({
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const getAllUser: RequestHandler = async (req, res) => {
  try {
    const result = await UserServices.getAllUserFromDB();
    res.status(200).json({
      success: true,
      message: 'Users retrived successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const getSingleUser: RequestHandler = async (req, res) => {
  try {
    const { userEmail } = req.params;
    const result = await UserServices.getSingleUserFromDB(userEmail);
    res.status(200).json({
      success: true,
      message: 'User retrived successfully',
      data: result,
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const UserControllers = {
  createUser,
  getAllUser,
  getSingleUser,
};
