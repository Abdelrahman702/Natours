const mongoose = require('mongoose');

//Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      requireed: [true, 'A tour must have a name'],
      unique: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      requireed: [true, 'A tour must have a price'],
    },

    priceDiscount: {
      type: Number,
    },

    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // it is like a sensitive data so we won't display it for user
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true }, // for displaying the virtual proberty when it output as a json
    toObject: { virtuals: true }, // for displaying the virtual proberty when it output as an object
  }
);

tourSchema.virtual('duarationWeeks').get(function () {
  return this.duration / 7;
});

//Model of the schema

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
