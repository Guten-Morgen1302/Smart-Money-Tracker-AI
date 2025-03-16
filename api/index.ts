
import express from 'express';
import cors from 'cors';
import { registerRoutes } from '../server/routes';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Create HTTP server and register routes
const server = await registerRoutes(app);

// Export handler for Vercel
export default function handler(req, res) {
  return app(req, res);
}
