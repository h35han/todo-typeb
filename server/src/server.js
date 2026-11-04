import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const PORT = Number(process.env.PORT) || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo-app';

async function start() {
  await mongoose.connect(MONGODB_URI);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);

  app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Could not start server:', error.message);
  process.exit(1);
});
