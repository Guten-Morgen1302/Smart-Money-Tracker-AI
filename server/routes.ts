// routes.ts
import { Express, Request, Response } from "express";

// This function registers all the routes with the Express app
export function registerRoutes(app: Express) {
  
  // Define the GET route for /api/ai/query
  app.get('/api/ai/query', (req: Request, res: Response) => {
    // Extract the 'query' parameter from the URL
    const query = req.query.query;

    // If the 'query' parameter is missing, return a 400 Bad Request response
    if (!query) {
      return res.status(400).json({ message: "Missing query parameter" });
    }

    // Here we can add real AI processing. For now, we mock the response.
    // For example, you might call an external AI service, database, or model here.
    const aiResponse = `AI response to: ${query}`;

    // Return a structured response in the expected format
    return res.json({
      choices: [
        {
          message: { content: aiResponse },
        },
      ],
    });
  });

  // Define a generic health check route (optional, useful for checking server status)
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'Server is running smoothly' });
  });

  // Define another example route to handle post requests, could be useful for a "contact us" or other submissions
  app.post('/api/submit', (req: Request, res: Response) => {
    const { name, email, message } = req.body;

    // Validate if all required fields are provided
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Mock logic for handling the submission, like saving data or sending an email
    console.log(`New submission from ${name} (${email}): ${message}`);

    // Return a success response
    return res.status(200).json({ message: 'Submission successful!' });
  });

  // Define a route for fetching data based on an ID (this is just an example of another kind of route)
  app.get('/api/data/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    // For example, mock data retrieval by ID
    const data = {
      id,
      name: `Item #${id}`,
      description: 'This is a mock item description.',
    };

    // Send back the data as JSON
    res.json(data);
  });

  // Define a POST route that could simulate creating a new resource (e.g., adding an item)
  app.post('/api/data', (req: Request, res: Response) => {
    const { name, description } = req.body;

    // Simple validation for required fields
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    // Mock the creation of a new resource (e.g., saving to a database)
    const newData = {
      id: Math.floor(Math.random() * 1000),  // Mock generated ID
      name,
      description,
    };

    // Return the newly created resource as JSON
    res.status(201).json(newData);
  });

  // Example of a catch-all route for unsupported endpoints (404 Not Found)
  app.use((req: Request, res: Response) => {
    res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
  });

  return app;  // Return the app with all registered routes
}
