import { query } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

/**
 * Get ingredient by ID with properties
 */
export const getIngredientById = query({
  args: { ingredientId: v.id("ingredients") },
  handler: async (ctx, args) => {
    const ingredient = await ctx.db.get(args.ingredientId);
    if (!ingredient) return null;
    
    const properties = await ctx.db
      .query("ingredientProperties")
      .withIndex("by_ingredientId", (q) => 
        q.eq("ingredientId", args.ingredientId)
      )
      .first();
    
    return {
      ...ingredient,
      properties: properties || null,
    };
  },
});

/**
 * Find ingredient by name (fuzzy search)
 */
export const findIngredientByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const searchTerm = args.name.toLowerCase().trim();
    
    // First try exact INCI name match
    const exactMatch = await ctx.db
      .query("ingredients")
      .withIndex("by_inciName", (q) => q.eq("inciName", args.name))
      .first();
    
    if (exactMatch) return exactMatch;
    
    // Try search index
    const searchResults = await ctx.db
      .query("ingredients")
      .withSearchIndex("search_ingredients", (q) => 
        q.search("inciName", searchTerm)
      )
      .take(10);
    
    if (searchResults.length > 0) {
      return searchResults[0];
    }
    
    // Try common names
    const allIngredients = await ctx.db.query("ingredients").collect();
    const commonNameMatch = allIngredients.find(ing => 
      ing.commonNames.some(name => 
        name.toLowerCase().includes(searchTerm) ||
        searchTerm.includes(name.toLowerCase())
      )
    );
    
    return commonNameMatch || null;
  },
});

/**
 * Check if conflict exists between two ingredients
 */
export const checkConflictExists = query({
  args: {
    ingredientAId: v.id("ingredients"),
    ingredientBId: v.id("ingredients"),
  },
  handler: async (ctx, args) => {
    // Check both directions (A+B and B+A)
    const conflict1 = await ctx.db
      .query("compatibilityMatrix")
      .withIndex("by_pair", (q) => 
        q.eq("ingredientAId", args.ingredientAId)
         .eq("ingredientBId", args.ingredientBId)
      )
      .first();
    
    if (conflict1) return conflict1;
    
    const conflict2 = await ctx.db
      .query("compatibilityMatrix")
      .withIndex("by_pair", (q) => 
        q.eq("ingredientAId", args.ingredientBId)
         .eq("ingredientBId", args.ingredientAId)
      )
      .first();
    
    return conflict2 || null;
  },
});

/**
 * Get all conflicts for an ingredient
 */
export const getIngredientConflicts = query({
  args: { ingredientId: v.id("ingredients") },
  handler: async (ctx, args) => {
    const conflictsAsA = await ctx.db
      .query("compatibilityMatrix")
      .withIndex("by_ingredientA", (q) => 
        q.eq("ingredientAId", args.ingredientId)
      )
      .collect();
    
    const conflictsAsB = await ctx.db
      .query("compatibilityMatrix")
      .withIndex("by_ingredientB", (q) => 
        q.eq("ingredientBId", args.ingredientId)
      )
      .collect();
    
    // Fetch full ingredient details for each conflict
    const allConflicts = [...conflictsAsA, ...conflictsAsB];
    const conflictsWithDetails = await Promise.all(
      allConflicts.map(async (conflict) => {
        const otherIngredientId = 
          conflict.ingredientAId === args.ingredientId
            ? conflict.ingredientBId
            : conflict.ingredientAId;
        
        const otherIngredient = await ctx.db.get(otherIngredientId);
        const thisIngredient = await ctx.db.get(args.ingredientId);
        
        return {
          ...conflict,
          thisIngredient: thisIngredient,
          otherIngredient: otherIngredient,
        };
      })
    );
    
    return conflictsWithDetails;
  },
});

