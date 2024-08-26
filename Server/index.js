import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

import sequelize from './db.js';




dotenv.config()

const app = express();

app.use(express.json());

app.use('/', authRoutes)





sequelize.sync()
.then(() => {
    console.log('Database connected successfully.');
    app.listen(5555, () => {
      console.log('Server is running on port 5555');
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });