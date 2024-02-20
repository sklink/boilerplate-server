import express from 'express';

import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import graphqlLoader from './graphql';
import jobsLoader from './jobs';
import Logger from './logger';

//We have to import at least all the events once, so they can be triggered
import './events';
import { ENABLE_AGENDA, ENABLE_AUTH0 } from '../_configuration';

export default async ({ app }: { app: express.Application }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  await graphqlLoader({ app });

  // Returns the agenda instance because it's needed in the subsequent loaders
  const { agenda } = await dependencyInjectorLoader({
    mongoConnection,
    models: [
      { name: 'userModel', model: require('../domains/user/user.model').default },
    ],
    services: [
      { name: 'userService', service: require('../domains/user/user.service').default },
    ]
  });
  Logger.info('Dependency Injector loaded');

  if (agenda && ENABLE_AGENDA) await jobsLoader({ agenda });
  Logger.info('Agenda loaded');

  await expressLoader({ app });
  Logger.info('✌️ Express loaded');
};
