import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectToDatabase } from './config/db.js';
import issuesRouter from './routes/issues.js';
import aiRouter from './routes/ai.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Security and middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const clientOrigin = process.env.CLIENT_ORIGIN || '*';
app.use(cors({ origin: clientOrigin, credentials: true }));

app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Routes
app.use('/api/issues', issuesRouter);
app.use('/api/ai', aiRouter);

// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
  });