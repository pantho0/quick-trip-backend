import { Model } from 'mongoose';

export interface TUser {
  name: string;
  email: string;
  role: string;
  password: string;
  phone: string;
  address: string;
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
