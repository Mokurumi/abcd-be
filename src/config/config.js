const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid("prod", "dev", "qa").required(),
    PORT: Joi.number().default(3000),
    // MONGO DB
    DB_CONNECTION: Joi.string().required().description("Mongo DB url"),
    SESSION_SEC: Joi.string().required().description("Session secret key"),
    // JWT
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_EXPIRE: Joi.string().required().description("JWT expire time"),
    // EMAIL
    SMTP_HOST: Joi.string().description("server that will send the emails"),
    SMTP_PORT: Joi.number().description("port to connect to the email server"),
    SMTP_USERNAME: Joi.string().description("username for email server"),
    SMTP_PASSWORD: Joi.string().description("password for email server"),
    EMAIL_FROM: Joi.string().description("the from field in the emails sent by the app"),
    // API URLS
    API_URL_LOCAL: Joi.string().required().description("LOCAL API url"),
    API_URL_DEV: Joi.string().required().description("DEV API url"),
    API_URL_QA: Joi.string().required().description("QA API url"),
    API_URL_PROD: Joi.string().required().description("PROD API url"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: "key" } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.DB_CONNECTION + (envVars.NODE_ENV === "qa" ? "-qa" : ""),
    options: {},
    session_secret: envVars.SESSION_SEC
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expire: envVars.JWT_EXPIRE
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  api_url: {
    local: envVars.API_URL_LOCAL,
    dev: envVars.API_URL_DEV,
    qa: envVars.API_URL_QA,
    prod: envVars.API_URL_PROD
  }
};
