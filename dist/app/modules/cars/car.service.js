"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.CarServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const car_model_1 = require("./car.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const booking_model_1 = require("../booking/booking.model");
const createCarIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.Car.create(payload);
    return result;
});
const getAllCarsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.Car.find();
    return result;
});
const getSingleCarsFromDB = (carId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.Car.findById({ _id: carId });
    return result;
});
const updateCarIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.Car.findByIdAndUpdate(id, {
        $set: Object.assign({}, payload),
    }, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteCarFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.Car.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
});
const returnBookedCarIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId, endTime } = payload;
    //finding out the booking
    const getTheBookedCar = yield booking_model_1.Booking.findById({ _id: bookingId });
    if (!getTheBookedCar) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Booking not found');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //capture the time of booking and ending time
        const bookingTime = Number(getTheBookedCar === null || getTheBookedCar === void 0 ? void 0 : getTheBookedCar.startTime);
        const bookingEndTime = Number(endTime);
        //check if the booking time is greater than the end time
        if (bookingTime > bookingEndTime) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Booking time is greater than the end time');
        }
        //getting the times in seconds
        const bookingDif = bookingEndTime - bookingTime;
        // Convert seconds to hours
        const bookingDifHours = bookingDif / 3600; // 3600 seconds in an hour
        //finding out the car
        const getCarInfo = yield car_model_1.Car.findById({
            _id: getTheBookedCar === null || getTheBookedCar === void 0 ? void 0 : getTheBookedCar.carId,
        }).session(session);
        //getting the price per hour
        const pricePerHour = getCarInfo === null || getCarInfo === void 0 ? void 0 : getCarInfo.pricePerHour;
        //calculating the price
        const price = (bookingDifHours * pricePerHour).toFixed(2);
        //update the price now
        const uptadePrice = yield booking_model_1.Booking.findByIdAndUpdate(bookingId, {
            $set: {
                totalCost: price,
                endTime: bookingEndTime,
            },
        }, {
            new: true,
            session,
        });
        // update the status of the car
        const updateCarStatus = yield car_model_1.Car.findByIdAndUpdate({ _id: getTheBookedCar === null || getTheBookedCar === void 0 ? void 0 : getTheBookedCar.carId }, {
            $set: {
                status: 'available',
            },
        }, {
            new: true,
            session,
        });
        yield session.commitTransaction();
        yield session.endSession();
        return uptadePrice;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, error);
    }
});
exports.CarServices = {
    createCarIntoDB,
    getAllCarsFromDB,
    getSingleCarsFromDB,
    updateCarIntoDB,
    deleteCarFromDB,
    returnBookedCarIntoDB,
};
