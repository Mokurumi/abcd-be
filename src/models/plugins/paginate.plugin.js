const paginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} size - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options.size] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  schema.statics.paginate = async function (filter, options) {
    let sort = "";
    if (options.sortBy) {
      sort = options.sortBy
        .split(",")
        .map((sortOption) => {
          const [key, order] = sortOption.split(":");
          return (order === "desc" ? "-" : "") + key;
        })
        .join(" ");
    } else {
      sort = "-createdAt";
    }

    const size = options.size && options.size > 0 ? options.size : 10;
    const page = options.page && options.page > 0 ? options.page : 1;
    const skip = (page - 1) * size;

    const filterObject = { ...filter };

    // Apply search filter directly to filterObject before counting documents
    if (filter.search) {
      const search = filter.search;
      const searchFilter = Object.keys(schema.obj).reduce((acc, key) => {
        if (schema.obj[key]?.type === String) {
          acc.push({ [key]: { $regex: search, $options: "i" } });
        }
        return acc;
      }, []);
      filterObject.$or = searchFilter;
      delete filterObject.search;
    }

    /**
     * find any value which is a string separated by commas
     * and convert it to an array of values
     * and then convert it to an array of values
     */
    Object.keys(filterObject).forEach((key) => {
      if (
        typeof filterObject[key] === "string" &&
        filterObject[key].includes(",")
      ) {
        filterObject[key] = { $in: filterObject[key].split(",") };
      } else if (Array.isArray(filterObject[key])) {
        filterObject[key] = { $in: filterObject[key] };
      }
    });

    const countPromise = this.countDocuments(filterObject).exec();
    let docsPromise = this.find(filterObject).sort(sort).skip(skip).limit(size);

    if (options.populate) {
      if (typeof options.populate === "string") {
        options.populate.split(",").forEach((populateOption) => {
          docsPromise = docsPromise.populate({ path: populateOption.trim() });
        });
      } else if (Array.isArray(options.populate)) {
        // Populate as array of objects with fields
        options.populate.forEach((populateOption) => {
          if (typeof populateOption === "string") {
            docsPromise = docsPromise.populate({ path: populateOption.trim() });
          } else {
            docsPromise = docsPromise.populate(populateOption);
          }
        });
      } else {
        // Populate as a single object with fields
        docsPromise = docsPromise.populate(options.populate);
      }
    }

    const [totalResults, results] = await Promise.all([
      countPromise,
      docsPromise.exec(),
    ]);
    const totalPages = Math.ceil(totalResults / size);

    return {
      results,
      page,
      size,
      totalPages,
      totalResults,
    };
  };
};

module.exports = paginate;
