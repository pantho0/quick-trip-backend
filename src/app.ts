import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import gloalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  }),
);

app.use('/api', router);
app.get('/', (req, res) => {
  res.send('Welcome to QuickTrip Rentals 🚘🏃‍♀️');
});
//global error handler
app.use(gloalErrorHandler);

//not-found route
app.use(notFound);

export default app;
