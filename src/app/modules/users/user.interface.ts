import { Model } from 'mongoose';
import { User_Role } from './user.const';

export interface TUser {
  name: string;
  email: string;
  role?: string;
  password: string;
  phone: string;
  address?: string;
  isDeleted: boolean;
}

export type TUserResponse = {
  _id: string;
  password: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  address: string;
  isDeleted: boolean;
  __v: number;
};

export interface UserModel extends Model<TUser> {
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof User_Role;
