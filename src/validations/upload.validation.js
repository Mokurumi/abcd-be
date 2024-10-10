const Joi = require("joi");
const { objectId } = require("./custom.validation");

const userProfileImage = {
  body: Joi.object().keys({
    file: Joi.string(),
    // category: Joi.string().required(),
    owner: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  userProfileImage,
};