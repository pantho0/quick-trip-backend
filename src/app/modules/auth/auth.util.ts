import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export const createToken = (
  jwtPayload: { userId: Types.ObjectId; role: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn });
};
