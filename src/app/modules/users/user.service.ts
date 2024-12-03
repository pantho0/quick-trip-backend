import { User } from './user.model';

const getAllUserFromDB = async () => {
  const result = await User.find();
  return result;
};

const getSingleUserFromDB = async (userEmail: string) => {
  const result = await User.findOne({ email: userEmail });
  return result;
};

export const UserServices = {
  getAllUserFromDB,
  getSingleUserFromDB,
};
