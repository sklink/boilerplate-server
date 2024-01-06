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
import { checkJwt } from '../middlewares/auth';

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
  clinicId?: string | null;
}

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
      context: async ({ req }): Promise<IContext> => {
        const result: IContext = { token: req.headers.token, authId: req.auth.payload.sub };

        if (req.auth.payload.sub) {
          result.user = await UserModel.findOne({ authId: result.authId });

          if (result.user) {
            result.clinicId = result.user.settings.activeClinicId;
            result.member = await MemberModel.findOne({
              clinicId: result.clinicId,
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
