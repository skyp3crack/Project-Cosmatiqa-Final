import { mutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Seed initial ingredient data and compatibility matrix
 * Run this once to populate the database
 */
export const seedIngredients = mutation({
  args: {},
  handler: async (ctx) => {
    const ingredients = [
      // Retinoids
      {
        inciName: "Retinol",
        commonNames: ["Vitamin A", "Retinyl Palmitate"],
        function: "Anti-aging, cell turnover",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Retinyl Palmitate",
        commonNames: ["Vitamin A Palmitate"],
        function: "Anti-aging, cell turnover",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Tretinoin",
        commonNames: ["Retin-A", "All-trans Retinoic Acid"],
        function: "Prescription anti-aging, acne treatment",
        category: "active" as const,
        isActive: true,
      },
      
      // Vitamin C
      {
        inciName: "L-Ascorbic Acid",
        commonNames: ["Vitamin C", "Ascorbic Acid", "AA"],
        function: "Antioxidant, brightening",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Magnesium Ascorbyl Phosphate",
        commonNames: ["MAP", "Vitamin C derivative"],
        function: "Antioxidant, brightening",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Sodium Ascorbyl Phosphate",
        commonNames: ["SAP", "Vitamin C derivative"],
        function: "Antioxidant, brightening",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Tetrahexyldecyl Ascorbate",
        commonNames: ["THD Ascorbate", "Vitamin C Ester"],
        function: "Antioxidant, brightening",
        category: "active" as const,
        isActive: true,
      },
      
      // AHAs
      {
        inciName: "Glycolic Acid",
        commonNames: ["AHA", "Alpha Hydroxy Acid"],
        function: "Exfoliant, brightening",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Lactic Acid",
        commonNames: ["AHA", "Alpha Hydroxy Acid"],
        function: "Exfoliant, hydrating",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Mandelic Acid",
        commonNames: ["AHA", "Alpha Hydroxy Acid"],
        function: "Exfoliant, gentle",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Citric Acid",
        commonNames: ["AHA", "Alpha Hydroxy Acid"],
        function: "Exfoliant, pH adjuster",
        category: "active" as const,
        isActive: true,
      },
      
      // BHAs
      {
        inciName: "Salicylic Acid",
        commonNames: ["BHA", "Beta Hydroxy Acid"],
        function: "Exfoliant, acne treatment",
        category: "active" as const,
        isActive: true,
      },
      
      // Niacinamide
      {
        inciName: "Niacinamide",
        commonNames: ["Niacin", "Vitamin B3", "Nicotinamide"],
        function: "Anti-inflammatory, barrier repair",
        category: "active" as const,
        isActive: true,
      },
      
      // Peptides
      {
        inciName: "Copper Peptides",
        commonNames: ["GHK-Cu", "Copper Tripeptide-1"],
        function: "Anti-aging, wound healing",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Palmitoyl Tripeptide-1",
        commonNames: ["Peptides", "Matrixyl 3000"],
        function: "Anti-aging, collagen support",
        category: "active" as const,
        isActive: true,
      },
      
      // Benzoyl Peroxide
      {
        inciName: "Benzoyl Peroxide",
        commonNames: ["BPO", "Benzoyl Peroxide"],
        function: "Acne treatment, antibacterial",
        category: "active" as const,
        isActive: true,
      },
      
      // Azelaic Acid
      {
        inciName: "Azelaic Acid",
        commonNames: ["Azelaic Acid"],
        function: "Acne treatment, brightening",
        category: "active" as const,
        isActive: true,
      },
      
      // Hyaluronic Acid
      {
        inciName: "Hyaluronic Acid",
        commonNames: ["HA", "Sodium Hyaluronate"],
        function: "Hydration, plumping",
        category: "base" as const,
        isActive: false,
      },
      
      // Ceramides
      {
        inciName: "Ceramides",
        commonNames: ["Ceramide NP", "Ceramide AP"],
        function: "Barrier repair, hydration",
        category: "base" as const,
        isActive: false,
      },
      
      // Additional common ingredients
      {
        inciName: "Niacin",
        commonNames: ["Vitamin B3"],
        function: "Anti-inflammatory, barrier repair",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Alpha Arbutin",
        commonNames: ["Arbutin"],
        function: "Brightening, hyperpigmentation",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Kojic Acid",
        commonNames: ["Kojic Acid"],
        function: "Brightening, hyperpigmentation",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Tranexamic Acid",
        commonNames: ["TXA"],
        function: "Brightening, hyperpigmentation",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Adapalene",
        commonNames: ["Differin"],
        function: "Prescription retinoid, acne treatment",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Tazarotene",
        commonNames: ["Tazorac"],
        function: "Prescription retinoid, anti-aging",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Bakuchiol",
        commonNames: ["Natural Retinol Alternative"],
        function: "Anti-aging, plant-based retinol alternative",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Resveratrol",
        commonNames: ["Resveratrol"],
        function: "Antioxidant, anti-aging",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Ferulic Acid",
        commonNames: ["Ferulic Acid"],
        function: "Antioxidant, stabilizes Vitamin C",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Vitamin E",
        commonNames: ["Tocopherol", "Alpha Tocopherol"],
        function: "Antioxidant, moisturizing",
        category: "active" as const,
        isActive: true,
      },
    ];

    // Insert ingredients and store their IDs
    const ingredientIds: Record<string, any> = {};
    let inserted = 0;
    let skipped = 0;
    
    for (const ingredient of ingredients) {
      const existing = await ctx.db
        .query("ingredients")
        .withIndex("by_inciName", (q) => q.eq("inciName", ingredient.inciName))
        .first();
      
      if (!existing) {
        const id = await ctx.db.insert("ingredients", ingredient);
        ingredientIds[ingredient.inciName] = id;
        inserted++;
        
        // Add ingredient properties
        const properties: Record<string, any> = {
          ingredientId: id,
          irritancyScore: 0,
          comedogenicScore: 0,
          isHarmful: false,
        };

        // Set specific properties based on ingredient
        if (ingredient.inciName === "Retinol" || ingredient.inciName === "Tretinoin" || ingredient.inciName === "Adapalene" || ingredient.inciName === "Tazarotene") {
          properties.irritancyScore = 3;
          properties.comedogenicScore = 0;
          properties.phRangeMin = 5.5;
          properties.phRangeMax = 6.5;
        } else if (ingredient.inciName === "L-Ascorbic Acid") {
          properties.irritancyScore = 2;
          properties.comedogenicScore = 0;
          properties.phRangeMin = 2.5;
          properties.phRangeMax = 3.5;
        } else if (ingredient.inciName.includes("Acid") && ingredient.inciName !== "Hyaluronic Acid") {
          properties.irritancyScore = 2;
          properties.comedogenicScore = 0;
          properties.phRangeMin = 3.0;
          properties.phRangeMax = 4.0;
        } else if (ingredient.inciName === "Benzoyl Peroxide") {
          properties.irritancyScore = 4;
          properties.comedogenicScore = 0;
        } else if (ingredient.inciName === "Niacinamide" || ingredient.inciName === "Niacin") {
          properties.irritancyScore = 0;
          properties.comedogenicScore = 0;
          properties.phRangeMin = 5.0;
          properties.phRangeMax = 7.0;
        } else if (ingredient.inciName === "Bakuchiol") {
          properties.irritancyScore = 0;
          properties.comedogenicScore = 0;
          properties.phRangeMin = 5.0;
          properties.phRangeMax = 6.5;
        }

        await ctx.db.insert("ingredientProperties", properties);
      } else {
        ingredientIds[ingredient.inciName] = existing._id;
        skipped++;
      }
    }

    return { 
      message: "Ingredients seeded successfully", 
      inserted,
      skipped,
      total: ingredients.length 
    };
  },
});

/**
 * Seed compatibility matrix with known conflicts
 */
export const seedCompatibilityMatrix = mutation({
  args: {},
  handler: async (ctx) => {
    // Get ingredient IDs
    const getIngredientId = async (inciName: string) => {
      const ingredient = await ctx.db
        .query("ingredients")
        .withIndex("by_inciName", (q) => q.eq("inciName", inciName))
        .first();
      return ingredient?._id;
    };

    const conflicts = [
      {
        ingredientA: "Retinol",
        ingredientB: "L-Ascorbic Acid",
        conflictType: "pH Conflict, Stability Risk",
        severity: "severe",
        recommendation: "Use separately - Retinol at night, Vitamin C in morning. Wait 30 minutes between applications.",
        scientificBasis: "Retinol works best at pH 5.5-6.5, while L-Ascorbic Acid requires pH 2.5-3.5. Using together can deactivate both ingredients.",
      },
      {
        ingredientA: "Retinol",
        ingredientB: "Glycolic Acid",
        conflictType: "High Irritation",
        severity: "severe",
        recommendation: "Do not use together. Alternate nights or use on different days.",
        scientificBasis: "Both are strong exfoliants that can cause excessive irritation and barrier damage when combined.",
      },
      {
        ingredientA: "Retinol",
        ingredientB: "Salicylic Acid",
        conflictType: "High Irritation",
        severity: "severe",
        recommendation: "Do not use together. Alternate nights or use on different days.",
        scientificBasis: "Combining retinoids with BHA can cause severe irritation and compromise skin barrier.",
      },
      {
        ingredientA: "Retinol",
        ingredientB: "Benzoyl Peroxide",
        conflictType: "Deactivation",
        severity: "critical",
        recommendation: "Never use together. Benzoyl Peroxide deactivates Retinol completely.",
        scientificBasis: "Benzoyl Peroxide oxidizes and deactivates Retinol, making both ingredients ineffective.",
      },
      {
        ingredientA: "L-Ascorbic Acid",
        ingredientB: "Copper Peptides",
        conflictType: "Deactivation",
        severity: "moderate",
        recommendation: "Use separately - Vitamin C in morning, Copper Peptides at night.",
        scientificBasis: "Vitamin C can oxidize copper peptides, reducing their effectiveness.",
      },
      {
        ingredientA: "Niacinamide",
        ingredientB: "L-Ascorbic Acid",
        conflictType: "Stability Risk",
        severity: "low",
        recommendation: "Can be used together if pH is balanced, but separating AM/PM is safer.",
        scientificBasis: "Older research suggested conflict, but modern formulations can work together. Separating is still recommended for optimal results.",
      },
      {
        ingredientA: "Glycolic Acid",
        ingredientB: "Salicylic Acid",
        conflictType: "High Irritation",
        severity: "moderate",
        recommendation: "Use on alternate days or in different routines. Both are strong exfoliants.",
        scientificBasis: "Combining AHA and BHA can cause excessive exfoliation and irritation.",
      },
      {
        ingredientA: "Tretinoin",
        ingredientB: "Benzoyl Peroxide",
        conflictType: "Deactivation",
        severity: "critical",
        recommendation: "Never use together. Consult dermatologist for alternative acne treatment.",
        scientificBasis: "Benzoyl Peroxide completely deactivates Tretinoin, making prescription treatment ineffective.",
      },
      {
        ingredientA: "Adapalene",
        ingredientB: "Benzoyl Peroxide",
        conflictType: "Deactivation",
        severity: "critical",
        recommendation: "Never use together. Some formulations combine them, but consult dermatologist first.",
        scientificBasis: "Benzoyl Peroxide can deactivate Adapalene, though some prescription combinations exist.",
      },
      {
        ingredientA: "Retinol",
        ingredientB: "Lactic Acid",
        conflictType: "High Irritation",
        severity: "moderate",
        recommendation: "Use on alternate days. Lactic acid is gentler than glycolic but still risky with retinol.",
        scientificBasis: "Combining retinol with AHA can cause irritation, though lactic acid is less harsh than glycolic.",
      },
      {
        ingredientA: "Glycolic Acid",
        ingredientB: "L-Ascorbic Acid",
        conflictType: "pH Conflict",
        severity: "moderate",
        recommendation: "Use separately - AHA at night, Vitamin C in morning. Both need low pH.",
        scientificBasis: "Both require low pH (3.0-4.0), but using together can be too harsh and reduce effectiveness.",
      },
      {
        ingredientA: "Salicylic Acid",
        ingredientB: "Benzoyl Peroxide",
        conflictType: "High Irritation",
        severity: "moderate",
        recommendation: "Use on alternate days or in different routines. Both are strong acne treatments.",
        scientificBasis: "Combining two strong acne treatments can cause excessive dryness and irritation.",
      },
      {
        ingredientA: "Tretinoin",
        ingredientB: "Salicylic Acid",
        conflictType: "High Irritation",
        severity: "severe",
        recommendation: "Do not use together. Alternate nights or use on different days.",
        scientificBasis: "Prescription retinoids combined with BHA can cause severe irritation and barrier damage.",
      },
      {
        ingredientA: "Tretinoin",
        ingredientB: "Glycolic Acid",
        conflictType: "High Irritation",
        severity: "severe",
        recommendation: "Do not use together. Alternate nights or use on different days.",
        scientificBasis: "Prescription retinoids combined with AHA can cause severe irritation and barrier damage.",
      },
      {
        ingredientA: "Azelaic Acid",
        ingredientB: "L-Ascorbic Acid",
        conflictType: "pH Conflict",
        severity: "low",
        recommendation: "Can be used together if pH is balanced, but separating is safer.",
        scientificBasis: "Both work at low pH, but combining may reduce effectiveness. Separating is recommended.",
      },
      {
        ingredientA: "Retinol",
        ingredientB: "Mandelic Acid",
        conflictType: "High Irritation",
        severity: "low",
        recommendation: "Use on alternate days. Mandelic acid is gentler but still risky with retinol.",
        scientificBasis: "Mandelic acid is the gentlest AHA, but combining with retinol can still cause irritation.",
      },
      {
        ingredientA: "Niacinamide",
        ingredientB: "Glycolic Acid",
        conflictType: "pH Conflict",
        severity: "low",
        recommendation: "Can be used together if pH is balanced. Niacinamide buffers AHA irritation.",
        scientificBasis: "Niacinamide works at neutral pH while AHA needs low pH, but modern formulations can work together.",
      },
      {
        ingredientA: "Niacinamide",
        ingredientB: "Salicylic Acid",
        conflictType: "pH Conflict",
        severity: "low",
        recommendation: "Can be used together if pH is balanced. Niacinamide buffers BHA irritation.",
        scientificBasis: "Niacinamide works at neutral pH while BHA needs low pH, but modern formulations can work together.",
      },
      {
        ingredientA: "Alpha Arbutin",
        ingredientB: "L-Ascorbic Acid",
        conflictType: "Synergy",
        severity: "low",
        recommendation: "Can be used together. They work synergistically for brightening.",
        scientificBasis: "Both are brightening agents that can work together effectively.",
      },
      {
        ingredientA: "Ferulic Acid",
        ingredientB: "L-Ascorbic Acid",
        conflictType: "Synergy",
        severity: "low",
        recommendation: "Can be used together. Ferulic acid stabilizes Vitamin C.",
        scientificBasis: "Ferulic acid stabilizes and enhances the effectiveness of L-Ascorbic Acid.",
      },
      {
        ingredientA: "Vitamin E",
        ingredientB: "L-Ascorbic Acid",
        conflictType: "Synergy",
        severity: "low",
        recommendation: "Can be used together. Vitamin E enhances Vitamin C effectiveness.",
        scientificBasis: "Vitamin E works synergistically with Vitamin C to enhance antioxidant protection.",
      },
    ];

    let added = 0;
    let skipped = 0;

    for (const conflict of conflicts) {
      const idA = await getIngredientId(conflict.ingredientA);
      const idB = await getIngredientId(conflict.ingredientB);

      if (!idA || !idB) {
        console.warn(`Skipping conflict: ${conflict.ingredientA} + ${conflict.ingredientB} (ingredients not found)`);
        skipped++;
        continue;
      }

      // Check if conflict already exists (both directions)
      const existing1 = await ctx.db
        .query("compatibilityMatrix")
        .withIndex("by_pair", (q) => 
          q.eq("ingredientAId", idA).eq("ingredientBId", idB)
        )
        .first();

      const existing2 = await ctx.db
        .query("compatibilityMatrix")
        .withIndex("by_pair", (q) => 
          q.eq("ingredientAId", idB).eq("ingredientBId", idA)
        )
        .first();

      if (!existing1 && !existing2) {
        await ctx.db.insert("compatibilityMatrix", {
          ingredientAId: idA,
          ingredientBId: idB,
          conflictType: conflict.conflictType,
          severity: conflict.severity,
          recommendation: conflict.recommendation,
          scientificBasis: conflict.scientificBasis,
        });
        added++;
      } else {
        skipped++;
      }
    }

    return { 
      message: "Compatibility matrix seeded", 
      added, 
      skipped,
      total: conflicts.length 
    };
  },
});

/**
 * Clean up old schema data (removes ingredients with old schema fields)
 * Run this if you have old data that doesn't match the new schema
 */
export const cleanupOldData = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all ingredients
    const allIngredients = await ctx.db.query("ingredients").collect();
    let deleted = 0;
    
    for (const ingredient of allIngredients) {
      // Check if it has old schema fields (canonicalName, etc.)
      if ("canonicalName" in ingredient || "pHRangeOptimal" in ingredient) {
        // Delete associated properties first
        const properties = await ctx.db
          .query("ingredientProperties")
          .withIndex("by_ingredientId", (q) => q.eq("ingredientId", ingredient._id))
          .collect();
        
        for (const prop of properties) {
          await ctx.db.delete(prop._id);
        }
        
        // Delete ingredient
        await ctx.db.delete(ingredient._id);
        deleted++;
      }
    }
    
    return { message: `Cleaned up ${deleted} old ingredient records` };
  },
});

/**
 * Run both seed functions
 */
export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // Seed ingredients first
    const allIngredients = await ctx.db.query("ingredients").collect();
    let inserted = 0;
    let skipped = 0;
    
    const ingredients = [
      // Retinoids
      {
        inciName: "Retinol",
        commonNames: ["Vitamin A", "Retinyl Palmitate"],
        function: "Anti-aging, cell turnover",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Retinyl Palmitate",
        commonNames: ["Vitamin A Palmitate"],
        function: "Anti-aging, cell turnover",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Tretinoin",
        commonNames: ["Retin-A", "All-trans Retinoic Acid"],
        function: "Prescription anti-aging, acne treatment",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "L-Ascorbic Acid",
        commonNames: ["Vitamin C", "Ascorbic Acid", "AA"],
        function: "Antioxidant, brightening",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Magnesium Ascorbyl Phosphate",
        commonNames: ["MAP", "Vitamin C derivative"],
        function: "Antioxidant, brightening",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Sodium Ascorbyl Phosphate",
        commonNames: ["SAP", "Vitamin C derivative"],
        function: "Antioxidant, brightening",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Tetrahexyldecyl Ascorbate",
        commonNames: ["THD Ascorbate", "Vitamin C Ester"],
        function: "Antioxidant, brightening",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Glycolic Acid",
        commonNames: ["AHA", "Alpha Hydroxy Acid"],
        function: "Exfoliant, brightening",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Lactic Acid",
        commonNames: ["AHA", "Alpha Hydroxy Acid"],
        function: "Exfoliant, hydrating",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Mandelic Acid",
        commonNames: ["AHA", "Alpha Hydroxy Acid"],
        function: "Exfoliant, gentle",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Citric Acid",
        commonNames: ["AHA", "Alpha Hydroxy Acid"],
        function: "Exfoliant, pH adjuster",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Salicylic Acid",
        commonNames: ["BHA", "Beta Hydroxy Acid"],
        function: "Exfoliant, acne treatment",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Niacinamide",
        commonNames: ["Niacin", "Vitamin B3", "Nicotinamide"],
        function: "Anti-inflammatory, barrier repair",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Copper Peptides",
        commonNames: ["GHK-Cu", "Copper Tripeptide-1"],
        function: "Anti-aging, wound healing",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Palmitoyl Tripeptide-1",
        commonNames: ["Peptides", "Matrixyl 3000"],
        function: "Anti-aging, collagen support",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Benzoyl Peroxide",
        commonNames: ["BPO", "Benzoyl Peroxide"],
        function: "Acne treatment, antibacterial",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Azelaic Acid",
        commonNames: ["Azelaic Acid"],
        function: "Acne treatment, brightening",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Hyaluronic Acid",
        commonNames: ["HA", "Sodium Hyaluronate"],
        function: "Hydration, plumping",
        category: "base" as const,
        isActive: false,
      },
      {
        inciName: "Ceramides",
        commonNames: ["Ceramide NP", "Ceramide AP"],
        function: "Barrier repair, hydration",
        category: "base" as const,
        isActive: false,
      },
      {
        inciName: "Niacin",
        commonNames: ["Vitamin B3"],
        function: "Anti-inflammatory, barrier repair",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Alpha Arbutin",
        commonNames: ["Arbutin"],
        function: "Brightening, hyperpigmentation",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Kojic Acid",
        commonNames: ["Kojic Acid"],
        function: "Brightening, hyperpigmentation",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Tranexamic Acid",
        commonNames: ["TXA"],
        function: "Brightening, hyperpigmentation",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Adapalene",
        commonNames: ["Differin"],
        function: "Prescription retinoid, acne treatment",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Tazarotene",
        commonNames: ["Tazorac"],
        function: "Prescription retinoid, anti-aging",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Bakuchiol",
        commonNames: ["Natural Retinol Alternative"],
        function: "Anti-aging, plant-based retinol alternative",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Resveratrol",
        commonNames: ["Resveratrol"],
        function: "Antioxidant, anti-aging",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Ferulic Acid",
        commonNames: ["Ferulic Acid"],
        function: "Antioxidant, stabilizes Vitamin C",
        category: "active" as const,
        isActive: true,
      },
      {
        inciName: "Vitamin E",
        commonNames: ["Tocopherol", "Alpha Tocopherol"],
        function: "Antioxidant, moisturizing",
        category: "active" as const,
        isActive: true,
      },
    ];

    const ingredientIds: Record<string, any> = {};
    
    for (const ingredient of ingredients) {
      const existing = await ctx.db
        .query("ingredients")
        .withIndex("by_inciName", (q) => q.eq("inciName", ingredient.inciName))
        .first();
      
      if (!existing) {
        const id = await ctx.db.insert("ingredients", ingredient);
        ingredientIds[ingredient.inciName] = id;
        inserted++;
        
        const properties: Record<string, any> = {
          ingredientId: id,
          irritancyScore: 0,
          comedogenicScore: 0,
          isHarmful: false,
        };

        if (ingredient.inciName === "Retinol" || ingredient.inciName === "Tretinoin" || ingredient.inciName === "Adapalene" || ingredient.inciName === "Tazarotene") {
          properties.irritancyScore = 3;
          properties.comedogenicScore = 0;
          properties.phRangeMin = 5.5;
          properties.phRangeMax = 6.5;
        } else if (ingredient.inciName === "L-Ascorbic Acid") {
          properties.irritancyScore = 2;
          properties.comedogenicScore = 0;
          properties.phRangeMin = 2.5;
          properties.phRangeMax = 3.5;
        } else if (ingredient.inciName.includes("Acid") && ingredient.inciName !== "Hyaluronic Acid") {
          properties.irritancyScore = 2;
          properties.comedogenicScore = 0;
          properties.phRangeMin = 3.0;
          properties.phRangeMax = 4.0;
        } else if (ingredient.inciName === "Benzoyl Peroxide") {
          properties.irritancyScore = 4;
          properties.comedogenicScore = 0;
        } else if (ingredient.inciName === "Niacinamide" || ingredient.inciName === "Niacin") {
          properties.irritancyScore = 0;
          properties.comedogenicScore = 0;
          properties.phRangeMin = 5.0;
          properties.phRangeMax = 7.0;
        } else if (ingredient.inciName === "Bakuchiol") {
          properties.irritancyScore = 0;
          properties.comedogenicScore = 0;
          properties.phRangeMin = 5.0;
          properties.phRangeMax = 6.5;
        }

        await ctx.db.insert("ingredientProperties", properties);
      } else {
        ingredientIds[ingredient.inciName] = existing._id;
        skipped++;
      }
    }

    // Now seed compatibility matrix
    const getIngredientId = async (inciName: string) => {
      const ingredient = await ctx.db
        .query("ingredients")
        .withIndex("by_inciName", (q) => q.eq("inciName", inciName))
        .first();
      return ingredient?._id;
    };

    const conflicts = [
      {
        ingredientA: "Retinol",
        ingredientB: "L-Ascorbic Acid",
        conflictType: "pH Conflict, Stability Risk",
        severity: "severe",
        recommendation: "Use separately - Retinol at night, Vitamin C in morning. Wait 30 minutes between applications.",
        scientificBasis: "Retinol works best at pH 5.5-6.5, while L-Ascorbic Acid requires pH 2.5-3.5. Using together can deactivate both ingredients.",
      },
      {
        ingredientA: "Retinol",
        ingredientB: "Glycolic Acid",
        conflictType: "High Irritation",
        severity: "severe",
        recommendation: "Do not use together. Alternate nights or use on different days.",
        scientificBasis: "Both are strong exfoliants that can cause excessive irritation and barrier damage when combined.",
      },
      {
        ingredientA: "Retinol",
        ingredientB: "Salicylic Acid",
        conflictType: "High Irritation",
        severity: "severe",
        recommendation: "Do not use together. Alternate nights or use on different days.",
        scientificBasis: "Combining retinoids with BHA can cause severe irritation and compromise skin barrier.",
      },
      {
        ingredientA: "Retinol",
        ingredientB: "Benzoyl Peroxide",
        conflictType: "Deactivation",
        severity: "critical",
        recommendation: "Never use together. Benzoyl Peroxide deactivates Retinol completely.",
        scientificBasis: "Benzoyl Peroxide oxidizes and deactivates Retinol, making both ingredients ineffective.",
      },
      {
        ingredientA: "L-Ascorbic Acid",
        ingredientB: "Copper Peptides",
        conflictType: "Deactivation",
        severity: "moderate",
        recommendation: "Use separately - Vitamin C in morning, Copper Peptides at night.",
        scientificBasis: "Vitamin C can oxidize copper peptides, reducing their effectiveness.",
      },
      {
        ingredientA: "Niacinamide",
        ingredientB: "L-Ascorbic Acid",
        conflictType: "Stability Risk",
        severity: "low",
        recommendation: "Can be used together if pH is balanced, but separating AM/PM is safer.",
        scientificBasis: "Older research suggested conflict, but modern formulations can work together. Separating is still recommended for optimal results.",
      },
      {
        ingredientA: "Glycolic Acid",
        ingredientB: "Salicylic Acid",
        conflictType: "High Irritation",
        severity: "moderate",
        recommendation: "Use on alternate days or in different routines. Both are strong exfoliants.",
        scientificBasis: "Combining AHA and BHA can cause excessive exfoliation and irritation.",
      },
      {
        ingredientA: "Tretinoin",
        ingredientB: "Benzoyl Peroxide",
        conflictType: "Deactivation",
        severity: "critical",
        recommendation: "Never use together. Consult dermatologist for alternative acne treatment.",
        scientificBasis: "Benzoyl Peroxide completely deactivates Tretinoin, making prescription treatment ineffective.",
      },
      {
        ingredientA: "Adapalene",
        ingredientB: "Benzoyl Peroxide",
        conflictType: "Deactivation",
        severity: "critical",
        recommendation: "Never use together. Some formulations combine them, but consult dermatologist first.",
        scientificBasis: "Benzoyl Peroxide can deactivate Adapalene, though some prescription combinations exist.",
      },
      {
        ingredientA: "Retinol",
        ingredientB: "Lactic Acid",
        conflictType: "High Irritation",
        severity: "moderate",
        recommendation: "Use on alternate days. Lactic acid is gentler than glycolic but still risky with retinol.",
        scientificBasis: "Combining retinol with AHA can cause irritation, though lactic acid is less harsh than glycolic.",
      },
      {
        ingredientA: "Glycolic Acid",
        ingredientB: "L-Ascorbic Acid",
        conflictType: "pH Conflict",
        severity: "moderate",
        recommendation: "Use separately - AHA at night, Vitamin C in morning. Both need low pH.",
        scientificBasis: "Both require low pH (3.0-4.0), but using together can be too harsh and reduce effectiveness.",
      },
      {
        ingredientA: "Salicylic Acid",
        ingredientB: "Benzoyl Peroxide",
        conflictType: "High Irritation",
        severity: "moderate",
        recommendation: "Use on alternate days or in different routines. Both are strong acne treatments.",
        scientificBasis: "Combining two strong acne treatments can cause excessive dryness and irritation.",
      },
      {
        ingredientA: "Tretinoin",
        ingredientB: "Salicylic Acid",
        conflictType: "High Irritation",
        severity: "severe",
        recommendation: "Do not use together. Alternate nights or use on different days.",
        scientificBasis: "Prescription retinoids combined with BHA can cause severe irritation and barrier damage.",
      },
      {
        ingredientA: "Tretinoin",
        ingredientB: "Glycolic Acid",
        conflictType: "High Irritation",
        severity: "severe",
        recommendation: "Do not use together. Alternate nights or use on different days.",
        scientificBasis: "Prescription retinoids combined with AHA can cause severe irritation and barrier damage.",
      },
      {
        ingredientA: "Azelaic Acid",
        ingredientB: "L-Ascorbic Acid",
        conflictType: "pH Conflict",
        severity: "low",
        recommendation: "Can be used together if pH is balanced, but separating is safer.",
        scientificBasis: "Both work at low pH, but combining may reduce effectiveness. Separating is recommended.",
      },
      {
        ingredientA: "Retinol",
        ingredientB: "Mandelic Acid",
        conflictType: "High Irritation",
        severity: "low",
        recommendation: "Use on alternate days. Mandelic acid is gentler but still risky with retinol.",
        scientificBasis: "Mandelic acid is the gentlest AHA, but combining with retinol can still cause irritation.",
      },
      {
        ingredientA: "Niacinamide",
        ingredientB: "Glycolic Acid",
        conflictType: "pH Conflict",
        severity: "low",
        recommendation: "Can be used together if pH is balanced. Niacinamide buffers AHA irritation.",
        scientificBasis: "Niacinamide works at neutral pH while AHA needs low pH, but modern formulations can work together.",
      },
      {
        ingredientA: "Niacinamide",
        ingredientB: "Salicylic Acid",
        conflictType: "pH Conflict",
        severity: "low",
        recommendation: "Can be used together if pH is balanced. Niacinamide buffers BHA irritation.",
        scientificBasis: "Niacinamide works at neutral pH while BHA needs low pH, but modern formulations can work together.",
      },
      {
        ingredientA: "Alpha Arbutin",
        ingredientB: "L-Ascorbic Acid",
        conflictType: "Synergy",
        severity: "low",
        recommendation: "Can be used together. They work synergistically for brightening.",
        scientificBasis: "Both are brightening agents that can work together effectively.",
      },
      {
        ingredientA: "Ferulic Acid",
        ingredientB: "L-Ascorbic Acid",
        conflictType: "Synergy",
        severity: "low",
        recommendation: "Can be used together. Ferulic acid stabilizes Vitamin C.",
        scientificBasis: "Ferulic acid stabilizes and enhances the effectiveness of L-Ascorbic Acid.",
      },
      {
        ingredientA: "Vitamin E",
        ingredientB: "L-Ascorbic Acid",
        conflictType: "Synergy",
        severity: "low",
        recommendation: "Can be used together. Vitamin E enhances Vitamin C effectiveness.",
        scientificBasis: "Vitamin E works synergistically with Vitamin C to enhance antioxidant protection.",
      },
    ];

    let added = 0;
    let skippedConflicts = 0;

    for (const conflict of conflicts) {
      const idA = await getIngredientId(conflict.ingredientA);
      const idB = await getIngredientId(conflict.ingredientB);

      if (!idA || !idB) {
        skippedConflicts++;
        continue;
      }

      const existing1 = await ctx.db
        .query("compatibilityMatrix")
        .withIndex("by_pair", (q) => 
          q.eq("ingredientAId", idA).eq("ingredientBId", idB)
        )
        .first();

      const existing2 = await ctx.db
        .query("compatibilityMatrix")
        .withIndex("by_pair", (q) => 
          q.eq("ingredientAId", idB).eq("ingredientBId", idA)
        )
        .first();

      if (!existing1 && !existing2) {
        await ctx.db.insert("compatibilityMatrix", {
          ingredientAId: idA,
          ingredientBId: idB,
          conflictType: conflict.conflictType,
          severity: conflict.severity,
          recommendation: conflict.recommendation,
          scientificBasis: conflict.scientificBasis,
        });
        added++;
      } else {
        skippedConflicts++;
      }
    }
    
    return {
      ingredients: {
        inserted,
        skipped,
        total: ingredients.length,
      },
      compatibilityMatrix: {
        added,
        skipped: skippedConflicts,
        total: conflicts.length,
      },
    };
  },
});

