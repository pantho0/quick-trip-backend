import { model, Schema } from 'mongoose';
import { TCar } from './car.interface';

const carSchema = new Schema<TCar>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    images: {
      type: String,
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
  },
  {
    timestamps: true,
  },
);

carSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

carSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Car = model<TCar>('Car', carSchema);
