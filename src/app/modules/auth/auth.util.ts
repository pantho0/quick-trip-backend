import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import config from '../../config';

export const createToken = (
  jwtPayload: { userId: Types.ObjectId; role: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwt_refresh_secret as string) as JwtPayload;
};
