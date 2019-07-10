import { Express } from 'express';
import index from './index';
import user from './user';

function loadRoutes(app: Express) {
  app.use('/api/user', user);
  app.use('*', index);

  return app;
}

export default loadRoutes;
