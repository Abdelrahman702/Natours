const Tour = require('./../models/tourModels');

// const tours = JSON.parse(
//   // convert the string to js object
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      stsus: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      stsus: 'fail',
      message: err,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    //BUILD QUERY
    // 1A)Filtring
    const queryObj = { ...req.query }; //create a new obj with the same content of req.query
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((element) => {
      delete queryObj[element];
    });

    // 1B)Advance Filtring

    // {  difficulty:'easy',  duration : {$gte :1}     }                this is req.query
    // {  difficulty:'easy',  duration : {gte :'1'}     }               this is the query

    let queryStr = JSON.stringify(queryObj); // convert the JSON object to string

    // The regular expression used here (/\b(gte|gt|lt|lte)\b/g) is using the \b boundary
    // matcher to match the start and end of words,
    // and the (gte|gt|lt|lte) group to match any of the specified
    //  strings (gte, gt, lt, or lte). The g flag at the end of
    //  the expression means that it will match all occurrences of these strings in the input string.

    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 2) SORTING

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    }

    // 3) FIELD LINITING

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // to exclude it
    }

    // 4) PAGINATION

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments(); // get the number of all existing Documents
      if (skip > numTours) {
        throw new Error('This page does not exist');
      }
    }

    //EXCUTE QUERY
    const tours = await query;

    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// the create function that create a new document return a promise so we need to make it (await)
// so to do this we will make the function async

exports.createTour = async (req, res) => {
  // async here to allow await
  try {
    const newTour = await Tour.create(req.body); // create a new document
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch {
    res.status(400).json({
      status: 'fail',
      message: 'invalid data sent',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
