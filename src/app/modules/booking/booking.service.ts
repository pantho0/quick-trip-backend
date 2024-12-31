/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { Car } from '../cars/car.model';
import { TBooking } from './booking.interface';
import { Booking } from './booking.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { parseISO } from 'date-fns';

const createBookingIntoDB = async (userId: string, payload: TBooking) => {
  const bookingInfo = {
    carId: payload.carId,
    date: payload.date,
    startTime: payload.startTime,
    user: userId,
  };
  const car = await Car.findById({ _id: payload?.carId });
  if (!car) {
    throw new Error('Car not found');
  }
  const status = car?.status;
  if (status === 'booked') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Car is already booked');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const bookTheCar = await Booking.create([bookingInfo], { session });
    const changeCarStatus = await Car.findByIdAndUpdate(
      { _id: car?._id },
      { $set: { status: 'booked' } },
      { new: true, session },
    );
    await session.commitTransaction();
    await session.endSession();
    return bookTheCar;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, error);
  }
};

const getAllBookingsFromDB = async (query: Record<string, unknown>) => {
  const result = await Booking.find(query).populate([
    { path: 'user' },
    { path: 'carId' },
  ]);
  return result;
};

const getMyBookingsFromDB = async (userId: string) => {
  const result = await Booking.findOne({ user: userId });
  return result;
};

export const BookingServices = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  getMyBookingsFromDB,
};
