const mongoose = require('mongoose');
// const User = require('./userModel');
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
    toJSON: { virtuals: true, versionKey: false, minimize: false },
    toObject: { virtuals: true, versionKey: false, minimize: false },
  }
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({ path: 'user', select: 'name photo' });

  this.populate({ path: 'user', select: 'name photo' });

  next();
});

// Statistics function is available in the model

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // this here points to the model not to the document
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);
  const data = {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  };
  await Tour.findByIdAndUpdate(tourId, data);
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
