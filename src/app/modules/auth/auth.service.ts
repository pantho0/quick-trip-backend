import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../users/user.model';
import { TLoginUser } from './auth.Interface';
import { createToken } from './auth.util';
import config from '../../config';
import { TUser } from '../users/user.interface';

const signUp = async (payload: TUser) => {
  const result = await User.create(payload);
  return result;
};

const loginUser = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload?.email }).select(
    '+password',
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Wrong Password');
  }

  //create token
  const jwtPayload = {
    userId: user._id,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires as string,
  );

  const userData = {
    name: user?.name,
    email: user?.email,
    role: user?.role,
  };

  return {
    userData,
    token: accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  loginUser,
  signUp,
};
