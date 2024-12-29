import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import { RequestHandler } from 'express';

const signUp: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthServices.signUp(req.body.users);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { token, refreshToken, userData } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 90,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: {
      userData,
      token,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const result = await AuthServices.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Token retrived successfully',
    data: result,
  });
});

export const AuthControllers = {
  signUp,
  loginUser,
  refreshToken,
};
