import winston from 'winston';

const { createLogger, format, transports } = winston;
const { colorize, combine, printf } = format;

const loggerFormat = printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`);

const logger = createLogger({
  level: 'info',
  format: combine(
    colorize(),
    format.timestamp(),
    loggerFormat,
  ),
  handleExceptions: true,
  transports: [new transports.Console()]
});

export default logger;
