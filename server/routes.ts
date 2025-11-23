// Following blueprint:javascript_log_in_with_replit and blueprint:javascript_openai
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import OpenAI from "openai";
import { z } from "zod";
import { insertGeneratedImageSchema } from "@shared/schema";

// Helper to get OpenAI client (lazy initialization)
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Image generation endpoint
  app.post('/api/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate request body
      const generateSchema = z.object({
        prompt: z.string().min(1).max(4000),
        model: z.enum(['dall-e-2', 'dall-e-3']).default('dall-e-3'),
        size: z.string().default('1024x1024'),
        quality: z.enum(['standard', 'hd']).default('standard'),
      });

      const { prompt, model, size, quality } = generateSchema.parse(req.body);

      // Get OpenAI client (lazy initialization with error handling)
      let openai: OpenAI;
      try {
        openai = getOpenAIClient();
      } catch (error) {
        return res.status(503).json({ 
          message: "OpenAI API key not configured. Please add your OPENAI_API_KEY to the secrets." 
        });
      }

      // Generate image with OpenAI
      const response = await openai.images.generate({
        model,
        prompt,
        n: 1,
        size: size as any,
        quality: model === 'dall-e-3' ? quality as any : undefined,
      });

      const imageUrl = response.data[0].url;
      const revisedPrompt = response.data[0].revised_prompt;

      if (!imageUrl) {
        throw new Error("No image URL returned from OpenAI");
      }

      // Save to database
      const imageData = insertGeneratedImageSchema.parse({
        userId,
        prompt,
        imageUrl,
        model,
        size,
        quality,
        revisedPrompt,
      });

      const savedImage = await storage.createGeneratedImage(imageData);

      res.json(savedImage);
    } catch (error: any) {
      console.error("Error generating image:", error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      
      if (error.status === 400) {
        return res.status(400).json({ message: error.message || "Invalid request to OpenAI" });
      }
      
      res.status(500).json({ message: error.message || "Failed to generate image" });
    }
  });

  // Get user's images
  app.get('/api/images', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const images = await storage.getUserImages(userId);
      res.json(images);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ message: "Failed to fetch images" });
    }
  });

  // Delete image
  app.delete('/api/images/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const imageId = req.params.id;

      // Verify ownership
      const image = await storage.getImageById(imageId);
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }
      
      if (image.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await storage.deleteImage(imageId, userId);
      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ message: "Failed to delete image" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
