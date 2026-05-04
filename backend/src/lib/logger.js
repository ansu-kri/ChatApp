const { createLogger, format, transports } = require("winston");
const path = require("path");

const { combine, timestamp, errors, json, colorize, printf } = format;

// Dev-friendly console format
const devFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : "";
  return `${timestamp} [${level}]: ${stack || message}${metaStr}`;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
  defaultMeta: {
    service: "orgchat-api",
    version: process.env.npm_package_version || "1.0.0",
    pid: process.pid,
  },
  transports: [
    // Console
    new transports.Console({
      format:
        process.env.NODE_ENV === "production"
          ? combine(timestamp(), errors({ stack: true }), json())
          : combine(
              colorize(),
              timestamp({ format: "HH:mm:ss" }),
              errors({ stack: true }),
              devFormat
            ),
    }),
  ],
});

// In production, also write to files
if (process.env.NODE_ENV === "production") {
  logger.add(
    new transports.File({
      filename: path.join("/var/log/orgchat", "error.log"),
      level: "error",
      format: combine(timestamp(), errors({ stack: true }), json()),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true,
    })
  );
  logger.add(
    new transports.File({
      filename: path.join("/var/log/orgchat", "combined.log"),
      format: combine(timestamp(), json()),
      maxsize: 20 * 1024 * 1024,
      maxFiles: 10,
      tailable: true,
    })
  );
}

// Attach request logging helper
logger.httpLogger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "http";
    logger.log(level, `${req.method} ${req.originalUrl}`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userId: req.user?._id,
    });
  });
  next();
};

module.exports = logger;