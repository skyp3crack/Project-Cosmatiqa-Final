import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Create or update user profile from onboarding
 */
export const createOrUpdateProfile = mutation({
  args: {
    userId: v.string(),
    skinType: v.union(
      v.literal("oily"),
      v.literal("dry"),
      v.literal("combination"),
      v.literal("normal"),
      v.literal("sensitive")
    ),
    sensitivities: v.array(v.string()),
    goals: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if profile already exists
    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    const now = Date.now();

    if (existing) {
      // Update existing profile
      await ctx.db.patch(existing._id, {
        skinType: args.skinType,
        sensitivities: args.sensitivities,
        goals: args.goals,
        updatedAt: now,
      });
      return { profileId: existing._id, isNew: false };
    }

    // Create new profile
    const profileId = await ctx.db.insert("userProfiles", {
      userId: args.userId,
      skinType: args.skinType,
      sensitivities: args.sensitivities,
      goals: args.goals,
      createdAt: now,
      updatedAt: now,
    });

    return { profileId, isNew: true };
  },
});

/**
 * Get user profile by userId
 */
export const getUserProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    return profile;
  },
});

/**
 * Get current user profile (authenticated)
 * TODO: Add Clerk authentication when integrated
 */
export const getCurrentUserProfile = query({
  handler: async (ctx) => {
    // TODO: Get userId from Clerk auth
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) return null;
    
    // For now, return null (will be implemented with Clerk)
    return null;
  },
});


