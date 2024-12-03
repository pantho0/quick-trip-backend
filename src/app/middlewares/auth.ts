import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import { TUserRole } from '../modules/users/user.interface';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/users/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    //checking is the token valid or not
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { userId, role, iat } = decoded;

    //checking is the user exists or not
    const user = await User.findById({ _id: userId });
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'The user is not found');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    req.user = decoded as JwtPayload;

    next();
  });
};

export default auth;
