const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')

exports.aliasTopTours = (req, res, next) => { // get the top 5 cheap tours
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

exports.getAllTours = async (req, res) => {  // req,res are also called the route handler
  try {
    // BUILD QUERY
    //1A) Filtering
    // console.log(req.query, queryObj); //{ duration: '5', difficulty: 'easy' } GET /api/v1/tours?duration=5&difficulty=easy 200 51.564 ms - 9386
    // console.log(req.query)
    // const queryObj = {...req.query } // making a copy of the original query
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach(el => delete queryObj[el]);

    // //1B) Advance filtering
    // let queryStr = JSON.stringify(queryObj)
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`) //regex 

    // let query = Tour.find(JSON.parse(queryStr)) //To filter each tour by whatever the params are

    // 2) SORT
    // if(req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' '); //sorting by multiple params
    //   query = query.sort(sortBy)
    //   //sort('price ratingsAverage')
    // } else {
    //   query = query.sort('-createdAt') // Default sort 
    // }

    //3) Filed Limiting
    // if(req.query.fields){
    //   const fields = req.query.fields.split(',').join(' ')
    //   query = query.select(fields)
    // } else {
    //   query = query.select('-__v') //excluding oly __v field
    // }

    //4) PAGINATION
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page -1) * limit;
    // // page=2&limit=10 1-10 page 1, 11-20 page 2
    // query= query.skip(skip).limit(limit)

    // if(req.query.page){
    //   const numTours = await Tour.countDocuments() //this is going to return the number of documents as a promise thats why we use await
    //   if(skip >= numTours)throw new Error('This page does not exist')
    // }

    //EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;
    
    // SEND RESPONSE
    res.status(200).json({
      status: 'success', 
      result: tours.length,
      data: {
        tours
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

exports.getTour = async (req, res) => {  // req,res are also called the route handler
  try {
    const tour = await Tour.findById(req.params.id)
    res.status(200).json({
    status: 'success', 
    data: {
      tour
    }
  })
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err
    })
  }

  
}

exports.createTour = async (req, res) => {
  // const newTour = new Tour({}) // one way to create a model
  // newTour.save();
  try {
    const newTour = await Tour.create(req.body) // second way to create a model
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data sent!'
    })
  }
}

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data sent!'
    })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id, { value: true, runValidators: true})
    res.status(204).json({
      status: 'success',
      data: null
    })
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err
    })
  }
};