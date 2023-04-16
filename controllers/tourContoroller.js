const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getTour = (req, res) => {
  // if iwant to make a parameter optional ?id
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }
  res.status(200).json({ stsus: 'success', data: { tour } });
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1; //to get the id of the last existing tours
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour); //push the newTour into the tours array (normal push process to array )

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({ status: 'success', data: { tour: newTour } });
    }
  );
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
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'invalid ID' });
  } else {
    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
};
