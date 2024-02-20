import { Container } from 'typedi';

// Utils
import LoggerInstance from './logger';
import agendaFactory from './agenda';
import { ENABLE_AGENDA } from '../_configuration';

export default ({ mongoConnection, models, services }: {
  mongoConnection;
  models: { name: string; model: any }[],
  services: { name: string; service: any }[]
}) => {
  try {
    let agendaInstance;
    let auth0Instance;

    models.forEach(m => {
      Container.set(m.name, m.model);
    });

    services.forEach(s => {
      console.log('setting', s.name);
      Container.set(s.name, s.service);
    });

    if (ENABLE_AGENDA) {
      agendaInstance = agendaFactory({ mongoConnection });
      Container.set('agendaInstance', agendaInstance);
      LoggerInstance.info('Agenda injected into container');
    }

    Container.set('logger', LoggerInstance);

    return {
      agenda: agendaInstance,
      auth0: auth0Instance
    };
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
