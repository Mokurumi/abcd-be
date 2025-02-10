import Joi from "joi";

const lookupUsers = {
  query: Joi.object().keys({
    active: Joi.boolean(),
  }),
};

export default { lookupUsers };
