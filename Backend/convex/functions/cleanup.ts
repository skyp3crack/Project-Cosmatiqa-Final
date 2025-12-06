import { mutation } from "../_generated/server";

/**
 * Delete ALL ingredients and related data
 * WARNING: This will delete all ingredients, properties, and compatibility matrix entries
 * Use this to clean up old schema data before reseeding
 */
export const deleteAllIngredients = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete all compatibility matrix entries first (they reference ingredients)
    const allConflicts = await ctx.db.query("compatibilityMatrix").collect();
    for (const conflict of allConflicts) {
      await ctx.db.delete(conflict._id);
    }

    // Delete all ingredient properties
    const allProperties = await ctx.db.query("ingredientProperties").collect();
    for (const prop of allProperties) {
      await ctx.db.delete(prop._id);
    }

    // Delete all ingredients
    const allIngredients = await ctx.db.query("ingredients").collect();
    for (const ingredient of allIngredients) {
      await ctx.db.delete(ingredient._id);
    }

    return {
      message: "All ingredients and related data deleted",
      deleted: {
        ingredients: allIngredients.length,
        properties: allProperties.length,
        conflicts: allConflicts.length,
      },
    };
  },
});

