const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createUser = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    middleName: Joi.string(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    mobileNumber: Joi.string().required(),
    prefix: Joi.string(),
    country: Joi.string().required(),
    countryName: Joi.string(),
    phoneCountry: Joi.string(),
    phoneNumber: Joi.string(),
    userType: Joi.string().required(),
    role: Joi.string().required().valid("user", "admin"),
    companyId: Joi.string(),
    companyRole: Joi.string(),
    tnc: Joi.boolean().required(),
    image: Joi.object(),
    permission: Joi.object(),
    password: Joi.string().custom(password).required(),
  }),
};

const importUser = {
  body: Joi.object().keys({
    file: Joi.string(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    firstName: Joi.string(),
    middleName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
    mobileNumber: Joi.string(),
    prefix: Joi.string(),
    country: Joi.string(),
    phoneCountry: Joi.string(),
    phoneNumber: Joi.string(),
    countryName: Joi.string(),
    status: Joi.string(),
    companyId: Joi.string(),
    companyRole: Joi.string(),
    userType: Joi.string(),
    role: Joi.string().valid("user", "admin"),
    tnc: Joi.boolean(),
    image: Joi.object(),
    permission: Joi.object(),
    membership: Joi.string(),
    isMobileNumberVerified: Joi.boolean(),
    isEmailVerified: Joi.boolean(),
    password: Joi.string().custom(password),
    startDate: Joi.date(),
    endDate: Joi.date(),
    dateCreated: Joi.date(),
    sortBy: Joi.string(),
    size: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      firstName: Joi.string(),
      middleName: Joi.string(),
      lastName: Joi.string(),
      email: Joi.string().email(),
      mobileNumber: Joi.string(),
      prefix: Joi.string(),
      country: Joi.string(),
      countryName: Joi.string(),
      phoneCountry: Joi.string(),
      phoneNumber: Joi.string(),
      status: Joi.string(),
      companyId: Joi.string(),
      companyRole: Joi.string(),
      userType: Joi.string(),
      role: Joi.string().valid("user", "admin"),
      tnc: Joi.boolean(),
      image: Joi.object(),
      permission: Joi.object(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  importUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
