import {
  users,
  generatedImages,
  type User,
  type UpsertUser,
  type GeneratedImage,
  type InsertGeneratedImage,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

let dbConnection: any;
try {
  dbConnection = require("./db").db;
} catch (e) {
  console.warn("Database connection failed, using mock storage");
  dbConnection = null;
}

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Generated images operations
  createGeneratedImage(image: InsertGeneratedImage): Promise<GeneratedImage>;
  getUserImages(userId: string): Promise<GeneratedImage[]>;
  getImageById(id: string): Promise<GeneratedImage | undefined>;
  deleteImage(id: string, userId: string): Promise<void>;
}

class MockStorage implements IStorage {
  private users = new Map<string, User>();
  private images = new Map<string, GeneratedImage>();

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      id: userData.id,
      email: userData.email || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      profileImageUrl: userData.profileImageUrl || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  async createGeneratedImage(imageData: InsertGeneratedImage): Promise<GeneratedImage> {
    const id = Math.random().toString(36).substring(7);
    const image: GeneratedImage = {
      id,
      userId: imageData.userId,
      prompt: imageData.prompt,
      imageUrl: imageData.imageUrl,
      model: imageData.model,
      size: imageData.size,
      quality: imageData.quality,
      revisedPrompt: imageData.revisedPrompt || '',
      createdAt: new Date(),
    };
    this.images.set(id, image);
    return image;
  }

  async getUserImages(userId: string): Promise<GeneratedImage[]> {
    return Array.from(this.images.values())
      .filter(img => img.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getImageById(id: string): Promise<GeneratedImage | undefined> {
    return this.images.get(id);
  }

  async deleteImage(id: string, userId: string): Promise<void> {
    this.images.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  private db = dbConnection;
  private mockStorage = new MockStorage();

  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    if (!this.db) return this.mockStorage.getUser(id);
    try {
      const [user] = await this.db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (e) {
      console.warn("Database error, falling back to mock:", e);
      return this.mockStorage.getUser(id);
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    if (!this.db) return this.mockStorage.upsertUser(userData);
    try {
      const [user] = await this.db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: new Date(),
          },
        })
        .returning();
      return user;
    } catch (e) {
      console.warn("Database error, falling back to mock:", e);
      return this.mockStorage.upsertUser(userData);
    }
  }

  // Generated images operations
  async createGeneratedImage(imageData: InsertGeneratedImage): Promise<GeneratedImage> {
    if (!this.db) return this.mockStorage.createGeneratedImage(imageData);
    try {
      const [image] = await this.db
        .insert(generatedImages)
        .values(imageData)
        .returning();
      return image;
    } catch (e) {
      console.warn("Database error, falling back to mock:", e);
      return this.mockStorage.createGeneratedImage(imageData);
    }
  }

  async getUserImages(userId: string): Promise<GeneratedImage[]> {
    if (!this.db) return this.mockStorage.getUserImages(userId);
    try {
      return await this.db
        .select()
        .from(generatedImages)
        .where(eq(generatedImages.userId, userId))
        .orderBy(desc(generatedImages.createdAt));
    } catch (e) {
      console.warn("Database error, falling back to mock:", e);
      return this.mockStorage.getUserImages(userId);
    }
  }

  async getImageById(id: string): Promise<GeneratedImage | undefined> {
    if (!this.db) return this.mockStorage.getImageById(id);
    try {
      const [image] = await this.db
        .select()
        .from(generatedImages)
        .where(eq(generatedImages.id, id));
      return image;
    } catch (e) {
      console.warn("Database error, falling back to mock:", e);
      return this.mockStorage.getImageById(id);
    }
  }

  async deleteImage(id: string, userId: string): Promise<void> {
    if (!this.db) return this.mockStorage.deleteImage(id, userId);
    try {
      await this.db
        .delete(generatedImages)
        .where(eq(generatedImages.id, id));
    } catch (e) {
      console.warn("Database error, falling back to mock:", e);
      return this.mockStorage.deleteImage(id, userId);
    }
  }
}

export const storage = new DatabaseStorage();
