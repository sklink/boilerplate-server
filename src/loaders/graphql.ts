import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';

// Apollo
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildSchema } from 'type-graphql';

// Middleware
import cors from '../lib/cors';
import { checkJwt } from '../api/middlewares/auth';

// Resolvers
import { UserResolver } from '@/domains/user/user.resolvers';

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
    checkJwt,
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  return server;
};
