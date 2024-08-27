import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
import sequelize from './db.js';
import cookieParser from 'cookie-parser';




dotenv.config()

const app = express();


app.use(express.static('storage'))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
  origin:["http://localhost:5173"],
  credentials:true
}))


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