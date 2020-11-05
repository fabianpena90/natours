const mongoose = require('mongoose');
const dotenv = require('dotenv'); // dotenv is to connect .env files 
dotenv.config({ path: './config.env'})

const app = require('./app')

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
  useNewUrlParser: true, 
  useCreateIndex: true,
  useFindAndModify: false
}).then(connection => {
  console.log('DB successful')
});

// START THE SERVER
const port = 5000 || process.env.PORT;
app.listen(port, () => {
  console.log('Listening on port ' + port)
});
