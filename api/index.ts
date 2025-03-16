
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

// Export handler for Vercel serverless function
export default async function handler(req, res) {
  // Special handling for /api/ai/query
  if (req.url === '/api/ai/query') {
    return app._router.handle(req, res);
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  return new Promise((resolve, reject) => {
    app(req, res);
    res.on('finish', resolve);
    res.on('error', reject);
  });
}
