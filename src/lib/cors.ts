import cors from 'cors';
import env from '../_env';

const whitelist = [
  // If you want to provide access to the API from any other domain, add them here...
  env.CLIENT_BASE_URL,
];

// Push the server's own URL so that we can use the /graphql playground
if (env.NODE_ENV === 'development') {
  whitelist.push(env.SERVER_BASE_URL);
}

const corsOptions = {
  origin(origin, callback) {
    // Allow server to server requests, whitelists & all during test.
    if (!origin || whitelist.indexOf(origin) !== -1 || env.NODE_ENV === 'test') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: 'Content-Type, Authorization, Accept, Accept-Language, Content-Language, *',
};

export default cors(corsOptions);
