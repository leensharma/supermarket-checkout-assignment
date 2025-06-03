import express, { Application } from 'express';
import { indexRouter } from '../routes/index.route';

export default async (app: Application) => {
  app.use(express.json());

  app.use('/', indexRouter);

  const port = process.env.PORT || 5050;
  app.listen(port, () => {
    console.log(`Server is started on port ${port}`);
  });

  return app;
};
