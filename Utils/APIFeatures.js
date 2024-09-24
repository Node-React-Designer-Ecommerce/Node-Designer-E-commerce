class APIFeatures {
  constructor(query, queryString) {
    this.query = query; //  Product.find()
    this.queryString = queryString; // The query parameters from the request (req.query)
  }

  // Filtering
  filter() {
    const queryObj = { ...this.queryString }; // Copy query parameters
    const excludedFields = ["page", "sort", "limit", "fields", "search"]; // Exclude unnecessary fields
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering for operators (gte, gt, lte, lt)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr)); // Apply filtering
    return this;
  }

  // Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" "); // Sort by fields, separated by commas
      this.query = this.query.sort(sortBy); // Apply sorting
    } else {
      this.query = this.query.sort("-createdAt"); // Default sort by newest products
    }
    return this;
  }

  // Pagination logic
  paginate() {
    const page = this.queryString.page * 1 || 1; // Default page is 1
    const limit = this.queryString.limit * 1 || 8; // Default limit is 8
    const skip = (page - 1) * limit; // Calculate how many documents to skip

    this.query = this.query.skip(skip).limit(limit); // Apply pagination
    return this;
  }

  // Search logic
  search() {
    if (this.queryString.search) {
      // Look for the `search` query parameter and perform a case-insensitive search
      const keyword = this.queryString.search
        ? {
            name: { $regex: this.queryString.search, $options: "i" }, // Assuming you're searching by `name`
          }
        : {};
      this.query = this.query.find({ ...keyword });
    }
    return this;
  }
}

module.exports = APIFeatures;
