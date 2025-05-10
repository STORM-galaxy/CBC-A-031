import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (kept from original schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Disease categories (body systems)
export const bodySystems = pgTable("body_systems", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
});

export const insertBodySystemSchema = createInsertSchema(bodySystems).pick({
  name: true,
  description: true,
  imageUrl: true,
});

// Diseases table
export const diseases = pgTable("diseases", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bodySystemId: integer("body_system_id").notNull(),
  description: text("description").notNull(),
  causes: text("causes"),
  symptoms: text("symptoms"),
  treatments: text("treatments"),
  prevention: text("prevention"),
  imageUrl: text("image_url"),
});

export const insertDiseaseSchema = createInsertSchema(diseases).pick({
  name: true,
  bodySystemId: true,
  description: true,
  causes: true,
  symptoms: true,
  treatments: true,
  prevention: true,
  imageUrl: true,
});

// Common symptoms for symptom checker
export const symptoms = pgTable("symptoms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bodySystemId: integer("body_system_id"),
  description: text("description"),
});

export const insertSymptomSchema = createInsertSchema(symptoms).pick({
  name: true,
  bodySystemId: true,
  description: true,
});

// Chat history for AI medical assistant
export const chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  messages: jsonb("messages").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChatHistorySchema = createInsertSchema(chatHistory).pick({
  userId: true,
  messages: true,
});

// Medical news articles
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  imageUrl: text("image_url"),
  category: text("category"),
  source: text("source"),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
});

export const insertArticleSchema = createInsertSchema(articles).pick({
  title: true,
  content: true,
  summary: true,
  imageUrl: true,
  category: true,
  source: true,
});

// Medical resources (links, hospitals, etc.)
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url"),
  type: text("type").notNull(), // e.g., "hospital", "doctor", "website", "journal"
  category: text("category"), // e.g., "professional", "patient"
  location: text("location"), // For physical resources like hospitals
});

export const insertResourceSchema = createInsertSchema(resources).pick({
  title: true,
  description: true,
  url: true,
  type: true,
  category: true,
  location: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BodySystem = typeof bodySystems.$inferSelect;
export type InsertBodySystem = z.infer<typeof insertBodySystemSchema>;

export type Disease = typeof diseases.$inferSelect;
export type InsertDisease = z.infer<typeof insertDiseaseSchema>;

export type Symptom = typeof symptoms.$inferSelect;
export type InsertSymptom = z.infer<typeof insertSymptomSchema>;

export type ChatHistory = typeof chatHistory.$inferSelect;
export type InsertChatHistory = z.infer<typeof insertChatHistorySchema>;

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
