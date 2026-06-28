import express from 'express';
import cors from 'cors';
import roomsRouter from './routes/rooms.js';
import bookingsRouter from './routes/bookings.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingsRouter);

export default app;