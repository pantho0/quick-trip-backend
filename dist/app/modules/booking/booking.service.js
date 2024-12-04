"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingServices = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const car_model_1 = require("../cars/car.model");
const booking_model_1 = require("./booking.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createBookingIntoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingInfo = {
        carId: payload.carId,
        date: payload.date,
        startTime: payload.startTime,
        user: userId,
    };
    const car = yield car_model_1.Car.findById({ _id: payload === null || payload === void 0 ? void 0 : payload.carId });
    if (!car) {
        throw new Error('Car not found');
    }
    const status = car === null || car === void 0 ? void 0 : car.status;
    if (status === 'booked') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Car is already booked');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const bookTheCar = yield booking_model_1.Booking.create([bookingInfo], { session });
        const changeCarStatus = yield car_model_1.Car.findByIdAndUpdate({ _id: car === null || car === void 0 ? void 0 : car._id }, { $set: { status: 'booked' } }, { new: true, session });
        yield session.commitTransaction();
        yield session.endSession();
        return bookTheCar;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, error);
    }
});
const getAllBookingsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.Booking.find(query).populate([
        { path: 'user' },
        { path: 'carId' },
    ]);
    return result;
});
const getMyBookingsFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.Booking.findOne({ user: userId });
    return result;
});
exports.BookingServices = {
    createBookingIntoDB,
    getAllBookingsFromDB,
    getMyBookingsFromDB,
};
