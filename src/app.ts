import express from 'express';
import 'dotenv/config';
import App from './services/express.service';
import dbConnection from './services/database.service';
import { seedDatabase } from './seed';

const startServer = async () => {
  const app = express();
  await dbConnection();
  await App(app);
};

(async () => {
  await startServer();
  await seedDatabase();
})();
