import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import openai, { getDiseaseInformation, getMedicalNews, getIndianHealthcareProviders } from "./openai";

// For WebSocket later if needed
// import { WebSocketServer } from 'ws';

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const apiPrefix = '/api';

  // ===== Body Systems & Disease Database APIs =====
  
  // Get all body systems
  app.get(`${apiPrefix}/body-systems`, async (req: Request, res: Response) => {
    try {
      const bodySystems = await storage.getAllBodySystems();
      res.json(bodySystems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch body systems", error: String(error) });
    }
  });

  // Get body system by ID
  app.get(`${apiPrefix}/body-systems/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const bodySystem = await storage.getBodySystemById(id);
      if (!bodySystem) {
        return res.status(404).json({ message: "Body system not found" });
      }
      
      res.json(bodySystem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch body system", error: String(error) });
    }
  });

  // Get diseases by body system
  app.get(`${apiPrefix}/diseases/by-system/:systemId`, async (req: Request, res: Response) => {
    try {
      const systemId = parseInt(req.params.systemId);
      if (isNaN(systemId)) {
        return res.status(400).json({ message: "Invalid system ID format" });
      }
      
      const diseases = await storage.getDiseasesByBodySystem(systemId);
      res.json(diseases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch diseases", error: String(error) });
    }
  });

  // Get disease by ID
  app.get(`${apiPrefix}/diseases/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const disease = await storage.getDiseaseById(id);
      if (!disease) {
        return res.status(404).json({ message: "Disease not found" });
      }
      
      res.json(disease);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch disease", error: String(error) });
    }
  });

  // Search diseases
  app.get(`${apiPrefix}/diseases/search`, async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const diseases = await storage.searchDiseases(query);
      res.json(diseases);
    } catch (error) {
      res.status(500).json({ message: "Failed to search diseases", error: String(error) });
    }
  });

  // ===== Symptom Checker APIs =====

  // Get all symptoms
  app.get(`${apiPrefix}/symptoms`, async (req: Request, res: Response) => {
    try {
      const symptoms = await storage.getAllSymptoms();
      res.json(symptoms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch symptoms", error: String(error) });
    }
  });

  // Analyze symptoms
  app.post(`${apiPrefix}/symptom-check`, async (req: Request, res: Response) => {
    try {
      const symptomCheckSchema = z.object({
        symptoms: z.array(z.string()),
        userInfo: z.object({
          age: z.number().optional(),
          gender: z.string().optional(),
          medicalHistory: z.array(z.string()).optional(),
        }).optional(),
      });

      const validationResult = symptomCheckSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request format", 
          errors: validationResult.error.format()
        });
      }
      
      const { symptoms, userInfo } = validationResult.data;
      
      if (symptoms.length === 0) {
        return res.status(400).json({ message: "At least one symptom is required" });
      }
      
      const analysisResult = await openai.analyzeSymptoms(symptoms, userInfo);
      res.json(analysisResult);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze symptoms", error: String(error) });
    }
  });

  // ===== AI Medical Assistant APIs =====
  
  // Chat with AI
  app.post(`${apiPrefix}/chat`, async (req: Request, res: Response) => {
    try {
      const chatSchema = z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant", "system"]),
            content: z.string(),
          })
        ),
      });

      const validationResult = chatSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid chat message format", 
          errors: validationResult.error.format()
        });
      }
      
      const { messages } = validationResult.data;
      
      const response = await openai.getMedicalResponse(messages);
      res.json({ response });
    } catch (error) {
      res.status(500).json({ message: "Failed to get AI response", error: String(error) });
    }
  });

  // ===== Medical News APIs =====
  
  // Get latest medical news
  app.get(`${apiPrefix}/news`, async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const articles = await storage.getLatestArticles(page, limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch medical news", error: String(error) });
    }
  });

  // Get news by category
  app.get(`${apiPrefix}/news/category/:category`, async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const articles = await storage.getArticlesByCategory(category, page, limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch medical news by category", error: String(error) });
    }
  });

  // ===== Medical Resources APIs =====

  // Get resources by type
  app.get(`${apiPrefix}/resources/:type`, async (req: Request, res: Response) => {
    try {
      const type = req.params.type;
      const category = req.query.category as string;
      
      const resources = await storage.getResourcesByType(type, category);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources", error: String(error) });
    }
  });

  // Create HTTP Server
  const httpServer = createServer(app);

  // Return the server instance
  return httpServer;
}
