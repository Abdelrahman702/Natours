const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const port = 3000;

app.listen(port, () => {
  console.log(`App is running on port ${port}....`);
});

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side ', app: 'Natours' });
// });

app.post('/api/v1/tours', (req, res) => {
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
});
