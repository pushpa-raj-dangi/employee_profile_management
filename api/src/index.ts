import 'reflect-metadata';

import startServer from './app';

const PORT = process.env.PORT || 4000;

startServer().then((app) => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
  });
});