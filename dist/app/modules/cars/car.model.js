"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Car = void 0;
const mongoose_1 = require("mongoose");
const carSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    color: {
        type: String,
        required: [true, 'Color is required'],
    },
    isElectric: {
        type: Boolean,
        required: [true, 'You must define the car electric or not'],
    },
    status: {
        type: String,
        enum: ['available', 'booked'],
        default: 'available',
    },
    features: {
        type: [String],
        required: [true, 'Features is required'],
    },
    pricePerHour: {
        type: Number,
        required: [true, 'Price per hour is required'],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
carSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
carSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
exports.Car = (0, mongoose_1.model)('Car', carSchema);
