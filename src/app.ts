import 'reflect-metadata'; // We need this in order to use @Decorators

import express from 'express';

import Logger from './loaders/logger';
import env from '@/_env';

async function startServer() {
  const app = express();

  /**
   * A little hack here
   * Import/Export can only be used in 'top-level code'
   * Well, at least in node 10 without babel and at the time of writing
   * So we are using good old require.
   **/
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  await require('./loaders').default({ app });

  app
    .listen(env.PORT, () => {
      Logger.info(`
      ################################################
      🛡️  Server listening on port: ${env.PORT} 🛡️
      ################################################
    `);
    })
    .on('error', err => {
      Logger.error(err);
      process.exit(1);
    });
}

startServer();
