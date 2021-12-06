import Agenda from 'agenda';

import env from '@/_env';

export default ({ mongoConnection }) => {
  // https://github.com/agenda/agenda#mongomongoclientinstance
  return new Agenda({
    mongo: mongoConnection,
    db: { collection: env.JOB_DB_COLLECTION },
    processEvery: env.JOB_PROCESS_INTERVAL,
    maxConcurrency: env.JOB_CONCURRENCY,
  });
};
