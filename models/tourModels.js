const mongoose = require('mongoose');

//Schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    requireed: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    requireed: [true, 'A tour must have a price'],
  },
});

//Model of the schema

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
