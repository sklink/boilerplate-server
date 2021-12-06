import { Router } from 'express';
import basicAuth from 'express-basic-auth';
import agendash from 'agendash';
import { Container } from 'typedi';

import env from '@/_env';

export default (app: Router) => {
  const agendaInstance = Container.get('agendaInstance');

  if (env.JOB_DASHBOARD_USER && env.JOB_DASHBOARD_PASSWORD) {
    app.use(
      env.JOB_DASHBOARD_ROUTE,
      basicAuth({
        users: { [env.JOB_DASHBOARD_USER]: env.JOB_DASHBOARD_PASSWORD },
        challenge: true,
      }),
      agendash(agendaInstance),
    );
  }
};
