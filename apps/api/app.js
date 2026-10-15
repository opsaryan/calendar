import cors from 'cors';
import express from 'express';
import authRouter from './routes/auth.js';
import eventsRouter from './routes/events.js';

const app = express();

// CORS
app.use(cors());

// Public directory
app.use(express.static('public'));

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

// Public content route
app.get('*', (req, res) => {
  res.sendFile(import.meta.dirname + '/public/index.html');
});

export default app;
