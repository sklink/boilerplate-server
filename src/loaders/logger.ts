import winston from 'winston';
import Sentry from 'winston-sentry-log';

import * as pkg from '../../package.json';
import env from '@/_env';

const transports = [];
if (env.NODE_ENV !== 'development') {
  transports.push(new winston.transports.Console());

  if (env.SENTRY_DSN) {
    const sentryTransport = new Sentry({
      dsn: env.SENTRY_DSN,
      level: env.SENTRY_LOG_LEVEL,
      environment: env.NODE_ENV,
      release: pkg.version,
    });

    transports.push(sentryTransport);
  }
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.cli(), winston.format.splat()),
    }),
  );
}

const LoggerInstance = winston.createLogger({
  level: env.LOG_LEVEL,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports,
});

export default LoggerInstance;
