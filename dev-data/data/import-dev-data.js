const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // dotenv is to connect .env files 
const Tour = require('./../../models/tourModel')
dotenv.config({ path: './config.env'})

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
  useNewUrlParser: true, 
  useCreateIndex: true,
  useFindAndModify: false
}).then(connection => {
  console.log('DB successful')
});

// READ JSON FILE 
const tours = JSON.parse(fs.readFileSync(__dirname + '/tours-simple.json', 'utf8'));

// IMPORT DATA INTO DATABASE
const importData = async () => {
  try {
    await Tour.create(tours)
    console.log('Data successfully imported')
    process.exit();
  } catch (err) {
    console.log(err)
  }
}

// DELETE ALL DATA FROM COLLECTION (DB)
const deleteData = async () => {
  try {
    await Tour.deleteMany()
    console.log('Data successfully deleted');
    process.exit();
  } catch (err) {
    console.log(err)
  }
}

if(process.argv[2] === '--import') {
  importData()
} else if(process.argv[2] === '--delete') {
  deleteData()
}

console.log(process.argv) //['/usr/local/bin/node', '/Volumes/MY LIFE/GitHub/complete-node-bootcamp/4-natours/starter/dev-data/data/import-dev-data.js']