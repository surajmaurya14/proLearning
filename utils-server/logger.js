const winston = require("winston");

const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");

let accessLogStream = null;
let logDirectory = null;

if (process.env.NODE_ENV === "production") {
    logDirectory = path.join(__dirname, "../production_logs");
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
    accessLogStream = rfs.createStream("access.log", {
        size: "10M", // rotate every 10 MegaBytes written
        interval: "1d", // rotate daily
        compress: "gzip", // compress rotated files
        path: logDirectory, // path of access.log file
    });
}

const enumerateErrorFormat = winston.format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});

const logger = winston.createLogger({
    level: process.env.NODE_ENV !== "production" ? "debug" : "info",
    format: winston.format.combine(
        enumerateErrorFormat(),
        process.env.NODE_ENV !== "production"
            ? winston.format.colorize()
            : winston.format.uncolorize(),
        winston.format.splat(),
        winston.format.printf(({ level, message }) => `${level}: ${message}`)
    ),
    transports: [
        process.env.NODE_ENV === "production"
            ? new winston.transports.Stream({
                  stream: accessLogStream,
              })
            : new winston.transports.Console({
                  stderrLevels: ["error"],
              }),
    ],
});

module.exports = logger;
