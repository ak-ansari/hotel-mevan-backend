import winston from "winston";
import chalk from "chalk";
import moment from "moment";

// Define the custom log level
winston.addColors({ success: "green" });

// Add the custom level to the levels configuration
const levels = { ...winston.config.syslog.levels, success: 7 };

declare module "winston" {
  interface Logger {
    success: winston.LeveledLogMethod;
  }
}

const today = moment().format("DD-MM-YYYY");

// Create the logger instance
export const wsLogger = winston.createLogger({
  levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, email, error }) => {
      return `${chalk.blueBright(email ? email : "")} > ${timestamp} ${getColouredLevel(level)}: ${message} ${error ? `>> ${error}` : ""}`;
    })
  ),
  transports: [
    new winston.transports.Console({ level: "success" }),
    new winston.transports.File({ filename: `logs/info/${today}-info.log`, level: "info" }),
    new winston.transports.File({ filename: `logs/error/${today}-error.log`, level: "error" }),
    new winston.transports.File({ filename: `logs/success/${today}-success.log`, level: "success" }),
    new winston.transports.File({ filename: `logs/other/${today}-other.log` }),
  ],
});


// Function to get colored levels
function getColouredLevel(level: string): string {
  switch (level) {
    case "info": return chalk.blue(level);
    case "error": return chalk.red(level);
    case "success": return chalk.green(level);
    default: return chalk.yellow(level);
  }
}