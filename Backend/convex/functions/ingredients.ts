import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const getIngredientByCanonicalName = query({
  args: { canonicalName: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ingredients")
      .withSearchIndex("by_name", (q) => q.search("canonicalName", args.canonicalName))
      .unique();
  },
});

export const addIngredient = mutation({
  args: {
    inciName: v.string(),
    canonicalName: v.string(),
    function: v.string(),
    category: v.string(),
    pHRangeOptimal: v.optional(v.string()),
    irritancyScore: v.optional(v.number()),
    comedogenicScore: v.optional(v.number()),
    knownHarmfulFlag: v.optional(v.boolean()),
    generalSensitivityFlag: v.optional(v.boolean()),
    pregnancySafeFlag: v.optional(v.boolean()),
    sourceCitation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("ingredients", args);
  },
});

// Add more CRUD operations as needed
