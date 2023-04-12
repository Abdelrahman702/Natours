const express = require('express');
const app = express();

const port = 3000;

app.listen(port, () => {
  console.log(`App is running on port ${port}....`);
});

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side ', app: 'Natours' });
});
