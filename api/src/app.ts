import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import { buildSchema } from "type-graphql";
import Container from "typedi";
import { AuthResolver } from "./resolvers/auth.resolver";
import { CompanyResolver } from "./resolvers/company.resolver";
import { DashboardResolver } from "./resolvers/dashboard.resolver";
import { InvitationResolver } from "./resolvers/invitation.resolver";
import { ProfileResolver } from "./resolvers/profile.resolver";
import { UserResolver } from "./resolvers/user.resolver";
import { customAuthChecker } from "./utils/auth/authChecker";
import { createContext } from "./utils/context";
import { formatError } from "./utils/errorFormatter";
import { ExceptionFilter } from "./utils/exceptionFilter";
import { graphqlRateLimiter } from "./utils/rateLimiter";
import redisClient from "./utils/redisClient";
import { AdminResolver } from "./resolvers/admin.resolver";

const RedisStore = connectRedis(session);

async function startServer() {
  const app = express();

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
        prefix: "sess:",
        ttl: 86400 * 7,
      }),
      secret:
        process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        sameSite: "none",
      },
    })
  );

  const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );

  app.use("/graphql", graphqlRateLimiter);

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use((err: any, req: any, res: any, next: any) => {
    if (err.code !== "EBADCSRFTOKEN") return next(err);
    // Handle session errors
    res.status(403).send("Session expired or invalid");
  });

  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      CompanyResolver,
      AuthResolver,
      InvitationResolver,
      ProfileResolver,
      AdminResolver,
      DashboardResolver,
    ],
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
