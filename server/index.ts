import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes";

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static("dist/public"));

// Register API routes
registerRoutes(app);


if (process.env.NODE_ENV !== 'production') {
  // Development server
  app.listen(5000, '0.0.0.0', () => {
    console.log('[express] serving on port 5000');
  });
}

// Export for Vercel
export default app;
