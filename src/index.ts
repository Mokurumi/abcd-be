import mongoose from "mongoose";
import app from "./app";
import config from "./config";
import logger from "./config/logger";
import initializeDatabase from "./utils/initializeDatabase";
import { Server } from "http";

let server: Server;

mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(async () => {
    logger.info("Connected to the database");

    await initializeDatabase();

    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  })
  .catch((err: Error) => {
    logger.error(`Error connecting to the database: ${err.message}`);
  });

const exitHandler = (): void => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error): void => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
