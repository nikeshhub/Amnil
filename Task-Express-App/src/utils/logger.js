import { createLogger, format, transports } from "winston";

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "success.log",
      level: "info",
      format: format.combine(
        format.colorize(), 
        format.timestamp(),
        format.simple(),
        format.prettyPrint()
      ),
    }),
    new transports.File({
      filename: "error.log",
      level: "error",
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.simple(),
        format.prettyPrint()
      ),
    }),
  ],
});

export default logger;
