import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";

/**
 * Comprehensive seed function that populates all tables
 * Run this once to fully populate the pika deployment
 */
export const seedEverything = action({
  args: {},
  handler: async (ctx) => {
    const results: any = {
      ingredients: null,
      compatibilityMatrix: null,
      ingredientProperties: null,
      researchCache: null,
    };

    console.log("🌱 Starting comprehensive seed...");

    // Step 1: Seed ingredients
    console.log("📦 Step 1: Seeding ingredients...");
    try {
      results.ingredients = await ctx.runMutation(api.functions.seed.seedIngredients, {});
      console.log("✅ Ingredients seeded:", results.ingredients);
    } catch (error) {
      console.error("❌ Failed to seed ingredients:", error);
      results.ingredients = { error: String(error) };
    }

    // Step 2: Seed compatibility matrix
    console.log("🔗 Step 2: Seeding compatibility matrix...");
    try {
      results.compatibilityMatrix = await ctx.runMutation(api.functions.seed.seedCompatibilityMatrix, {});
      console.log("✅ Compatibility matrix seeded:", results.compatibilityMatrix);
    } catch (error) {
      console.error("❌ Failed to seed compatibility matrix:", error);
      results.compatibilityMatrix = { error: String(error) };
    }

    // Step 3: Populate ingredient properties with AI
    console.log("🔬 Step 3: Populating ingredient properties with AI...");
    try {
      results.ingredientProperties = await ctx.runAction(api.functions.properties.populateAllProperties, {
        enhanceExisting: true,
        batchSize: 5,
      });
      console.log("✅ Ingredient properties populated:", results.ingredientProperties);
    } catch (error) {
      console.error("❌ Failed to populate properties:", error);
      results.ingredientProperties = { error: String(error) };
    }

    // Step 4: Seed research cache for common pairs
    console.log("📚 Step 4: Seeding research cache...");
    try {
      results.researchCache = await ctx.runAction(api.functions.research.seedResearchCache, {});
      console.log("✅ Research cache seeded:", results.researchCache);
    } catch (error) {
      console.error("❌ Failed to seed research cache:", error);
      results.researchCache = { error: String(error) };
    }

    // Summary
    const summary = {
      message: "Comprehensive seed complete",
      timestamp: Date.now(),
      results,
    };

    console.log("🎉 Seed complete! Summary:", summary);

    return summary;
  },
});

/**
 * Quick verification - check what's in the database
 */
export const verifySeed = action({
  args: {},
  handler: async (ctx) => {
    const stats: any = {};

    // Count ingredients
    const allIngredients = await ctx.runQuery(api.functions.helpers.getAllIngredients, {});
    stats.ingredients = allIngredients.length;

    // Count ingredient properties
    const allProperties = await ctx.runQuery(api.functions.properties.getAllIngredientProperties, {});
    stats.ingredientProperties = allProperties.length;

    // Count compatibility matrix entries
    try {
      const allConflicts = await ctx.runQuery(api.functions.helpers.getAllConflicts, {});
      stats.compatibilityMatrix = allConflicts.length;
    } catch (error) {
      stats.compatibilityMatrix = 0;
    }

    // Count research cache entries
    try {
      const allCache = await ctx.runQuery(api.functions.research.getAllResearchCache, {});
      stats.researchCache = allCache.length;
    } catch (error) {
      stats.researchCache = 0;
    }

    return {
      message: "Database verification",
      stats,
      timestamp: Date.now(),
    };
  },
});

