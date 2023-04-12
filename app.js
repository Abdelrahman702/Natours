const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const port = 3000;

app.listen(port, () => {
  console.log(`App is running on port ${port}....`);
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getTour = (req, res) => {
  // if iwant to make a parameter optional ?id
  console.log(req.params);
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

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
};

const createTour = (req, res) => {
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

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'invalid ID' });
  } else {
    res.status(200).json({
      status: 'success',
      data: { tour: '<Updated tour....>' },
    });
  }
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'invalid ID' });
  } else {
    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
};

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);
