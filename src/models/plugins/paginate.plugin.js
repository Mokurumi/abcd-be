/* eslint-disable no-param-reassign */

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
      const sortingCriteria = [];
      options.sortBy.split(",").forEach((sortOption) => {
        const [key, order] = sortOption.split(":");
        sortingCriteria.push((order === "desc" ? "-" : "") + key);
      });
      sort = sortingCriteria.join(" ");
    }
    else {
      sort = "createdAt";
    }

    const size = options.size && parseInt(options.size, 10) > 0
      ? parseInt(options.size, 10)
      : 10;
    const page = options.page && parseInt(options.page, 10) > 0
      ? parseInt(options.page, 10)
      : 1;
    const skip = (page - 1) * size;

    const filterObject = { ...filter };

    // Apply search filter directly to filterObject before counting documents
    if (filter.search) {
      const search = filter.search;
      const searchFilter = Object.keys(schema.obj).reduce((acc, key) => {
        if (schema.obj[key].type === String) {
          acc.push({ [key]: { $regex: search, $options: "i" } });
        }
        return acc;
      }, []);
      filterObject.$or = searchFilter;
      delete filterObject.search; // Remove the search key from filter
    }

    const countPromise = this.countDocuments(filterObject).exec();
    let docsPromise = this.find(filterObject).sort(sort).skip(skip).limit(size);

    // Updated populate handling
    if (options.populate) {
      if (typeof options.populate === "string") {
        // Populate as string (e.g., "user,comments.user")
        options.populate.split(",").forEach((populateOption) => {
          docsPromise = docsPromise.populate(
            populateOption
              .split(".")
              .reverse()
              .reduce((a, b) => ({ path: b, populate: a }))
          );
        });
      }
      else if (Array.isArray(options.populate)) {
        // Populate as array of objects with fields
        options.populate.forEach((populateObj) => {
          docsPromise = docsPromise.populate(populateObj);
        });
      } else if (typeof options.populate === "object") {
        // Populate as a single object with fields
        docsPromise = docsPromise.populate(options.populate);
      }
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / size);
      const result = {
        results,
        page,
        size,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = paginate;
