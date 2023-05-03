const mongoose = require('mongoose');
const User = require('./userModel');
const Tour = require('./tourModels');

//Schema
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'review can not be empty!'],
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour!'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user!'],
    },
  },
  {
    toJSON: { virtuals: true }, // for displaying the virtual proberty when it output as a json
    toObject: { virtuals: true }, // for displaying the virtual proberty when it output as an object
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
