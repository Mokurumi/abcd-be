const Joi = require("joi");

const lookupUsers = {
  query: Joi.object().keys({
    active: Joi.boolean(),
  }),
};

module.exports = {
  lookupUsers,
};
