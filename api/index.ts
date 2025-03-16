
import express from 'express';
import cors from 'cors';
import { registerRoutes } from '../server/routes';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Register routes
registerRoutes(app);

// Export handler for Vercel
export default function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  return app(req, res);
}
