/**
 * A higher-order function to catch async errors in Express route handlers
 * @param {Function} fn - The async function to wrap
 * @returns {Function} A function that returns a Promise, catching async errors
 */
const catchAsync = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;
