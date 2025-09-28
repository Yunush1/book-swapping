const { createLogger, format, transports } = require("winston");
const path = require("path");
const DailyRotateFile = require("winston-daily-rotate-file");

const isProduction = process.env.NODE_ENV === "production";
const { combine, timestamp, printf, colorize, json, errors } = format;
const jsonFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  json(),
);
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "HH:mm:ss" }),
  printf(({ level, message, timestamp, stack }) => {
    return stack
      ? `[${timestamp}] [${level}]: ${message}\n${stack}`
      : `[${timestamp}] [${level}]: ${message}`;
  }),
);
const infoTransport = new DailyRotateFile({
  level: "info",
  filename: path.join(__dirname, "../logs/info-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxFiles: "7d",
  zippedArchive: false,
  format: jsonFormat,
});
const errorTransport = new DailyRotateFile({
  level: "error",
  filename: path.join(__dirname, "../logs/error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxFiles: "7d",
  zippedArchive: false,
  format: jsonFormat,
});

const exceptionTransport = new DailyRotateFile({
  filename: path.join(__dirname, "../logs/exceptions-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxFiles: "7d",
  zippedArchive: false,
  format: jsonFormat,
});

const consoleTransport = new transports.Console({
  level: isProduction ? "warn" : "info",
  format: consoleFormat,
});

const logger = createLogger({
  level: "info",
  transports: [consoleTransport, infoTransport, errorTransport],
  exceptionHandlers: [exceptionTransport],
  exitOnError: false,
});
process.on("unhandledRejection", (reason, promise) => {
  logger.error({
    message: "Unhandled Rejection",
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined,
    timestamp: new Date().toISOString(),
  });
});

module.exports = logger;
