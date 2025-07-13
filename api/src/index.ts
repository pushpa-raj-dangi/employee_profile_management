import 'reflect-metadata';
import startServer from './app';
import { prisma } from "./config/prisma";

const PORT = process.env.PORT || 4000;

startServer().then((app) => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(async () => {
      await prisma.$disconnect();
      console.log('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(async () => {
      await prisma.$disconnect();
      console.log('Server closed');
      process.exit(0);
    });
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});