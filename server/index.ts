// index.ts
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";  // Importing the registerRoutes function
import { setupVite, serveStatic, log } from "./vite";  // These are for Vite setup, assuming you use Vite in development

const app = express();

// CORS middleware (allows cross-origin requests for all origins)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');  // Allow requests from all origins
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');  // Allow various HTTP methods
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // Allow content-type and authorization headers
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);  // Respond to OPTIONS requests with a 200 status
  }
  next();
});

// Middleware to parse JSON bodies and URL-encoded data
app.use(express.json());  // Handles JSON payloads
app.use(express.urlencoded({ extended: false }));  // Parses URL-encoded data

// Logging middleware to log API calls with duration
app.use((req, res, next) => {
  const start = Date.now();  // Track the start time of the request
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;  // Capture the JSON response
    return originalResJson.apply(res, [bodyJson, ...args]);  // Send the response
  };

  res.on("finish", () => {
    const duration = Date.now() - start;  // Calculate request duration
    if (path.startsWith("/api")) {  // Log only API calls
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      // Ensure the log line doesn't exceed 80 characters
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);  // Log the request details
    }
  });

  next();  // Proceed to the next middleware
});

// Register API routes (this will add all the routes from routes.ts)
registerRoutes(app);

// Error handling middleware - catches any errors and sends an appropriate response
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
  throw err;  // Re-throw the error for logging purposes
});

// Setup Vite for development or static files for production
if (app.get("env") === "development") {
  setupVite(app);  // Use Vite's dev server in development
} else {
  serveStatic(app);  // Serve static files in production
}

// Start the server on port 5000
const port = 5000;
app.listen({
  port,
  host: "0.0.0.0",  // Listen on all interfaces
  reusePort: true,  // Allow port reuse
}, () => {
  log(`Server is running on port ${port}`);
});
