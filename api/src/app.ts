import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cors from "cors";


async function startServer() {
  const app = express();

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  const schema = await buildSchema({} as any);

  const server = new ApolloServer({
    schema,
    introspection: true,
    persistedQueries: false,
  });

  await server.start();

  server.applyMiddleware({
    app,
    cors: false,
    path: "/graphql",
  });

  return app;
}

export default startServer;
