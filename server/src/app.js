'use strict';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import router from './api/api.js';
import uploadRouter from './api/uploadRouter';

import errorHandler from './middleware/error';
import notFound from './middleware/404';

let app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(uploadRouter);
app.use(router);

app.use(notFound);
app.use(errorHandler);


let isRunning = false;

app.start = (port) => {
  if (isRunning) {
    console.log(`Server already running`);

  } else {
    app.listen(port, err => {
      if (err) { throw err; }
      isRunning = true;
      console.log(`Server running on port ${port}`);
    });
  }
};

app.stop = () => {
  app.close(() => {
    console.log(`Server has been shut down`);
    isRunning = false;
  });
};

module.exports = app;