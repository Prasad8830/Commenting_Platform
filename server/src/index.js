import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import postRoutes from './routes/post.routes.js';
import commentRoutes from './routes/comment.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || '';
mongoose.set('bufferCommands', false);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});


if (!MONGO_URI) {
  app.use((_req, res) => {
    res.status(503).json({ error: 'Database not configured. Set MONGO_URI in server/.env' });
  });
} else {
  app.use('/api/auth', authRoutes);
  app.use('/api/post', postRoutes);
  app.use('/api/comments', commentRoutes);
  // Mount admin routes only when ADMIN_SECRET is provided to avoid accidental exposure
  if (process.env.ADMIN_SECRET) {
    app.use('/api/admin', adminRoutes);
    console.log('Admin routes enabled');
  } else {
    console.log('Admin routes disabled (set ADMIN_SECRET in server/.env to enable)');
  }
}

import Post from './models/Post.js';
import { createDemoPost } from './controllers/post.controller.js';

async function start() {
  try {
    if (MONGO_URI) {
      await mongoose.connect(MONGO_URI);
      console.log('Connected to MongoDB');
      // Ensure demo post exists
      const count = await Post.countDocuments();
      if (count === 0) {
        await createDemoPost({ body: {}, user: {} }, { json: () => {}, status: () => ({ json: () => {} }) });
        console.log('Demo post created');
      }
    }
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
