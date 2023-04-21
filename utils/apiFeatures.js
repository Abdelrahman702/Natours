class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A)Filtring
    const queryObj = { ...this.queryString }; //create a new obj with the same content of req.query
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((element) => {
      delete queryObj[element];
    });

    // 1B)Advance Filtring

    // {  difficulty:'easy',  duration : {$gte :1}     }                this is req.query
    // {  difficulty:'easy',  duration : {gte :'1'}     }               this is the query

    let queryStr = JSON.stringify(queryObj); // convert the JSON object to string

    // The regular expression used here (/\b(gte|gt|lt|lte)\b/g) is using the \b boundary
    // matcher to match the start and end of words,
    // and the (gte|gt|lt|lte) group to match any of the specified
    //  strings (gte, gt, lt, or lte). The g flag at the end of
    //  the expression means that it will match all occurrences of these strings in the input string.

    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.select('-__v'); // to exclude it
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // to exclude it
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
