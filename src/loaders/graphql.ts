import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';

// Apollo
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';

// Middleware
import cors from '../lib/cors';
import { checkJwt } from '../middlewares/jwt-auth.middleware';
import { AuthChecker } from '../middlewares/graphql-auth.middleware';

// Resolvers
import { UserResolver } from '@/domains/user/user.resolvers';
import { User, UserModel } from '../domains/user/user.model';
import { Member, MemberModel } from '../domains/member/member.model';

export const GRAPHQL_PATH = '/graphql';

export interface IContext {
  token: string | string[];
  authId: string | null;
  user?: User | null;
  member?: Member | null;
  activeClinicId?: string | null;
  activeJourneyId?: string | null;
}

export default async ({ app }: { app: express.Application }): Promise<ApolloServer> => {
  const httpServer = http.createServer(app);

  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      // TODO: Add your resolvers here...
    ],
    authChecker: AuthChecker,
    emitSchemaFile: true,
    container: Container,
    validate: false,
  });

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: process.env.NODE_ENV === 'development'
  });

  await server.start();

  app.use(
    GRAPHQL_PATH,
    cors,
    checkJwt,
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<IContext> => {
        const result: IContext = { token: req.headers.token, authId: req.auth.payload.sub };

        if (req.auth.payload.sub) {
          result.user = await UserModel.findOne({ authId: result.authId });

          if (result.user) {
            result.activeClinicId = result.user.settings.activeClinicId;
            result.activeJourneyId = result.user.settings.activeJourneyId;
            result.member = await MemberModel.findOne({
              clinicId: result.activeClinicId,
              userId: result.user._id,
            });
          }
        }

        return result;
      },
    })
  );

  return server;
};
