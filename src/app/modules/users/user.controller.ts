import { RequestHandler } from 'express';
import { UserServices } from './user.service';

const createUser: RequestHandler = async (req, res) => {
  try {
    const result = await UserServices.createUserIntoDB(req.body.users);
    res.status(200).json({
      success: true,
      message: 'User created successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

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
  } catch (error) {
    console.log(error);
  }
};

export const UserControllers = {
  createUser,
  getAllUser,
  getSingleUser,
};
