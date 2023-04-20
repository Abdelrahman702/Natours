/* eslint-disable prettier/prettier */
const dotenv = require('dotenv'); //used to load environment variables from a .env file into the Node.js environment.
dotenv.config({ path: './config.env' }); //read the vaiables from the file and save it in nodejs environment variables

const app = require('./app');
const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
); // the information about database to connect with it

mongoose // to connect with the database
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    // handle the promise because the connect function return a promise
    console.log('DB connection successful');
  });

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App is running on port ${port}....`);
});
