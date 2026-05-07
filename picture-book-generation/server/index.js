import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import generateRoutes from './routes/generate.js';
import storybooksRoutes from './routes/storybooks.js';
import progressEmitter from './services/events.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SSE progress endpoint
app.get('/api/generate/events', (req, res) => {
  // Get user ID from query param (passed from frontend after auth)
  const userId = req.query.userId;
  if (!userId) {
    res.writeHead(400);
    res.end('userId required');
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const handler = (key, data) => {
    if (key === `user_${userId}`) {
      sendEvent(data);
    }
  };

  progressEmitter.on('progress', handler);

  req.on('close', () => {
    progressEmitter.off('progress', handler);
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Generation routes
app.use('/api/generate', generateRoutes);

// Storybooks routes
app.use('/api/storybooks', storybooksRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
});
