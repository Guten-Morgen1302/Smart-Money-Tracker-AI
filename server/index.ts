// index.ts
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes"; // Import the registerRoutes function
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// CORS middleware (allows cross-origin requests)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register API routes
registerRoutes(app);  // This is where we define our routes

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  throw err;
});

// Setup Vite for development or static files for production
if (app.get("env") === "development") {
  setupVite(app, app.listen);
} else {
  serveStatic(app);
}

// Start the server on port 5000
const port = 5000;
app.listen({
  port,
  host: "0.0.0.0",
  reusePort: true,
}, () => {
  log(`Serving on port ${port}`);
});
