import express from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import cors from "cors";
import passport from "passport";
// configs
import config from "./config";
import * as morgan from "./config/morgan";
import { jwtStrategy } from "./config/passport";
// // utils
import { authLimiter } from "./middlewares/rateLimiter";
import routes from "./routes";
import { errorConverter, errorHandler } from "./middlewares/error";
import xssSanitize from "./middlewares/xssSanitize";
import ApiError from "./utils/ApiError";

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

export default app;
