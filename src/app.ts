import express from 'express';
import cors from 'cors';
import router from './app/routes';
import gloalErrorHandler from './app/middlewares/globalErrorHandler';
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1/', router);

app.get('/', (req, res) => {
  res.send('Welcome to QuickTrip Rentals 🚘🏃‍♀️');
});
//global error handler
app.use(gloalErrorHandler);

export default app;
