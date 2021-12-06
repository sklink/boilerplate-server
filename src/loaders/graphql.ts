import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { buildSchema } from 'type-graphql';
import * as jwt from 'express-jwt';

import env from '@/_env';
import { UserResolver } from '@/domains/user/user.resolvers';

export const GRAPHQL_PATH = '/graphql';

export default async ({ app }: { app: express.Application }): Promise<ApolloServer> => {
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      // TODO: Add your resolvers here...
    ],
    emitSchemaFile: true,
    validate: false,
  });

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req, user: req.user }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  });

  await server.start();

  app.use(GRAPHQL_PATH, jwt({ secret: env.JWT_SECRET, credentialsRequired: false }));
  server.applyMiddleware({ app, path: GRAPHQL_PATH });

  return server;
};
