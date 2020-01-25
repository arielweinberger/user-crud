import express, { Application } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import expressRequestId from 'express-request-id';

import logger from './lib/logger';
import setupUsersModule from './user/setup';

async function initialize(): Promise<void> {
  logger.info('Initializing User CRUD application...');

  try {
    await mongoose.connect('mongodb://localhost/crud', { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (error) {
    logger.error(error);
    throw new Error('Cannot connect to MongoDB database');
  }

  const app: Application = express();
  app.use(expressRequestId);
  app.use('/static', express.static(`${__dirname}/public`));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }))
  setupUsersModule(app);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`Application listening on port ${port}`);
  });
}

initialize();