import Agenda, { JobPriority as _JobPriority } from 'agenda';

import env from '@/_env';
import EmailSequenceJob from '@/jobs/emailSequence';

const JobPriority = { ..._JobPriority };

export default async ({ agenda }: { agenda: Agenda }) => {
  agenda.define(
    'send-email',
    { priority: JobPriority.high, concurrency: env.JOB_CONCURRENCY },
    new EmailSequenceJob().handler,
  );

  return agenda.start();
};
