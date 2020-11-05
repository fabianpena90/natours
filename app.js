const express = require('express'); // express is a function with bunch of methods

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const morgan = require('morgan')
const app = express();

// 1) MIDDLEWARES
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


app.use(express.json()); // This is the middlewear that can modify the incoming Data!!!!!
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
  console.log("Middleware <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
  next();
});

// Middleware (personalized)
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter)

module.exports = app;