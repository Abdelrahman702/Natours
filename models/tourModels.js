const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');

//Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      requireed: [true, 'A tour must have a name'],
      unique: true,
      maxlength: [
        40,
        'A tour name must have less than or equal 40 characters ',
      ],
      minlength: [
        10,
        'A tour name must have more than or equal 10 characters ',
      ],
    },
    slug: String,

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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, 'rating must have less than or equal 5  '],
      min: [1, 'rating must have more than or equal 1 '],
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
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
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
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    Locations: [
      {
        //GeoJSON
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true }, // for displaying the virtual proberty when it output as a json
    toObject: { virtuals: true }, // for displaying the virtual proberty when it output as an object
  }
);

tourSchema.virtual('duarationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE :the pre middleware it run before saving .save(() and  .create() .

//there is  another middleware (post) that runs after the save
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next(); // it is a middleware so it must have next function or it will be stuck in here
});

// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   // we use promise.all here because guidesPromises is an array so isted of loop over it and await each promise we use promise.all
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  // this reqular expression for appling this middleware fora ll find query
  next(); // it is a middleware so it must have next function or it will be stuck in here
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-passwordChangedAt -__v',
  });

  next();
});

//AGGREGATION MIDDLEWARE

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next(); // it is a middleware so it must have next function or it will be stuck in here
});

//Model of the schema

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
