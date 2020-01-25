import express, { Application } from 'express';
import setupUsersModule from './user/setup';

const app: Application = express();
const port = process.env.PORT || 3000;

setupUsersModule(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});