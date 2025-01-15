const Joi = require("joi");
const { objectId } = require("./custom.validation");


const lookupUsers = {
  query: Joi.object().keys({
    active: Joi.boolean(),
  }),
};


module.exports = {
  lookupUsers
};