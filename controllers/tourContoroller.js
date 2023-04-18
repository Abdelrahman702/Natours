const Tour = require('./../models/tourModels');

// const tours = JSON.parse(
//   // convert the string to js object
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.chechBody = (req, res, next) => {
  if (!req.body.name || !req.body.price)
    return res
      .status(400)
      .json({ status: 'fail', message: 'Missing  name or price' });

  next(); // if not it hit the next middleware
};

exports.getTour = (req, res) => {
  // // const tour = tours.find((el) => el.id === id);
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'invalid ID',
  //   });
  // }
  // res.status(200).json({
  //   stsus: 'success',
  //   // data: { tour }
  // });
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    // results: tours.length,
    // data: { tours },
  });
};

exports.createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    // data: { tour: newTour }
  });
};

exports.updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'invalid ID' });
  } else {
    res.status(200).json({
      status: 'success',
      data: { tour: '<Updated tour....>' },
    });
  }
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
