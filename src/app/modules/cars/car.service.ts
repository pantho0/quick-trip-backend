/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from 'mongoose';
import { TCar } from './car.interface';
import { Car } from './car.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Booking } from '../booking/booking.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { searchableFields } from './car.constant';
import { differenceInSeconds, parseISO } from 'date-fns';
import { uploadImage } from '../../utils/uploadImage';

const createCarIntoDB = async (file: any, payload: TCar) => {
  if (file) {
    const imageName = `carimg-${payload?.name}`;
    const path = file?.path;
    const imageUpload = await uploadImage(imageName, path);
    payload.images = imageUpload?.secure_url as string;
  }
  const result = await Car.create(payload);
  return result;
};

const getAllCarsFromDB = async (query: Record<string, unknown>) => {
  const carsQuery = new QueryBuilder(Car.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await carsQuery.countTotal();
  const result = await carsQuery.modelQuery;

  return { result, meta };

  // const queryObj = { ...query };
  // const searchableFields = ['name', 'color', 'status', 'features'];
  // let searchTerm = '';
  // if (query.searchTerm) {
  //   searchTerm = query.searchTerm as string;
  // }

  // const searchQuery = Car.find({
  //   $or: searchableFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });

  // //exclude fields
  // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  // excludeFields.forEach((el) => delete queryObj[el]);

  // const filterQuery = searchQuery.find(queryObj);

  // let sort = '-createdAt';

  // if (query.sort) {
  //   sort = query.sort as string;
  // }

  // const sortQuery = filterQuery.sort(sort);

  // let page = 1;
  // let limit = 1;
  // let skip = 0;

  // if (query?.limit) {
  //   limit = Number(query.limit);
  // }

  // if (query?.page) {
  //   page = Number(query.page);
  //   skip = (page - 1) * limit;
  // }

  // const paginateQuery = sortQuery.skip(skip);
  // const limitQuery = paginateQuery.limit(limit);

  // let fields = '-__v';

  // if (query?.fields) {
  //   fields = (query.fields as string).split(',').join(' ');
  // }

  // const fieldQuery = await limitQuery.select(fields);

  // return fieldQuery;
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
  // Finding out the booking
  const getTheBookedCar = await Booking.findById({ _id: bookingId });
  if (!getTheBookedCar) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // Parse ISO date strings
    const bookingTime = getTheBookedCar?.startTime;
    const bookingEndTime = endTime;
    // Check if the booking time is greater than the end time
    if (bookingTime > bookingEndTime) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'End time should be after than the booking time',
      );
    }
    // Calculate the duration in seconds
    const bookingDif = differenceInSeconds(bookingEndTime, bookingTime);
    console.log('Duration in seconds:', bookingDif);
    // Convert seconds to hours (optional)
    const bookingDifHours = bookingDif / 3600;
    console.log('Duration in hours:', bookingDifHours);
    // Finding out the car
    const getCarInfo = await Car.findById({
      _id: getTheBookedCar?.carId,
    }).session(session);
    // Getting the price per hour
    const pricePerHour = getCarInfo?.pricePerHour;
    // Calculating the price
    const price = (bookingDifHours * (pricePerHour as number)).toFixed(2);
    // Update the price now
    const uptadePrice = await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          totalCost: price,
          endTime: bookingEndTime,
        },
      },
      {
        new: true,
        session,
      },
    );

    // Update the status of the car
    const updateCarStatus = await Car.findByIdAndUpdate(
      { _id: getTheBookedCar?.carId },
      {
        $set: {
          status: 'available',
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
