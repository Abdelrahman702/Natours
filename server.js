const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); //read the vaiables from the file and save it in nodejs environment variables

const app = require('./app');

console.log(process.env);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App is running on port ${port}....`);
});
