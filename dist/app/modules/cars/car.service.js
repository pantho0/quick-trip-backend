"use strict";
/* eslint-disable no-console */
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
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const car_constant_1 = require("./car.constant");
const date_fns_1 = require("date-fns");
const uploadImage_1 = require("../../utils/uploadImage");
const createCarIntoDB = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (file) {
        const imageName = `carimg-${payload === null || payload === void 0 ? void 0 : payload.name}`;
        const path = file === null || file === void 0 ? void 0 : file.path;
        const imageUpload = yield (0, uploadImage_1.uploadImage)(imageName, path);
        payload.images = imageUpload === null || imageUpload === void 0 ? void 0 : imageUpload.secure_url;
    }
    const result = yield car_model_1.Car.create(payload);
    return result;
});
const getAllCarsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const carsQuery = new QueryBuilder_1.default(car_model_1.Car.find(), query)
        .search(car_constant_1.searchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield carsQuery.countTotal();
    const result = yield carsQuery.modelQuery;
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
});
const getSingleCarsFromDB = (carId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.Car.findById({ _id: carId });
    return result;
});
const updateCarIntoDB = (id, payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    if (file) {
        const imageName = `carimg-${payload === null || payload === void 0 ? void 0 : payload.name}`;
        const path = file === null || file === void 0 ? void 0 : file.path;
        const imageUpload = yield (0, uploadImage_1.uploadImage)(imageName, path);
        payload.images = imageUpload === null || imageUpload === void 0 ? void 0 : imageUpload.secure_url;
    }
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
    // Finding out the booking
    const getTheBookedCar = yield booking_model_1.Booking.findById({ _id: bookingId });
    if (!getTheBookedCar) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Booking not found');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Parse ISO date strings
        const bookingTime = getTheBookedCar === null || getTheBookedCar === void 0 ? void 0 : getTheBookedCar.startTime;
        const bookingEndTime = endTime;
        // Check if the booking time is greater than the end time
        if (bookingTime > bookingEndTime) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'End time should be after than the booking time');
        }
        // Calculate the duration in seconds
        const bookingDif = (0, date_fns_1.differenceInSeconds)(bookingEndTime, bookingTime);
        console.log('Duration in seconds:', bookingDif);
        // Convert seconds to hours (optional)
        const bookingDifHours = bookingDif / 3600;
        console.log('Duration in hours:', bookingDifHours);
        // Finding out the car
        const getCarInfo = yield car_model_1.Car.findById({
            _id: getTheBookedCar === null || getTheBookedCar === void 0 ? void 0 : getTheBookedCar.carId,
        }).session(session);
        // Getting the price per hour
        const pricePerHour = getCarInfo === null || getCarInfo === void 0 ? void 0 : getCarInfo.pricePerHour;
        // Calculating the price
        const price = (bookingDifHours * pricePerHour).toFixed(2);
        // Update the price now
        const uptadePrice = yield booking_model_1.Booking.findByIdAndUpdate(bookingId, {
            $set: {
                totalCost: price,
                endTime: bookingEndTime,
            },
        }, {
            new: true,
            session,
        });
        // Update the status of the car
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
