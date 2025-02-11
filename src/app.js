// packages
const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const passport = require("passport");
// configs
const config = require("./config");
const morgan = require("./config/morgan");
const { jwtStrategy } = require("./config/passport");
// utils
const { authLimiter } = require("./middlewares/rateLimiter");
const routes = require("./routes");
const { errorConverter, errorHandler } = require("./middlewares/error");
const xssSanitize = require("./middlewares/xssSanitize");
const ApiError = require("./utils/ApiError");

const app = express();

if (config.env !== "prod") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

// sanitize request data
app.use(xssSanitize());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// allow cors based on environment
app.use(
  cors({
    origin:
      config.env === "prod" ? [config.api_url.prod, config.web_url.prod] : "*",
    // : [
    //   config.api_url[config.env],
    //   config.web_url[config.env],
    //   "http://localhost:3100",
    //   "http://localhost:3101",
    //   "http://localhost:3102",
    //   "http://localhost:3000",
    //   "http://localhost:3001",
    //   "http://localhost:3002",
    // ],
    // allow any origin
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === "prod") {
  app.use("/auth", authLimiter);
}

// v1 api routes
app.use("/", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(404, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
