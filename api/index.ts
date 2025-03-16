
import express from 'express';
import cors from 'cors';
import { registerRoutes } from '../server/routes';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Register routes
registerRoutes(app);

// Export serverless handler
export default async function handler(req, res) {
  app(req, res);
}
