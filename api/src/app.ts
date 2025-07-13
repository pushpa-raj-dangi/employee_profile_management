import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import { buildSchema } from "type-graphql";
import { AuthResolver } from "./resolvers/auth.resolver";
import { CompanyResolver } from "./resolvers/company.resolver";
import { DashboardResolver } from "./resolvers/dashboard.resolver";
import { UserResolver } from "./resolvers/user.resolver";
import { customAuthChecker } from "./utils/auth/authChecker";
import { createContext } from "./utils/context";
import { formatError } from "./utils/errorFormatter";
import { ExceptionFilter } from "./utils/exceptionFilter";
import { graphqlRateLimiter } from "./utils/rateLimiter";
import Container from "typedi";
import session from "express-session";
import redisClient from "./utils/redisClient";
import connectRedis from "connect-redis";

const RedisStore = connectRedis(session);

async function startServer() {
  const app = express();

  app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET!||'asfkjsdfjweoirjiworjlkwejrewrweriwer',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    },
  })
);
  app.use(
    cors({
      origin: ["http://localhost:4200", "https://studio.apollographql.com"],
      credentials: true,
    })
  );

  app.use("/graphql", graphqlRateLimiter);

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  const schema = await buildSchema({
    resolvers: [UserResolver, CompanyResolver, AuthResolver, DashboardResolver],
    validate: false,
    globalMiddlewares: [ExceptionFilter],
    container: Container,
    authChecker: customAuthChecker,
  });

  const server = new ApolloServer({
    schema,
    context: createContext,
    formatError,
    introspection: true,
    persistedQueries: false,
  });

  await server.start();

  server.applyMiddleware({
    app,
    cors: false,
    bodyParserConfig: {
      limit: "50mb",
    },
    path: "/graphql",
  });

  return app;
}

export default startServer;
