import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import { BookingServices } from './booking.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createBooking: RequestHandler = catchAsync(async (req, res) => {
  const result = await BookingServices.createBookingIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking created successfully',
    data: result,
  });
});

const getAllBooking: RequestHandler = catchAsync(async (req, res) => {
  const result = await BookingServices.getAllBookingsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bookings retrived successfully',
    data: result,
  });
});

export const BookingControllers = {
  createBooking,
  getAllBooking,
};
