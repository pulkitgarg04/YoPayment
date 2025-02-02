import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import userRouter from './routes/user.js';
import accountRouter from './routes/account.js';
import messageRouter from './routes/message.js';

const app = express();

console.log(process.env.FRONTEND_URL)
app.use(cors({
    origin: `${process.env.FRONTEND_URL || '*'}`,
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  try {
    mongoose.connect(`${process.env.MONGO_URI}`)
      .then(() => {
        console.log('db connected');
        app.listen(process.env.PORT || 8080, () => {
          console.log(`Server is running on port ${process.env.PORT}`);
        });
    });
  } catch (error) {
    console.log("Error while connecting to Mongo DB: ", error.message);
  }
};

startServer();

app.get('/', (req, res) => {
    res.send("Hello from PayZoid!");
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/account', accountRouter);
app.use('/api/v1/messages', messageRouter);
