import * as winston from 'winston';

const transports: Array<winston.transport> = [
  new winston.transports.File({
    filename: './logs/error.log',
    level: 'error'
  })
];

const Logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports,
  exitOnError: false
});

export default Logger;
