import winston from "winston";
import config from "./index";

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: config.env === "dev" ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === "dev"
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    // new winston.transports.File({ filename: 'logs.txt' }), // Log to a file
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

export default logger;
