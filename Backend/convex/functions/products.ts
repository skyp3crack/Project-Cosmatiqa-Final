import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Save user's skincare routine
 */
export const saveRoutine = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    products: v.array(
      v.object({
        name: v.string(),
        ingredientList: v.string(),
        usageTiming: v.union(v.literal("AM"), v.literal("PM"), v.literal("Both")),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Create routine
    const routineId = await ctx.db.insert("routines", {
      userId: args.userId,
      name: args.name,
      createdAt: now,
      updatedAt: now,
    });

    // Create products for this routine
    const productIds = [];
    for (const product of args.products) {
      const productId = await ctx.db.insert("products", {
        routineId,
        name: product.name,
        rawIngredientList: product.ingredientList,
        usageTiming: product.usageTiming,
        createdAt: now,
      });
      productIds.push(productId);
    }

    return { routineId, productIds };
  },
});

/**
 * Get user's routines
 */
export const getUserRoutines = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const routines = await ctx.db
      .query("routines")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    // Get products for each routine
    const routinesWithProducts = await Promise.all(
      routines.map(async (routine) => {
        const products = await ctx.db
          .query("products")
          .withIndex("by_routineId", (q) => q.eq("routineId", routine._id))
          .collect();

        return {
          ...routine,
          products,
        };
      })
    );

    return routinesWithProducts;
  },
});

/**
 * Get a specific routine with all products
 */
export const getRoutine = query({
  args: { routineId: v.id("routines") },
  handler: async (ctx, args) => {
    const routine = await ctx.db.get(args.routineId);
    if (!routine) return null;

    const products = await ctx.db
      .query("products")
      .withIndex("by_routineId", (q) => q.eq("routineId", args.routineId))
      .collect();

    return {
      ...routine,
      products,
    };
  },
});

/**
 * Delete a routine and all associated products
 */
export const deleteRoutine = mutation({
  args: { routineId: v.id("routines") },
  handler: async (ctx, args) => {
    // Delete all products in this routine
    const products = await ctx.db
      .query("products")
      .withIndex("by_routineId", (q) => q.eq("routineId", args.routineId))
      .collect();

    for (const product of products) {
      await ctx.db.delete(product._id);
    }

    // Delete the routine
    await ctx.db.delete(args.routineId);

    return { success: true };
  },
});


