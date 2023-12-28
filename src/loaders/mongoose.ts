import mongoose from 'mongoose';

import env from '@/_env';

export default async (): Promise<mongoose.mongo.Db> => {
  const connection = await mongoose.connect(env.DATABASE_URL);

  return connection.connection.db;
};


