import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ingredients: defineTable({
    inciName: v.string(),
    canonicalName: v.string(),
    function: v.string(), // e.g., "Antioxidant", "Exfoliant"
    category: v.string(), // e.g., "Active", "Preservative"
    pHRangeOptimal: v.optional(v.string()), // e.g., "3.0-4.0"
    irritancyScore: v.optional(v.number()), // 0-5
    comedogenicScore: v.optional(v.number()), // 0-5
    knownHarmfulFlag: v.optional(v.boolean()),
    generalSensitivityFlag: v.optional(v.boolean()),
    pregnancySafeFlag: v.optional(v.boolean()),
    sourceCitation: v.optional(v.string()),
  }).searchIndex("by_name", {
    searchField: "canonicalName",
    filterFields: ["category", "function"],
  }),

  compatibility_matrix: defineTable({
    ingredientAId: v.id("ingredients"),
    ingredientBId: v.id("ingredients"),
    conflictType: v.string(), // e.g., "Deactivation", "High Irritation", "Stability Risk", "Synergy"
    recommendation: v.string(), // e.g., "Separate AM/PM", "Alternate Days", "Do Not Use Together"
    explanation: v.string(), // Brief explanation for the conflict/synergy
    sourceCitation: v.optional(v.string()),
  }),

  knowledge_base: defineTable({
    textChunk: v.string(),
    keywords: v.array(v.string()),
    ingredientTags: v.array(v.string()),
    sourceUrl: v.optional(v.string()),
    category: v.string(), // e.g., "Compatibility", "IngredientInfo"
  }).searchIndex("by_keywords", {
    searchField: "keywords",
    filterFields: ["category", "ingredientTags"],
  }),

  user_profiles: defineTable({
    // If you implement user auth later
    skinType: v.string(),
    sensitivities: v.array(v.string()),
    goals: v.array(v.string()),
    allergies: v.optional(v.array(v.string())),
  }),

  analysis_logs: defineTable({
    // For TiDB integration, you might log here first then push to TiDB
    userId: v.optional(v.id("user_profiles")),
    timestamp: v.number(),
    inputProducts: v.array(v.object({
      productName: v.string(),
      inciList: v.string(),
      usageTime: v.string(),
      applicationOrder: v.optional(v.number()),
    })),
    analysisResult: v.any(), // Store the full analysis output
    llmCalls: v.array(v.object({
      prompt: v.string(),
      response: v.string(),
      model: v.string(),
      timestamp: v.number(),
    })),
  }),
});
