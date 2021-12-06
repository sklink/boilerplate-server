import Agenda from 'agenda';

import env from '@/_env';
import EmailSequenceJob from '@/jobs/emailSequence';

export default ({ agenda }: { agenda: Agenda }) => {
  agenda.define(
    'send-email',
    { priority: 'high', concurrency: env.JOB_CONCURRENCY },
    new EmailSequenceJob().handler,
  );

  return agenda.start();
};
