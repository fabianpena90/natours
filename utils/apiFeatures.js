class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // query = mongoose query
    this.queryString = queryString; // queryString = express query this is coming from req.query
  }

  filter() {
    const queryObj = { ...this.queryString } // making a copy of the original query
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    //1B) Advance filtering
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`) //regex 

    this.query = this.query.find(JSON.parse(queryStr))

    return this; // returns the entire object
  }

  sort() {
    if(this.queryString.sort) {
      const sortBy = req.query.sort.split(',').join(' '); //sorting by multiple params
      this.query = this.query.sort(sortBy)
      //sort('price ratingsAverage')
    } else {
      this.query = this.query.sort('-createdAt') // Default sort 
    }
    return this; // returns the entire object
  }

  limitFields() {
    if(this.queryString.fields){
      const fields = this.queryString.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v') //excluding oly __v field
    }
    return this; // returns the entire object
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page -1) * limit;
    // page=2&limit=10 1-10 page 1, 11-20 page 2
    this.query= this.query.skip(skip).limit(limit)

    return this; // returns the entire object

    // if(this.queryString.page){
    //   const numTours = await Tour.countDocuments() //this is going to return the number of documents as a promise thats why we use await
    //   if(skip >= numTours)throw new Error('This page does not exist')
    // }
  }
}

module.exports = APIFeatures;