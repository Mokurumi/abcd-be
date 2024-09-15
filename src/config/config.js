const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid("prod", "dev", "qa").required(),
    PORT: Joi.number().default(3000),
    // DB_CONNECTION: Joi.string().required().description("Mongo DB url"),
    // JWT
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(60).description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(1440).description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(1440).description("minutes after which verify email token expires"),
    JWT_VERIFY_ONBOARDING_EMAIL_EXPIRATION_MINUTES: Joi.number().default(1440).description("minutes after which verify onboarding email token expires"),
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
  // mongoose: {
  //   url: envVars.DB_CONNECTION + (envVars.NODE_ENV === "qa" ? "-qa" : ""),
  //   options: {
  //     useCreateIndex: true,
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   },
  // },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    verifyOnboardingEmailExpirationMinutes: envVars.JWT_VERIFY_ONBOARDING_EMAIL_EXPIRATION_MINUTES,
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
