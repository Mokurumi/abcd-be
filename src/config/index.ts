import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid("prod", "dev", "qa", "local").required(),
    VERSION: Joi.string().required().description("Version of the app"),
    PORT: Joi.number().default(3000),
    LOGO: Joi.string().required().description("Logo path"),
    // MONGO DB
    DB_CONNECTION: Joi.string().required().description("Mongo DB url"),
    SESSION_SEC: Joi.string().required().description("Session secret key"),
    // JWT
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_EXPIRE_MINUTES: Joi.string().required().description("JWT expire time"),
    JWT_REFRESH_EXPIRE_MINUTES: Joi.string()
      .required()
      .description("JWT refresh expire time"),
    JWT_VERIFY_REGISTER_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .required()
      .description("JWT expire time for verify register email"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .required()
      .description("JWT expire time for verify email"),
    // EMAIL
    SMTP_HOST: Joi.string().description("server that will send the emails"),
    SMTP_PORT: Joi.number().description("port to connect to the email server"),
    SMTP_USERNAME: Joi.string().description("username for email server"),
    SMTP_PASS: Joi.string().description("password for email server"),
    EMAIL_FROM: Joi.string().description(
      "the from field in the emails sent by the app"
    ),
    // WEB URLS
    WEB_URL_LOCAL: Joi.string().required().description("LOCAL WEB url"),
    WEB_URL_DEV: Joi.string().required().description("DEV WEB url"),
    WEB_URL_QA: Joi.string().required().description("QA WEB url"),
    WEB_URL_PROD: Joi.string().required().description("PROD WEB url"),
    // API URLS
    API_URL_LOCAL: Joi.string().required().description("LOCAL API url"),
    API_URL_DEV: Joi.string().required().description("DEV API url"),
    API_URL_QA: Joi.string().required().description("QA API url"),
    API_URL_PROD: Joi.string().required().description("PROD API url"),
    // CLOUDINARY
    CLOUDINARY_NAME: Joi.string().required().description("Cloudinary name"),
    CLOUDINARY_API_KEY: Joi.string()
      .required()
      .description("Cloudinary api key"),
    CLOUDINARY_API_SECRET: Joi.string()
      .required()
      .description("Cloudinary api secret"),
    // SUPER ADMIN
    SUPER_ADMIN_EMAIL: Joi.string().required().description("Super admin email"),
    SUPER_ADMIN_PHONE: Joi.string().required().description("Super admin phone"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: (envVars.NODE_ENV as "local" | "dev" | "qa" | "prod") || "local",
  version: envVars.VERSION,
  port: envVars.PORT,
  logo: envVars.LOGO,
  superAdmin: {
    email: envVars.SUPER_ADMIN_EMAIL,
    phone: envVars.SUPER_ADMIN_PHONE,
  },
  mongoose: {
    url: `${envVars.DB_CONNECTION}${envVars.NODE_ENV === "qa" ? "-qa" : ""}`,
    options: {},
    session_secret: envVars.SESSION_SEC,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    // token expiration time
    accessExpiration: envVars.JWT_EXPIRE_MINUTES,
    refreshExpiration: envVars.JWT_REFRESH_EXPIRE_MINUTES,
    // JWT Email Expiration
    verifyRegisterEmailExpirationMinutes:
      envVars.JWT_VERIFY_REGISTER_EMAIL_EXPIRATION_MINUTES,
    // other email expiration
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      secure: true,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASS,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  web_url: {
    local: envVars.WEB_URL_LOCAL,
    dev: envVars.WEB_URL_DEV,
    qa: envVars.WEB_URL_QA,
    prod: envVars.WEB_URL_PROD,
  },
  api_url: {
    local: envVars.API_URL_LOCAL,
    dev: envVars.API_URL_DEV,
    qa: envVars.API_URL_QA,
    prod: envVars.API_URL_PROD,
  },
  cloudinary: {
    name: envVars.CLOUDINARY_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_API_SECRET,
  },
};

export default config;
