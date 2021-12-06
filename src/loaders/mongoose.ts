import mongoose from 'mongoose';
import { Db } from 'mongodb';

import env from '@/_env';

export default async (): Promise<Db> => {
  const connection = await mongoose.connect(env.DATABASE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  return connection.connection.db;
};
