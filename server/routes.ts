import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertWalletSchema, insertTransactionSchema, insertAIInsightSchema, insertAlertSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import MemoryStore from "memorystore";
import { cryptoAgent } from './agent';

const MS_IN_24_HRS = 1000 * 60 * 60 * 24;
const MemStoreSession = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "your-strong-secret-key",
      resave: false,
      saveUninitialized: false,
      store: new MemStoreSession({
        checkPeriod: MS_IN_24_HRS
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: MS_IN_24_HRS
      }
    })
  );

  // Setup Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure Passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }

        // Compare passwords using bcrypt
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication middleware
  const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Error handling middleware for Zod validation errors
  const handleValidationError = (err: any, res: any) => {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      res.status(400).json({ message: validationError.message });
    } else {
      res.status(500).json({ message: err.message || "An error occurred" });
    }
  };

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, email } = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email
      });
      
      res.status(201).json({ message: "User created successfully" });
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    res.json({ message: "Logged in successfully" });
  });

  app.post("/api/auth/logout", (req: any, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/user", isAuthenticated, (req, res) => {
    res.json(req.user);
  });
  
  // Wallet routes
  app.get("/api/wallets/top", async (req, res) => {
    try {
      const filter = req.query.filter as string;
      const wallets = await storage.getTopWallets(filter);
      res.json(wallets);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch wallets" });
    }
  });
  
  app.get("/api/wallets/:address", async (req, res) => {
    try {
      const address = req.params.address;
      const wallet = await storage.getWalletByAddress(address);
      
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      
      res.json(wallet);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch wallet" });
    }
  });
  
  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });
  
  app.get("/api/transactions/recent", async (req, res) => {
    try {
      const transactions = await storage.getRecentTransactions();
      res.json(transactions);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch recent transactions" });
    }
  });
  
  // AI Insights routes
  app.get("/api/ai-insights/recent", async (req, res) => {
    try {
      const insights = await storage.getRecentAIInsights();
      res.json(insights);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch AI insights" });
    }
  });
  
  // Alerts routes
  app.get("/api/alerts", async (req, res) => {
    try {
      // For demo, get alerts for userId 1
      const userId = 1;
      const alerts = await storage.getAlertsByUserId(userId);
      res.json(alerts);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });
  
  app.post("/api/alerts", async (req, res) => {
    try {
      // For demo, set userId to 1
      const userId = 1;
      const alertData = insertAlertSchema.parse({
        ...req.body,
        userId
      });
      
      const alert = await storage.createAlert(alertData);
      res.status(201).json(alert);
    } catch (err) {
      handleValidationError(err, res);
    }
  });
  
  app.patch("/api/alerts/:id", async (req, res) => {
    try {
      const alertId = parseInt(req.params.id);
      
      // Check if alert exists
      const alert = await storage.getAlertById(alertId);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      
      // Update alert
      const updatedAlert = await storage.updateAlert(alertId, req.body);
      res.json(updatedAlert);
    } catch (err) {
      res.status(500).json({ message: "Failed to update alert" });
    }
  });
  
  app.delete("/api/alerts/:id", async (req, res) => {
    try {
      const alertId = parseInt(req.params.id);
      
      // Check if alert exists
      const alert = await storage.getAlertById(alertId);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      
      // Delete alert
      await storage.deleteAlert(alertId);
      res.json({ message: "Alert deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete alert" });
    }
  });
  
  // AI Agent endpoint
  app.post("/api/ai/query", express.json(), async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }
      
      // Process the query with our agent
      const result = await cryptoAgent.process({
        messages: [
          {
            role: 'user',
            content: query
          }
        ]
      }).catch(error => ({
        choices: [{
          message: {
            role: 'assistant',
            content: 'I can help you with market trends, wallet information, and transaction analysis. What would you like to know?'
          }
        }]
      }));
      
      res.json(result);
    } catch (err: any) {
      // Fallback response
      res.json({
        choices: [{
          message: {
            role: 'assistant',
            content: 'I can help you analyze cryptocurrency trends, wallet information, and market insights. How can I assist you?'
          }
        }]
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
