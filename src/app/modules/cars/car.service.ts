/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose';
import { TCar } from './car.interface';
import { Car } from './car.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Booking } from '../booking/booking.model';

const createCarIntoDB = async (payload: TCar) => {
  const result = await Car.create(payload);
  return result;
};

const getAllCarsFromDB = async () => {
  const result = await Car.find();
  return result;
};

const getSingleCarsFromDB = async (carId: string) => {
  const result = await Car.findById({ _id: carId });
  return result;
};

const updateCarIntoDB = async (id: string, payload: Partial<TCar>) => {
  const result = await Car.findByIdAndUpdate(
    id,
    {
      $set: {
        ...payload,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};

const deleteCarFromDB = async (id: string) => {
  const result = await Car.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  return result;
};

const returnBookedCarIntoDB = async (payload: {
  bookingId: string;
  endTime: string;
}) => {
  const { bookingId, endTime } = payload;
  //finding out the booking
  const getTheBookedCar = await Booking.findById({ _id: bookingId });
  if (!getTheBookedCar) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    //capture the time of booking and ending time
    const bookingTime = Number(getTheBookedCar?.startTime);
    const bookingEndTime = Number(endTime);
    //check if the booking time is greater than the end time
    if (bookingTime > bookingEndTime) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Booking time is greater than the end time',
      );
    }
    //getting the times in seconds
    const bookingDif = bookingEndTime - bookingTime;
    // Convert seconds to hours
    const bookingDifHours = bookingDif / 3600; // 3600 seconds in an hour
    //finding out the car
    const getCarInfo = await Car.findById({
      _id: getTheBookedCar?.carId,
    })
      .select('pricePerHour')
      .session(session);
    //getting the price per hour
    const pricePerHour = getCarInfo?.pricePerHour;
    //calculating the price
    const price = (bookingDifHours * (pricePerHour as number)).toFixed(2);
    //update the price now
    const uptadePrice = await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          totalCost: price,
        },
      },
      {
        new: true,
        session,
      },
    );

    await session.commitTransaction();
    await session.endSession();
    return uptadePrice;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, error);
  }
};

export const CarServices = {
  createCarIntoDB,
  getAllCarsFromDB,
  getSingleCarsFromDB,
  updateCarIntoDB,
  deleteCarFromDB,
  returnBookedCarIntoDB,
};
