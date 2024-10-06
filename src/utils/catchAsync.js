// catchAsync function with returned Promise
const catchAsync = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// Function to handle cron job execution and error handling
const runCronJob = async (cronJobFunction) => {
  try {
    await cronJobFunction();
    console.log("Cron job executed successfully!");
  } catch (err) {
    console.error("Cron job error:", err);
  }
};

module.exports = {
  catchAsync,
  runCronJob,
};
