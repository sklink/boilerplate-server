import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildSchema } from 'type-graphql';
import { expressjwt as jwt } from 'express-jwt';

import env from '@/_env';
import { UserResolver } from '@/domains/user/user.resolvers';
import { Algorithm } from 'jsonwebtoken';
import cors from '../lib/cors';

export const GRAPHQL_PATH = '/graphql';

export default async ({ app }: { app: express.Application }): Promise<ApolloServer> => {
  const httpServer = http.createServer(app);

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
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    GRAPHQL_PATH,
    cors,
    jwt({ secret: env.JWT_SECRET, credentialsRequired: false, algorithms: [env.JWT_ALGORITHM as Algorithm] }),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  return server;
};
