import dotenv from 'dotenv';
import { ENABLE_AGENDA, ENABLE_AUTH0 } from './_configuration';

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IRequiredAppEnvVars {
  // TODO: Make sure to set up types for  the variables you want to use
}

const REQUIRED_APP_ENV_VARS: IRequiredAppEnvVars = {
  // TODO: Add your required app ENV variables here...
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IOptionalAppEnvVars {
  // TODO: Make sure to set up types for  the variables you want to use
}

const OPTIONAL_APP_ENV_VARS: IOptionalAppEnvVars = {
  // TODO: Add your optional app ENV variables here...
};

// Boilerplate...
// ====
interface IRequiredBoilerplateEnvVars {
  readonly DATABASE_URL: string;
  readonly JWT_SECRET: string;
  readonly SESSION_SECRET: string;
  readonly NODE_ENV: string;
  readonly CLIENT_BASE_URL: string;
  readonly SERVER_BASE_URL: string;
}

const REQUIRED_BOILERPLATE_ENV_VARS: IRequiredBoilerplateEnvVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  CLIENT_BASE_URL: process.env.CLIENT_BASE_URL,
  SERVER_BASE_URL: process.env.SERVER_BASE_URL,
};

// NOTE: this are marked as optional params for the ENABLE_AGENDA _configuration but will throw an error if they are not set
interface IRequiredAgendaBoilerplateEnvVars {
  readonly JOB_DASHBOARD_USER?: string;
  readonly JOB_DASHBOARD_PASSWORD?: string;
}

const REQUIRED_AGENDA_ENV_VARS: IRequiredAgendaBoilerplateEnvVars = {
  JOB_DASHBOARD_USER: process.env.JOB_DASHBOARD_USER,
  JOB_DASHBOARD_PASSWORD: process.env.JOB_DASHBOARD_PASSWORD,
};

// NOTE: this are marked as optional params for the ENABLE_AUTH0 _configuration but will throw an error if they are not set
type IRequiredAuth0BoilerplateEnvVars =  {
  readonly AUTH0_DOMAIN?: string;
  readonly AUTH0_CLIENT_ID?: string;
  readonly AUTH0_AUDIENCE?: string;
}

const REQUIRED_AUTH0_ENV_VARS: IRequiredAuth0BoilerplateEnvVars = {
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
};

const REQUIRED_KEYS = Object.keys({
  ...REQUIRED_APP_ENV_VARS,
  ...REQUIRED_BOILERPLATE_ENV_VARS,
  ...(ENABLE_AGENDA ? REQUIRED_AGENDA_ENV_VARS : {}),
  ...(ENABLE_AUTH0 ? REQUIRED_AUTH0_ENV_VARS : {}),
});

REQUIRED_KEYS.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required env var: ${envVar}`);
  }
});

interface IOptionalBoilerplateEnvVars {
  readonly JWT_ALGORITHM: string;
  readonly LOG_LEVEL: string;
  readonly PORT: string;
  readonly API_PREFIX: string;
  readonly JOB_DB_COLLECTION: string;
  readonly JOB_CONCURRENCY: number;
  readonly JOB_PROCESS_INTERVAL: string;
  readonly JOB_DASHBOARD_ROUTE: string;
  readonly SENTRY_DSN?: string;
  readonly SENTRY_LOG_LEVEL?: string;
}

const OPTIONAL_BOILERPLATE_ENV_VARS: IOptionalBoilerplateEnvVars = {
  JWT_ALGORITHM: process.env.JWT_ALGO || 'RS256',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  PORT: process.env.PORT || '4000',
  API_PREFIX: process.env.API_PREFIX || '/api',
  JOB_DB_COLLECTION: process.env.AGENDA_COLLECTION || 'jobs',
  JOB_CONCURRENCY: process.env.JOB_CONCURRENCY ? Number(process.env.JOB_CONCURRENCY) : 20,
  JOB_PROCESS_INTERVAL: process.env.JOB_PROCESS_INTERVAL || '1 minute',
  JOB_DASHBOARD_ROUTE: process.env.JOB_DASHBOARD_ROUTE || '/jobs',
  SENTRY_DSN: process.env.SENTRY_DSN,
  SENTRY_LOG_LEVEL: process.env.SENTRY_LOG_LEVEL,
};

interface IEnvVars
  extends IOptionalBoilerplateEnvVars,
    IRequiredBoilerplateEnvVars,
    IOptionalAppEnvVars,
    IRequiredAppEnvVars,
    IRequiredAgendaBoilerplateEnvVars,
    IRequiredAuth0BoilerplateEnvVars {}

const env: IEnvVars = {
  ...OPTIONAL_APP_ENV_VARS,
  ...REQUIRED_APP_ENV_VARS,
  ...REQUIRED_AUTH0_ENV_VARS,
  ...REQUIRED_AGENDA_ENV_VARS,
  ...OPTIONAL_BOILERPLATE_ENV_VARS,
  ...REQUIRED_BOILERPLATE_ENV_VARS,
};

export default env;
