import { action, mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";

/**
 * Generate hash for ingredient pair (for cache lookup)
 * Simple hash function (Convex doesn't have crypto module)
 */
function hashIngredientPair(ingredientAId: Id<"ingredients">, ingredientBId: Id<"ingredients">): string {
  // Sort IDs to ensure consistent hash regardless of order
  const sorted = [ingredientAId, ingredientBId].sort().join("|");
  // Simple hash: convert to string and use a basic hash
  let hash = 0;
  for (let i = 0; i < sorted.length; i++) {
    const char = sorted.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Check if cached research exists for ingredient pair
 */
export const getCachedResearch = query({
  args: {
    ingredientAId: v.id("ingredients"),
    ingredientBId: v.id("ingredients"),
  },
  handler: async (ctx, args) => {
    const pairHash = hashIngredientPair(args.ingredientAId, args.ingredientBId);
    const now = Date.now();

    const cached = await ctx.db
      .query("llmResearchCache")
      .withIndex("by_pairHash", (q) => q.eq("ingredientPairHash", pairHash))
      .first();

    if (!cached) {
      return null;
    }

    // Check if cache is expired
    if (cached.expiresAt < now) {
      // Delete expired cache
      await ctx.db.delete(cached._id);
      return null;
    }

    return {
      response: cached.claudeResponse,
      confidence: cached.confidence,
      citations: cached.citations,
      query: cached.query,
      cachedAt: cached.createdAt,
    };
  },
});

/**
 * Save research result to cache
 */
export const saveResearchToCache = mutation({
  args: {
    ingredientAId: v.id("ingredients"),
    ingredientBId: v.id("ingredients"),
    query: v.string(),
    claudeResponse: v.string(),
    confidence: v.number(),
    citations: v.array(v.string()),
    ttlDays: v.optional(v.number()), // Time to live in days (default: 30)
  },
  handler: async (ctx, args) => {
    const pairHash = hashIngredientPair(args.ingredientAId, args.ingredientBId);
    const now = Date.now();
    const ttlDays = args.ttlDays || 30;
    const expiresAt = now + ttlDays * 24 * 60 * 60 * 1000; // 30 days default

    // Check if cache already exists
    const existing = await ctx.db
      .query("llmResearchCache")
      .withIndex("by_pairHash", (q) => q.eq("ingredientPairHash", pairHash))
      .first();

    if (existing) {
      // Update existing cache
      await ctx.db.patch(existing._id, {
        query: args.query,
        claudeResponse: args.claudeResponse,
        confidence: args.confidence,
        citations: args.citations,
        expiresAt,
      });
      return { cached: true, id: existing._id, updated: true };
    }

    // Create new cache entry
    const cacheId = await ctx.db.insert("llmResearchCache", {
      ingredientPairHash: pairHash,
      query: args.query,
      claudeResponse: args.claudeResponse,
      confidence: args.confidence,
      citations: args.citations,
      createdAt: now,
      expiresAt,
    });

    return { cached: true, id: cacheId, updated: false };
  },
});

/**
 * Research ingredient pair compatibility using Claude AI
 * Checks cache first, then calls AI if needed
 */
export const researchIngredientPair = action({
  args: {
    ingredientAId: v.id("ingredients"),
    ingredientBId: v.id("ingredients"),
    userContext: v.optional(
      v.object({
        skinType: v.string(),
        sensitivities: v.array(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Step 1: Check cache first
    const cached = await ctx.runQuery(api.functions.research.getCachedResearch, {
      ingredientAId: args.ingredientAId,
      ingredientBId: args.ingredientBId,
    });

    if (cached) {
      console.log("📚 Using cached research for ingredient pair");
      return {
        cached: true,
        response: cached.response,
        confidence: cached.confidence,
        citations: cached.citations,
        query: cached.query,
      };
    }

    // Step 2: Get ingredient names
    const ingredientA = await ctx.runQuery(api.functions.helpers.getIngredientById, {
      ingredientId: args.ingredientAId,
    });
    const ingredientB = await ctx.runQuery(api.functions.helpers.getIngredientById, {
      ingredientId: args.ingredientBId,
    });

    if (!ingredientA || !ingredientB) {
      throw new Error("Ingredients not found");
    }

    // Step 3: Call Claude AI for research
    const researchResult = await ctx.runAction(api.functions.llm.researchIngredientCompatibility, {
      ingredientA: ingredientA.inciName,
      ingredientB: ingredientB.inciName,
      userContext: args.userContext,
    });

    // Step 4: Save to cache
    await ctx.runMutation(api.functions.research.saveResearchToCache, {
      ingredientAId: args.ingredientAId,
      ingredientBId: args.ingredientBId,
      query: researchResult.query,
      claudeResponse: researchResult.response,
      confidence: researchResult.confidence,
      citations: researchResult.citations || [],
    });

    console.log("💾 Saved research to cache for future use");

    return {
      cached: false,
      response: researchResult.response,
      confidence: researchResult.confidence,
      citations: researchResult.citations || [],
      query: researchResult.query,
    };
  },
});

/**
 * Get all research cache entries (for verification)
 */
export const getAllResearchCache = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("llmResearchCache").collect();
  },
});

/**
 * Clean up expired cache entries
 */
export const cleanupExpiredCache = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const allCache = await ctx.db.query("llmResearchCache").collect();

    let deleted = 0;
    for (const entry of allCache) {
      if (entry.expiresAt < now) {
        await ctx.db.delete(entry._id);
        deleted++;
      }
    }

    return { deleted, total: allCache.length };
  },
});

/**
 * Seed research cache for common ingredient pairs
 * This action will call AI to research and cache common combinations
 */
export const seedResearchCache = action({
  args: {
    ingredientPairs: v.optional(
      v.array(
        v.object({
          ingredientA: v.string(), // INCI name
          ingredientB: v.string(), // INCI name
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    // Default common pairs to research
    const defaultPairs = [
      { ingredientA: "Retinol", ingredientB: "L-Ascorbic Acid" },
      { ingredientA: "Retinol", ingredientB: "Niacinamide" },
      { ingredientA: "L-Ascorbic Acid", ingredientB: "Niacinamide" },
      { ingredientA: "Retinol", ingredientB: "Glycolic Acid" },
      { ingredientA: "Retinol", ingredientB: "Salicylic Acid" },
      { ingredientA: "L-Ascorbic Acid", ingredientB: "Copper Peptides" },
      { ingredientA: "Benzoyl Peroxide", ingredientB: "Retinol" },
      { ingredientA: "Glycolic Acid", ingredientB: "Salicylic Acid" },
      { ingredientA: "Niacinamide", ingredientB: "L-Ascorbic Acid" },
      { ingredientA: "Retinol", ingredientB: "Bakuchiol" },
    ];

    const pairsToResearch = args.ingredientPairs || defaultPairs;
    const results = [];

    for (const pair of pairsToResearch) {
      try {
        // Get ingredient IDs
        const ingA = await ctx.runQuery(api.functions.helpers.findIngredientByName, {
          name: pair.ingredientA,
        });
        const ingB = await ctx.runQuery(api.functions.helpers.findIngredientByName, {
          name: pair.ingredientB,
        });

        if (!ingA || !ingB) {
          console.log(`⚠️ Skipping ${pair.ingredientA} + ${pair.ingredientB} - ingredients not found`);
          results.push({
            pair: `${pair.ingredientA} + ${pair.ingredientB}`,
            status: "skipped",
            reason: "Ingredients not found",
          });
          continue;
        }

        // Check if already cached
        const cached = await ctx.runQuery(api.functions.research.getCachedResearch, {
          ingredientAId: ingA._id,
          ingredientBId: ingB._id,
        });

        if (cached) {
          console.log(`✅ Already cached: ${pair.ingredientA} + ${pair.ingredientB}`);
          results.push({
            pair: `${pair.ingredientA} + ${pair.ingredientB}`,
            status: "cached",
          });
          continue;
        }

        // Research the pair
        console.log(`🔬 Researching: ${pair.ingredientA} + ${pair.ingredientB}`);
        const research = await ctx.runAction(api.functions.research.researchIngredientPair, {
          ingredientAId: ingA._id,
          ingredientBId: ingB._id,
        });

        results.push({
          pair: `${pair.ingredientA} + ${pair.ingredientB}`,
          status: "researched",
          cached: research.cached,
          confidence: research.confidence,
        });
      } catch (error) {
        console.error(`❌ Failed to research ${pair.ingredientA} + ${pair.ingredientB}:`, error);
        results.push({
          pair: `${pair.ingredientA} + ${pair.ingredientB}`,
          status: "error",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      message: "Research cache seeding complete",
      results,
      total: pairsToResearch.length,
      successful: results.filter((r) => r.status === "researched" || r.status === "cached").length,
    };
  },
});

