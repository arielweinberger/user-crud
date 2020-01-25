import express, { Application } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import setupUsersModule from './user/setup';

async function initialize(): Promise<void> {
  try {
    await mongoose.connect('mongodb://localhost/crud', { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (err) {
    console.log('TODO: db conn error');
  }

  const app: Application = express();
  app.use('/static', express.static(`${__dirname}/public`));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }))
  setupUsersModule(app);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}

initialize();