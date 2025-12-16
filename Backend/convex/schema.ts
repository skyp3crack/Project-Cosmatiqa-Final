import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User profiles
  userProfiles: defineTable({
    userId: v.string(), // Clerk user ID
    skinType: v.union(
      v.literal("oily"),
      v.literal("dry"),
      v.literal("combination"),
      v.literal("normal"),
      v.literal("sensitive")
    ),
    sensitivities: v.array(v.string()),
    goals: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  // Master ingredient database
  ingredients: defineTable({
    inciName: v.string(),
    commonNames: v.array(v.string()),
    function: v.string(),
    category: v.union(
      v.literal("active"),
      v.literal("base"),
      v.literal("preservative"),
      v.literal("fragrance")
    ),
    isActive: v.boolean(),
  })
    .index("by_inciName", ["inciName"])
    .searchIndex("search_ingredients", {
      searchField: "inciName",
      filterFields: ["category", "isActive"],
    }),

  // Ingredient properties
  ingredientProperties: defineTable({
    ingredientId: v.id("ingredients"),
    phRangeMin: v.optional(v.number()),
    phRangeMax: v.optional(v.number()),
    irritancyScore: v.number(), // 0-5
    comedogenicScore: v.number(), // 0-5
    isHarmful: v.boolean(),
  }).index("by_ingredientId", ["ingredientId"]),

  // Compatibility matrix (hardcoded conflicts)
  compatibilityMatrix: defineTable({
    ingredientAId: v.id("ingredients"),
    ingredientBId: v.id("ingredients"),
    conflictType: v.string(),
    severity: v.string(),
    recommendation: v.string(),
    scientificBasis: v.optional(v.string()),
  })
    .index("by_ingredientA", ["ingredientAId"])
    .index("by_ingredientB", ["ingredientBId"])
    .index("by_pair", ["ingredientAId", "ingredientBId"]),

  // User routines
  routines: defineTable({
    userId: v.string(),
    name: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  // Products in routine
  products: defineTable({
    routineId: v.id("routines"),
    productName: v.string(),
    brandName: v.optional(v.string()),
    rawInciList: v.string(), // Full ingredient list
    usageTime: v.union(
      v.literal("AM"),
      v.literal("PM"),
      v.literal("both"),
      v.literal("alternate"),
      v.literal("weekly")
    ),
    orderInRoutine: v.number(),
    createdAt: v.number(),
  }).index("by_routineId", ["routineId"]),

  // Product Ingredients (Normalized)
  productIngredients: defineTable({
    productId: v.id("products"),
    ingredientId: v.id("ingredients"),
    position: v.number(), // Position in ingredient list
    concentration: v.optional(v.number()),
  })
    .index("by_productId", ["productId"])
    .index("by_ingredientId", ["ingredientId"]),

  // Analysis Results
  analysisResults: defineTable({
    userId: v.string(),
    routineId: v.id("routines"),
    overallRiskScore: v.union(
      v.literal("safe"),
      v.literal("caution"),
      v.literal("high_risk")
    ),
    summaryScore: v.string(), // "A+", "B", "C", etc.
    conflictsFound: v.number(),
    analysisData: v.string(), // JSON stringified detailed analysis
    recommendations: v.array(v.string()),
    profileSummary: v.optional(v.string()), // Comprehensive personalized summary for Summary tab only - ALWAYS SAVED WITH FALLBACK
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_routineId", ["routineId"]),

  // Detected Conflicts
  detectedConflicts: defineTable({
    analysisId: v.id("analysisResults"),
    productAId: v.id("products"),
    productBId: v.id("products"),
    ingredientAId: v.id("ingredients"),
    ingredientBId: v.id("ingredients"),
    conflictType: v.string(),
    severity: v.string(),
    explanation: v.string(), // LLM-generated or hardcoded
    recommendation: v.string(),
    isTemporalConflict: v.boolean(), // Same AM/PM timing
  }).index("by_analysisId", ["analysisId"]),

  // LLM Research Cache
  llmResearchCache: defineTable({
    ingredientPairHash: v.string(), // Hash of ingredient pair
    query: v.string(),
    claudeResponse: v.string(),
    confidence: v.number(),
    citations: v.array(v.string()),
    createdAt: v.number(),
    expiresAt: v.number(), // Cache TTL
  }).index("by_pairHash", ["ingredientPairHash"]),
});
