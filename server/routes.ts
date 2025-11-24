// Following blueprint:javascript_log_in_with_replit and blueprint:javascript_openai
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import OpenAI from "openai";
import { z } from "zod";
import { insertGeneratedImageSchema } from "@shared/schema";
import sgMail from "@sendgrid/mail";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

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

  // Configure SendGrid if available
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

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

  // Passwordless signup - sends magic link to email
  app.post('/api/signup', async (req: any, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      });

      const { email, firstName, lastName } = schema.parse(req.body);

      // Create or upsert a user record (mock or real DB)
      const userId = `user_${nanoid()}`;
      const user = await storage.upsertUser({
        id: userId,
        email,
        firstName: firstName ?? '',
        lastName: lastName ?? '',
        profileImageUrl: '',
      } as any);

      // create signed token for magic link
      const secret = process.env.SESSION_SECRET || 'dev-secret-key';
      const token = jwt.sign({ sub: user.id, email: user.email }, secret, { expiresIn: '1h' });

      const serverUrl = process.env.SERVER_URL || `http://127.0.0.1:${process.env.PORT || '5000'}`;
      const magicLink = `${serverUrl}/api/magic?token=${encodeURIComponent(token)}`;

      // Send email
      if (process.env.SENDGRID_API_KEY && process.env.SENDER_EMAIL) {
        const msg = {
          to: email,
          from: process.env.SENDER_EMAIL,
          subject: 'Your sign-in link',
          html: `<p>Click the link below to sign in to AdvisorTrends:</p><p><a href="${magicLink}">${magicLink}</a></p>`,
        };
        await sgMail.send(msg as any);
      } else {
        console.info('Magic link (no email sent - missing SENDGRID_API_KEY/SENDER_EMAIL):', magicLink);
      }

      res.json({ message: 'Magic link sent if the email is valid' });
    } catch (err: any) {
      console.error('Signup error', err);
      res.status(400).json({ message: err?.message || 'Invalid signup request' });
    }
  });

  // Magic link endpoint - verifies token and creates a session
  app.get('/api/magic', async (req: any, res) => {
    try {
      const token = req.query.token as string | undefined;
      if (!token) return res.status(400).send('Missing token');

      const secret = process.env.SESSION_SECRET || 'dev-secret-key';
      let payload: any;
      try {
        payload = jwt.verify(token, secret) as any;
      } catch (e) {
        return res.status(400).send('Invalid or expired token');
      }

      // ensure user exists
      let user = await storage.getUser(payload.sub);
      if (!user) {
        // create minimal user record
        user = await storage.upsertUser({
          id: payload.sub,
          email: payload.email,
          firstName: '',
          lastName: '',
          profileImageUrl: '',
        } as any);
      }

      // Use passport's login to create a session
      (req as any).logIn({ claims: { sub: user.id, email: user.email }, access_token: 'magic', refresh_token: null, expires_at: Math.floor(Date.now()/1000) + 3600 } as any, (err: any) => {
        if (err) {
          console.error('Login error', err);
          return res.status(500).send('Failed to create session');
        }
        // Redirect to the app root
        res.redirect('/');
      });
    } catch (err) {
      console.error('Magic link error', err);
      res.status(500).send('Internal server error');
    }
  });

  // Seed demo data (creates a demo user and sample generated images)
  // This is safe for local testing and uses mock storage when a DB isn't configured.
  app.post('/api/seed', async (req: any, res) => {
    try {
      const demoId = 'demo-user-1';
      const demoUser = await storage.upsertUser({
        id: demoId,
        email: 'demo@local',
        firstName: 'Demo',
        lastName: 'User',
        profileImageUrl: '',
      } as any);

      const samples = [
        {
          prompt: 'A vibrant sunset over a mountain lake, ultra-detailed',
          imageUrl: 'https://placehold.co/1024x1024',
          model: 'dall-e-3',
          size: '1024x1024',
          quality: 'standard',
        },
        {
          prompt: 'Minimalist illustration of a futuristic city skyline at night',
          imageUrl: 'https://placehold.co/1024x1024',
          model: 'dall-e-3',
          size: '1024x1024',
          quality: 'hd',
        },
      ];

      const created: any[] = [];
      for (const s of samples) {
        const img = await storage.createGeneratedImage({
          userId: demoUser.id,
          prompt: s.prompt,
          imageUrl: s.imageUrl,
          model: s.model,
          size: s.size,
          quality: s.quality,
        } as any);
        created.push(img);
      }

      res.json({ message: 'seeded', user: demoUser, images: created });
    } catch (err) {
      console.error('Seed error', err);
      res.status(500).json({ message: 'Failed to seed demo data' });
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
