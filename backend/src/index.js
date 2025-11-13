import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDb, sequelize } from './db/sequelize.js';
import { health } from './routes/health.js';
import { users } from './routes/users.js';
import { errorHandler } from './middlewares/error.js';

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || true }));

// Routes
app.use('/api', health);
app.use('/api/users', users);

// Error handler (last)
app.use(errorHandler);

// **IMPORTANT: Listen on Railway's PORT or fallback to 5000 locally**
const PORT = process.env.PORT || 5000;

(async () => {
  await connectDb();
  await sequelize.sync({ alter: true }); // auto-create tables in dev
  app.listen(PORT, () => {
    console.log(`API on http://localhost:${PORT}`);
  });
})();
