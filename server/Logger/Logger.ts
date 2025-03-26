import winston from "winston";

// Define log format
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

// Create a Winston logger instance
const logger = winston.createLogger({
  level: "info", // Default logging level
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp to logs
    winston.format.colorize(), // Colorize logs in console
    logFormat
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: "logs/error.log", level: "error" }), // Log errors to file
    new winston.transports.File({ filename: "logs/combined.log" }) // Log all messages to file
  ]
});

// Export the logger for use in other files
export default logger;
