import cors from 'cors';
import express from 'express';
import authRouter from './routes/auth.js';
import eventsRouter from './routes/events.js';

const app = express();

// CORS
app.use(cors());

// Body parse middleware
app.use(express.json());

//#region Routes
app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
//#endregion

// Health route
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    msg: 'API is running',
  });
});

// Unknown routes
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    msg: 'Route not found',
  });
});

export default app;
