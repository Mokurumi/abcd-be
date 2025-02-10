/**
 * Custom date format validation
 * @param {string} value - The date value to validate
 * @param {CustomHelpers} helpers - The Joi validation helpers
 * @returns {string} - The validated value or error message
 */
const customDate = (value, helpers) => {
  if (!value.match(/^\d{4}[-/]\d{2}[-/]\d{2}$/)) {
    return helpers.message("Invalid date format");
  }
  return value;
};

/**
 * Custom ObjectId validation
 * @param {string} value - The id value to validate
 * @param {CustomHelpers} helpers - The Joi validation helpers
 * @returns {string} - The validated value or error message
 */
const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message("{{#label}} must be a valid id");
  }
  return value;
};

/**
 * Custom password validation
 * @param {string} value - The password value to validate
 * @param {CustomHelpers} helpers - The Joi validation helpers
 * @returns {string} - The validated value or error message
 */
const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message("password must be at least 8 characters");
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(
      "password must contain at least 1 letter and 1 number"
    );
  }
  return value;
};

/**
 * Custom phone number validation
 * @param {string} value - The phone number value to validate
 * @param {CustomHelpers} helpers - The Joi validation helpers
 * @returns {string} - The validated value or error message
 */
const phoneNumber = (value, helpers) => {
  const phoneRegex =
    "^(?:254|\\+254|0|\\+2540)?((7|1)(?:(?:[0-9][0-9])|(?:0[0-8])|(4[0-1]))[0-9]{6})$";

  if (!value.match(phoneRegex)) {
    return helpers.message("Invalid phone number");
  }

  return value;
};

module.exports = {
  customDate,
  objectId,
  password,
  phoneNumber,
};
