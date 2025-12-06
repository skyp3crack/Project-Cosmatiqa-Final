import { mutation, query, action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";

/**
 * Parse ingredient list string into array of ingredient names
 */
function parseIngredientList(ingredientString: string): string[] {
  // Split by comma, semicolon, or newline
  const ingredients = ingredientString
    .split(/[,;\n]+/)
    .map((ing) => ing.trim())
    .filter((ing) => ing.length > 0)
    // Remove parenthetical content (like "Aqua (Water)" -> "Aqua")
    .map((ing) => ing.replace(/\s*\([^)]*\)/g, "").trim())
    .filter((ing) => ing.length > 0);

  return ingredients;
}

/**
 * Match ingredient name to database
 */
async function matchIngredient(
  ctx: { db: any },
  ingredientName: string
): Promise<Id<"ingredients"> | null> {
  const searchTerm = ingredientName.toLowerCase().trim();

  // Try exact INCI name match
  const exactMatch = await ctx.db
    .query("ingredients")
    .withIndex("by_inciName", (q: any) => q.eq("inciName", ingredientName))
    .first();

  if (exactMatch) return exactMatch._id;

  // Try search index
  const searchResults = await ctx.db
    .query("ingredients")
    .withSearchIndex("search_ingredients", (q: any) =>
      q.search("inciName", searchTerm)
    )
    .take(5);

  if (searchResults.length > 0) {
    // Return the best match (first result)
    return searchResults[0]._id;
  }

  // Try common names
  const allIngredients = await ctx.db.query("ingredients").collect();
  const commonNameMatch = allIngredients.find((ing: any) =>
    ing.commonNames.some(
      (name: string) =>
        name.toLowerCase() === searchTerm ||
        searchTerm.includes(name.toLowerCase())
    )
  );

  return commonNameMatch ? commonNameMatch._id : null;
}

/**
 * Store ingredient to database if it doesn't exist
 * Returns the ingredient ID (existing or newly created)
 */
async function storeIngredient(
  ctx: { db: any },
  ingredientName: string
): Promise<Id<"ingredients">> {
  // First try to find existing
  const existing = await matchIngredient(ctx, ingredientName);
  if (existing) return existing;

  // Create new ingredient entry
  // Default category based on common patterns
  let category: "active" | "base" | "preservative" | "fragrance" = "base";
  const nameLower = ingredientName.toLowerCase();
  
  if (
    nameLower.includes("acid") ||
    nameLower.includes("retinol") ||
    nameLower.includes("peptide") ||
    nameLower.includes("vitamin") ||
    nameLower.includes("niacinamide") ||
    nameLower.includes("salicylic") ||
    nameLower.includes("glycolic") ||
    nameLower.includes("lactic")
  ) {
    category = "active";
  } else if (
    nameLower.includes("paraben") ||
    nameLower.includes("phenoxyethanol") ||
    nameLower.includes("preservative")
  ) {
    category = "preservative";
  } else if (
    nameLower.includes("fragrance") ||
    nameLower.includes("parfum") ||
    nameLower.includes("aroma")
  ) {
    category = "fragrance";
  }

  const ingredientId = await ctx.db.insert("ingredients", {
    inciName: ingredientName,
    commonNames: [ingredientName], // Use the name itself as common name
    function: `User-added ingredient: ${ingredientName}`,
    category: category,
    isActive: category === "active",
  });

  return ingredientId;
}

/**
 * Check for conflicts between two ingredients
 */
async function checkConflict(
  ctx: { db: any },
  ingredientAId: Id<"ingredients">,
  ingredientBId: Id<"ingredients">
) {
  // Check both directions (A+B and B+A)
  const conflict1 = await ctx.db
    .query("compatibilityMatrix")
    .withIndex("by_pair", (q: any) =>
      q.eq("ingredientAId", ingredientAId).eq("ingredientBId", ingredientBId)
    )
    .first();

  if (conflict1) return conflict1;

  const conflict2 = await ctx.db
    .query("compatibilityMatrix")
    .withIndex("by_pair", (q: any) =>
      q.eq("ingredientAId", ingredientBId).eq("ingredientBId", ingredientAId)
    )
    .first();

  return conflict2 || null;
}

/**
 * Internal mutation: Save routine to database
 */
export const _saveRoutine = mutation({
  args: {
    userId: v.string(),
    routineName: v.optional(v.string()),
    now: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("routines", {
      userId: args.userId,
      name: args.routineName || `Routine ${new Date(args.now).toLocaleDateString()}`,
      isActive: true,
      createdAt: args.now,
      updatedAt: args.now,
    });
  },
});

/**
 * Internal mutation: Save product to database
 */
export const _saveProduct = mutation({
  args: {
    routineId: v.id("routines"),
    productName: v.string(),
    brandName: v.optional(v.string()),
    rawInciList: v.string(),
    usageTime: v.union(
      v.literal("AM"),
      v.literal("PM"),
      v.literal("both"),
      v.literal("alternate"),
      v.literal("weekly")
    ),
    orderInRoutine: v.number(),
    now: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", {
      routineId: args.routineId,
      productName: args.productName,
      brandName: args.brandName,
      rawInciList: args.rawInciList,
      usageTime: args.usageTime,
      orderInRoutine: args.orderInRoutine,
      createdAt: args.now,
    });
  },
});

/**
 * Internal mutation: Store ingredient
 */
export const _storeIngredient = mutation({
  args: {
    ingredientName: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if exists
    const existing = await ctx.db
      .query("ingredients")
      .withIndex("by_inciName", (q) => q.eq("inciName", args.ingredientName))
      .first();

    if (existing) {
      // Check if properties exist, if not create default
      const existingProps = await ctx.db
        .query("ingredientProperties")
        .withIndex("by_ingredientId", (q) => q.eq("ingredientId", existing._id))
        .first();
      
      if (!existingProps) {
        // Create default properties for existing ingredient
        await ctx.db.insert("ingredientProperties", {
          ingredientId: existing._id,
          irritancyScore: 0,
          comedogenicScore: 0,
          isHarmful: false,
        });
        console.log(`✅ Created default properties for existing ingredient: ${args.ingredientName}`);
      }
      
      return existing._id;
    }

    // Determine category
    let category: "active" | "base" | "preservative" | "fragrance" = "base";
    const nameLower = args.ingredientName.toLowerCase();

    if (
      nameLower.includes("acid") ||
      nameLower.includes("retinol") ||
      nameLower.includes("peptide") ||
      nameLower.includes("vitamin") ||
      nameLower.includes("niacinamide") ||
      nameLower.includes("salicylic") ||
      nameLower.includes("glycolic") ||
      nameLower.includes("lactic")
    ) {
      category = "active";
    } else if (
      nameLower.includes("paraben") ||
      nameLower.includes("phenoxyethanol") ||
      nameLower.includes("preservative")
    ) {
      category = "preservative";
    } else if (
      nameLower.includes("fragrance") ||
      nameLower.includes("parfum") ||
      nameLower.includes("aroma")
    ) {
      category = "fragrance";
    }

    // Create new ingredient
    const ingredientId = await ctx.db.insert("ingredients", {
      inciName: args.ingredientName,
      commonNames: [args.ingredientName],
      function: `User-added ingredient: ${args.ingredientName}`,
      category: category,
      isActive: category === "active",
    });

    // Create default properties for new ingredient
    await ctx.db.insert("ingredientProperties", {
      ingredientId: ingredientId,
      irritancyScore: 0,
      comedogenicScore: 0,
      isHarmful: false,
    });

    console.log(`✅ Created new ingredient with default properties: ${args.ingredientName} (ID: ${ingredientId})`);

    return ingredientId;
  },
});

/**
 * Internal mutation: Save product-ingredient relationship
 */
export const _saveProductIngredient = mutation({
  args: {
    productId: v.id("products"),
    ingredientId: v.id("ingredients"),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("productIngredients", {
      productId: args.productId,
      ingredientId: args.ingredientId,
      position: args.position,
    });
  },
});

/**
 * Internal query: Get user profile
 */
export const _getUserProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

/**
 * Internal query: Check conflict between two ingredients
 */
export const _checkConflict = query({
  args: {
    ingredientAId: v.id("ingredients"),
    ingredientBId: v.id("ingredients"),
  },
  handler: async (ctx, args) => {
    // Check both directions (A+B and B+A)
    const conflict1 = await ctx.db
      .query("compatibilityMatrix")
      .withIndex("by_pair", (q) =>
        q.eq("ingredientAId", args.ingredientAId).eq("ingredientBId", args.ingredientBId)
      )
      .first();

    if (conflict1) return conflict1;

    const conflict2 = await ctx.db
      .query("compatibilityMatrix")
      .withIndex("by_pair", (q) =>
        q.eq("ingredientAId", args.ingredientBId).eq("ingredientBId", args.ingredientAId)
      )
      .first();

    return conflict2 || null;
  },
});

/**
 * Internal mutation: Save analysis results
 */
export const _saveAnalysisResults = mutation({
  args: {
    userId: v.string(),
    routineId: v.id("routines"),
    overallRiskScore: v.union(
      v.literal("safe"),
      v.literal("caution"),
      v.literal("high_risk")
    ),
    summaryScore: v.string(),
    conflictsFound: v.number(),
    analysisData: v.string(),
    recommendations: v.array(v.string()),
    now: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analysisResults", {
      userId: args.userId,
      routineId: args.routineId,
      overallRiskScore: args.overallRiskScore,
      summaryScore: args.summaryScore,
      conflictsFound: args.conflictsFound,
      analysisData: args.analysisData,
      recommendations: args.recommendations,
      createdAt: args.now,
    });
  },
});

/**
 * Internal mutation: Save detected conflict
 */
export const _saveDetectedConflict = mutation({
  args: {
    analysisId: v.id("analysisResults"),
    productAId: v.id("products"),
    productBId: v.id("products"),
    ingredientAId: v.id("ingredients"),
    ingredientBId: v.id("ingredients"),
    severity: v.string(),
    conflictType: v.string(),
    explanation: v.string(),
    recommendation: v.string(),
    isTemporalConflict: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("detectedConflicts", {
      analysisId: args.analysisId,
      productAId: args.productAId,
      productBId: args.productBId,
      ingredientAId: args.ingredientAId,
      ingredientBId: args.ingredientBId,
      severity: args.severity,
      conflictType: args.conflictType,
      explanation: args.explanation,
      recommendation: args.recommendation,
      isTemporalConflict: args.isTemporalConflict,
    });
  },
});

/**
 * Internal mutation: Save conflict to compatibilityMatrix (if not exists)
 * This learns from AI findings and builds the knowledge base
 */
export const _saveConflictToMatrix = mutation({
  args: {
    ingredientAId: v.id("ingredients"),
    ingredientBId: v.id("ingredients"),
    conflictType: v.string(),
    severity: v.string(),
    recommendation: v.string(),
    scientificBasis: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if conflict already exists (both directions)
    const existing1 = await ctx.db
      .query("compatibilityMatrix")
      .withIndex("by_pair", (q) =>
        q.eq("ingredientAId", args.ingredientAId).eq("ingredientBId", args.ingredientBId)
      )
      .first();

    const existing2 = await ctx.db
      .query("compatibilityMatrix")
      .withIndex("by_pair", (q) =>
        q.eq("ingredientAId", args.ingredientBId).eq("ingredientBId", args.ingredientAId)
      )
      .first();

    if (existing1 || existing2) {
      // Conflict already exists, return existing ID
      return { saved: false, existing: true, id: existing1?._id || existing2?._id };
    }

    // Save new conflict to matrix
    const conflictId = await ctx.db.insert("compatibilityMatrix", {
      ingredientAId: args.ingredientAId,
      ingredientBId: args.ingredientBId,
      conflictType: args.conflictType,
      severity: args.severity,
      recommendation: args.recommendation,
      scientificBasis: args.scientificBasis || undefined,
    });

    return { saved: true, existing: false, id: conflictId };
  },
});

/**
 * Main analysis function - analyzes a skincare routine
 * Note: This is an ACTION (not mutation) because it needs to call Claude AI action
 */
export const analyzeRoutine = action({
  args: {
    userId: v.string(),
    routineName: v.optional(v.string()),
    products: v.array(
      v.object({
        name: v.string(),
        ingredientList: v.string(),
        usageTiming: v.union(
          v.literal("AM"),
          v.literal("PM"),
          v.literal("Both")
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    try {
      const now = Date.now();

      // Validate input
      if (!args.products || args.products.length === 0) {
        throw new Error("At least one product is required");
      }

      // Step 1: Save the routine (use runMutation for database operations)
      const routineId = await ctx.runMutation(api.functions.analysis._saveRoutine, {
        userId: args.userId,
        routineName: args.routineName,
        now,
      });

      // Step 1.5: Get user profile for AI analysis
      const userProfile = await ctx.runQuery(api.functions.analysis._getUserProfile, {
        userId: args.userId,
      });

      // Step 2: Parse and save products with ingredients
      // Store ALL ingredients (even if not in database) to ingredients table
      const allMatchedIngredients: Array<{
        productId: Id<"products">;
        productName: string;
        ingredientId: Id<"ingredients">;
        ingredientName: string;
        usageTime: string;
      }> = [];

      const productsForAI: Array<{
        productName: string;
        ingredients: string[];
        usageTime: string;
      }> = [];

      for (let i = 0; i < args.products.length; i++) {
        const product = args.products[i];
        
        if (!product.name || !product.ingredientList) {
          continue; // Skip invalid products
        }
        
        // Convert usageTiming to match schema (Both -> both)
        const usageTime = product.usageTiming === "Both" ? "both" : product.usageTiming;
        
        // Validate usageTime matches schema
        if (!["AM", "PM", "both", "alternate", "weekly"].includes(usageTime)) {
          throw new Error(`Invalid usageTime: ${usageTime}`);
        }
        
        // Extract brand name using AI
        let brandName: string | undefined = undefined;
        try {
          console.log(`🏷️ Extracting brand name from: "${product.name}"`);
          brandName = await ctx.runAction(api.functions.llm.extractBrandName, {
            productName: product.name,
          });
          if (brandName) {
            console.log(`   ✅ Brand extracted: "${brandName}"`);
          } else {
            console.log(`   ⚠️ Could not extract brand name`);
          }
        } catch (error) {
          console.warn(`   ⚠️ Brand extraction failed: ${error}`);
          // Continue without brand name
        }

        // Save product (use runMutation)
        const productId = await ctx.runMutation(api.functions.analysis._saveProduct, {
          routineId,
          productName: product.name,
          brandName: brandName,
          rawInciList: product.ingredientList,
          usageTime: usageTime as "AM" | "PM" | "both" | "alternate" | "weekly",
          orderInRoutine: i + 1,
          now,
        });

        // Parse ingredients
        const parsedIngredients = parseIngredientList(product.ingredientList);
        const storedIngredientIds: string[] = [];

        // Store ALL ingredients to database (even if not matched)
        for (let pos = 0; pos < parsedIngredients.length; pos++) {
          const ingName = parsedIngredients[pos];
          if (!ingName || ingName.trim().length === 0) continue;
          
          // Store ingredient (creates new if doesn't exist, returns existing if found)
          // This will also create default properties if ingredient is new
          const ingredientId = await ctx.runMutation(api.functions.analysis._storeIngredient, {
            ingredientName: ingName,
          });
          storedIngredientIds.push(ingName);

          // Save product-ingredient relationship (use runMutation)
          await ctx.runMutation(api.functions.analysis._saveProductIngredient, {
            productId,
            ingredientId: ingredientId,
            position: pos + 1,
          });

          allMatchedIngredients.push({
            productId,
            productName: product.name,
            ingredientId: ingredientId,
            ingredientName: ingName,
            usageTime: usageTime,
          });
        }
        
        console.log(`📦 Stored ${storedIngredientIds.length} ingredients for product: ${product.name}`);

        // Add to AI input
        productsForAI.push({
          productName: product.name,
          ingredients: storedIngredientIds,
          usageTime: usageTime,
        });
      }
      
      // If no ingredients were found, still create analysis but with warning
      if (allMatchedIngredients.length === 0) {
        console.warn("No ingredients found in products");
      }

      // Step 3: Call Claude AI for comprehensive analysis
      console.log("🤖 ===== CALLING CLAUDE AI =====");
      console.log("📊 Products prepared for AI:", productsForAI.length);
      console.log("👤 User profile:", userProfile ? "Found" : "Not found (using defaults)");
      
      let aiAnalysis: any = null;
      try {
        console.log("🚀 Invoking Claude AI action...");
        aiAnalysis = await ctx.runAction(api.functions.llm.analyzeRoutineWithAI, {
          userProfile: {
            skinType: userProfile?.skinType || "normal",
            sensitivities: userProfile?.sensitivities || [],
            goals: userProfile?.goals || [],
          },
          products: productsForAI,
        });
        console.log("✅ Claude AI analysis successful!");
        console.log("📊 AI Results Summary:");
        console.log("   - Risk Score:", aiAnalysis.overallRiskScore);
        console.log("   - Conflicts:", aiAnalysis.conflicts?.length || 0);
        console.log("   - Summary:", aiAnalysis.summary?.substring(0, 100));
      } catch (error) {
        console.error("❌ Claude AI analysis failed, falling back to rule-based");
        console.error("Error details:", error);
        // Continue with rule-based analysis if AI fails
      }

      // Step 4: Detect conflicts (combine AI results with database conflicts)
      const conflicts: Array<{
        productAId: Id<"products">;
        productBId: Id<"products">;
        ingredientA: Id<"ingredients">;
        ingredientB: Id<"ingredients">;
        severity: string;
        conflictType: string;
        explanation: string;
        recommendation: string;
        isTemporalConflict: boolean;
      }> = [];

      // Use AI conflicts if available, otherwise use database conflicts
      if (aiAnalysis && aiAnalysis.conflicts && aiAnalysis.conflicts.length > 0) {
        console.log("🎯 Using AI-detected conflicts:", aiAnalysis.conflicts.length);
        // Map AI conflicts to our structure
        for (const aiConflict of aiAnalysis.conflicts) {
          // Find ingredient IDs - use fuzzy matching for ingredient names
          // AI might return "Vitamin C" but we have "L-Ascorbic Acid"
          // AI might return "Retinoid" but we have "Retinol"
          const findIngredient = (name: string) => {
            const nameLower = name.toLowerCase();
            // Try exact match first
            let match = allMatchedIngredients.find(
              (ing) => ing.ingredientName.toLowerCase() === nameLower
            );
            if (match) return match;
            
            // Try partial match (contains)
            match = allMatchedIngredients.find(
              (ing) => 
                ing.ingredientName.toLowerCase().includes(nameLower) ||
                nameLower.includes(ing.ingredientName.toLowerCase())
            );
            if (match) return match;
            
            // Try common name matching (Vitamin C -> L-Ascorbic Acid, Retinoid -> Retinol)
            if (nameLower.includes("vitamin c") || nameLower.includes("ascorbic")) {
              match = allMatchedIngredients.find(
                (ing) => ing.ingredientName.toLowerCase().includes("ascorbic")
              );
              if (match) return match;
            }
            if (nameLower.includes("retinoid") || nameLower.includes("retinol")) {
              match = allMatchedIngredients.find(
                (ing) => ing.ingredientName.toLowerCase().includes("retinol") ||
                         ing.ingredientName.toLowerCase().includes("tretinoin")
              );
              if (match) return match;
            }
            
            return null;
          };

          const ingA = findIngredient(aiConflict.ingredientA);
          const ingB = findIngredient(aiConflict.ingredientB);

          if (ingA && ingB && ingA.productName !== ingB.productName) {
            // Find product IDs - match by product name
            const productA = allMatchedIngredients.find(
              (ing) => ing.productName === aiConflict.productA || ing.productId === ingA.productId
            );
            const productB = allMatchedIngredients.find(
              (ing) => ing.productName === aiConflict.productB || ing.productId === ingB.productId
            );

            if (productA && productB) {
              const conflict = {
                productAId: productA.productId,
                productBId: productB.productId,
                ingredientA: ingA.ingredientId,
                ingredientB: ingB.ingredientId,
                severity: (aiConflict.severity || "medium").toLowerCase(), // HIGH -> high, etc.
                conflictType: aiConflict.conflictType || "compatibility",
                explanation: aiConflict.explanation || aiConflict.recommendation || "",
                recommendation: aiConflict.recommendation || "",
                isTemporalConflict: aiConflict.isTemporalConflict || false,
              };
              conflicts.push(conflict);
              console.log(`   ✅ Mapped AI conflict: ${ingA.ingredientName} ✕ ${ingB.ingredientName} (${conflict.severity})`);
            } else {
              console.log(`   ⚠️ Could not find products for conflict: ${aiConflict.productA} ✕ ${aiConflict.productB}`);
            }
          } else {
            console.log(`   ⚠️ Could not find ingredients for conflict: ${aiConflict.ingredientA} ✕ ${aiConflict.ingredientB}`);
            if (!ingA) console.log(`      - Missing: ${aiConflict.ingredientA}`);
            if (!ingB) console.log(`      - Missing: ${aiConflict.ingredientB}`);
          }
        }
        console.log(`   📊 Total conflicts mapped: ${conflicts.length} out of ${aiAnalysis.conflicts.length}`);
        } else {
        console.log("📚 Using rule-based conflict detection (database compatibility matrix)");
        // Fallback to rule-based conflict detection
        for (let i = 0; i < allMatchedIngredients.length; i++) {
          for (let j = i + 1; j < allMatchedIngredients.length; j++) {
            const ingA = allMatchedIngredients[i];
            const ingB = allMatchedIngredients[j];

            // Skip if ingredients are from same product (they're already mixed)
            if (ingA.productName === ingB.productName) continue;

            // Check if there's a known conflict (use runQuery)
            const conflict = await ctx.runQuery(api.functions.analysis._checkConflict, {
              ingredientAId: ingA.ingredientId,
              ingredientBId: ingB.ingredientId,
            });

            if (conflict) {
              // Check if it's a temporal conflict (used at same time)
              const isTemporalConflict =
                ingA.usageTime === ingB.usageTime ||
                ingA.usageTime === "both" ||
                ingB.usageTime === "both";

              conflicts.push({
                productAId: ingA.productId,
                productBId: ingB.productId,
                ingredientA: ingA.ingredientId,
                ingredientB: ingB.ingredientId,
                severity: conflict.severity || "medium",
                conflictType: conflict.conflictType || "compatibility",
                explanation: conflict.scientificBasis || conflict.recommendation || "",
                recommendation: conflict.recommendation || "",
                isTemporalConflict,
              });
            }
          }
        }
      }

      // Step 5: Calculate safety score
      // AI returns RISK score (0-10, where higher = worse)
      // We need to convert to SAFETY score (0-10, where higher = better)
      let safetyScore = 10;
      let riskScore = 0;
      
      console.log("📊 Safety Score Calculation:");
      
      if (aiAnalysis && aiAnalysis.overallRiskScore !== undefined) {
        // AI provided risk score (0-10, higher = worse)
        riskScore = aiAnalysis.overallRiskScore;
        // Convert to safety score: safety = 10 - risk
        safetyScore = 10 - riskScore;
        console.log("   - AI Risk Score:", riskScore, "/10 (higher = worse)");
        console.log("   - Converted Safety Score:", safetyScore, "/10 (higher = better)");
      } else {
        // Calculate from conflicts if AI didn't provide score
        console.log("   - Calculating from conflicts...");
        for (const conflict of conflicts) {
          if (conflict.severity === "high" || conflict.severity === "severe") {
            safetyScore -= 3;
          } else if (conflict.severity === "medium" || conflict.severity === "moderate") {
            safetyScore -= 1.5;
          } else {
            safetyScore -= 0.5;
          }
        }
        // Calculate risk score from safety score
        riskScore = 10 - safetyScore;
        console.log("   - Calculated Safety Score:", safetyScore, "/10");
        console.log("   - Calculated Risk Score:", riskScore, "/10");
      }
      
      safetyScore = Math.max(0, Math.min(10, safetyScore));
      riskScore = Math.max(0, Math.min(10, riskScore));

      // Determine risk level based on SAFETY score (higher = better)
      const overallRiskScore = safetyScore >= 7 ? "safe" : safetyScore >= 4 ? "caution" : "high_risk";
      const summaryScore = safetyScore >= 9 ? "A+" : safetyScore >= 8 ? "A" : safetyScore >= 7 ? "B+" : safetyScore >= 6 ? "B" : safetyScore >= 5 ? "C" : "D";
      
      console.log("   - Final Safety Score:", safetyScore, "/10");
      console.log("   - Final Risk Score:", riskScore, "/10");
      console.log("   - Overall Risk Level:", overallRiskScore);
      console.log("   - Summary Score:", summaryScore);

      // Generate recommendations (use AI recommendations if available)
      const recommendations: string[] = [];
      
      // Add AI summary first (most comprehensive)
      if (aiAnalysis && aiAnalysis.summary) {
        recommendations.push(aiAnalysis.summary);
      }
      
      // Add ingredient-specific warnings for user's skin type
      if (aiAnalysis && aiAnalysis.ingredientWarnings && aiAnalysis.ingredientWarnings.length > 0) {
        const highSeverityWarnings = aiAnalysis.ingredientWarnings.filter(
          (w: any) => w.severity === "HIGH"
        );
        if (highSeverityWarnings.length > 0) {
          recommendations.push(`⚠️ INGREDIENT WARNINGS FOR YOUR SKIN TYPE:`);
          highSeverityWarnings.forEach((warning: any) => {
            recommendations.push(
              `- ${warning.ingredient} (in ${warning.product}): ${warning.concern}. ${warning.recommendation}`
            );
          });
        }
      }
      
      // Add ingredient benefits (positive feedback)
      if (aiAnalysis && aiAnalysis.ingredientBenefits && aiAnalysis.ingredientBenefits.length > 0) {
        recommendations.push(`✅ BENEFICIAL INGREDIENTS FOR YOUR SKIN TYPE:`);
        aiAnalysis.ingredientBenefits.slice(0, 3).forEach((benefit: any) => {
          recommendations.push(`- ${benefit.ingredient} (in ${benefit.product}): ${benefit.benefit}`);
        });
      }
      
      // Add conflict warnings
      if (conflicts.length === 0) {
        recommendations.push("Your routine looks great! No conflicts detected.");
      } else {
        recommendations.push(`Found ${conflicts.length} potential conflict(s).`);
        const severeConflicts = conflicts.filter(
          (c) => c.severity === "high" || c.severity === "severe"
        );
        if (severeConflicts.length > 0) {
          recommendations.push("Review high-severity conflicts immediately.");
        }
      }

      // Add AI routine recommendations if available
      if (aiAnalysis) {
        if (aiAnalysis.morningRoutine && aiAnalysis.morningRoutine.length > 0) {
          recommendations.push(
            `Morning routine: ${aiAnalysis.morningRoutine.join(", ")}`
          );
        }
        if (aiAnalysis.eveningRoutine && aiAnalysis.eveningRoutine.length > 0) {
          recommendations.push(
            `Evening routine: ${aiAnalysis.eveningRoutine.join(", ")}`
          );
        }
      }

      // Step 6: Create analysis result
      const analysisData = JSON.stringify({
        totalIngredients: allMatchedIngredients.length,
        safetyScore: safetyScore,
        riskScore: riskScore,
        conflictsSummary: conflicts.map((c) => ({
          severity: c.severity,
          type: c.conflictType,
        })),
        aiAnalysis: aiAnalysis
          ? {
              overallRiskScore: aiAnalysis.overallRiskScore,
              summary: aiAnalysis.summary,
              ingredientWarnings: aiAnalysis.ingredientWarnings || [],
              ingredientBenefits: aiAnalysis.ingredientBenefits || [],
            }
          : null,
      });

      // Step 6: Save AI-detected conflicts to compatibilityMatrix (learn from AI)
      if (aiAnalysis && aiAnalysis.conflicts && aiAnalysis.conflicts.length > 0 && conflicts.length > 0) {
        console.log("🧠 Learning from AI: Saving new conflicts to compatibilityMatrix...");
        let savedToMatrix = 0;
        let alreadyExists = 0;
        let failed = 0;

        for (const conflict of conflicts) {
          // Save all conflicts that were successfully mapped (they have ingredient IDs)
          try {
            const result = await ctx.runMutation(api.functions.analysis._saveConflictToMatrix, {
              ingredientAId: conflict.ingredientA,
              ingredientBId: conflict.ingredientB,
              conflictType: conflict.conflictType,
              severity: conflict.severity,
              recommendation: conflict.recommendation || conflict.explanation || "AI-detected conflict",
              scientificBasis: conflict.explanation || conflict.recommendation || "",
            });

            if (result.saved) {
              savedToMatrix++;
              // Get ingredient names for logging
              const ingA = allMatchedIngredients.find(ing => ing.ingredientId === conflict.ingredientA);
              const ingB = allMatchedIngredients.find(ing => ing.ingredientId === conflict.ingredientB);
              console.log(`   ✅ Saved new conflict to matrix: ${ingA?.ingredientName || conflict.ingredientA} ✕ ${ingB?.ingredientName || conflict.ingredientB}`);
              
              // Step 6.5: Cache research for this ingredient pair in llmResearchCache
              try {
                // Check if research already cached
                const cachedResearch = await ctx.runQuery(api.functions.research.getCachedResearch, {
                  ingredientAId: conflict.ingredientA,
                  ingredientBId: conflict.ingredientB,
                });

                if (!cachedResearch && ingA && ingB) {
                  // Cache the AI analysis result
                  await ctx.runMutation(api.functions.research.saveResearchToCache, {
                    ingredientAId: conflict.ingredientA,
                    ingredientBId: conflict.ingredientB,
                    query: `Research compatibility between ${ingA.ingredientName} and ${ingB.ingredientName}`,
                    claudeResponse: JSON.stringify({
                      compatible: false,
                      severity: conflict.severity,
                      conflictType: conflict.conflictType,
                      explanation: conflict.explanation,
                      recommendation: conflict.recommendation,
                      confidence: 0.85, // AI-detected conflicts have high confidence
                      researchSummary: conflict.explanation || conflict.recommendation,
                    }),
                    confidence: 0.85,
                    citations: [],
                    ttlDays: 30,
                  });
                  console.log(`   💾 Cached research for: ${ingA.ingredientName} ✕ ${ingB.ingredientName}`);
                }
              } catch (cacheError) {
                console.warn(`   ⚠️ Failed to cache research:`, cacheError);
              }
            } else if (result.existing) {
              alreadyExists++;
            }
          } catch (error) {
            failed++;
            console.error(`   ❌ Failed to save conflict to matrix:`, error);
          }
        }

        console.log(`📚 Matrix update: ${savedToMatrix} new conflicts saved, ${alreadyExists} already existed, ${failed} failed`);
      }

      // Step 7: Save analysis results (use runMutation)
      const analysisId = await ctx.runMutation(api.functions.analysis._saveAnalysisResults, {
        userId: args.userId,
        routineId,
        overallRiskScore,
        summaryScore,
        conflictsFound: conflicts.length,
        analysisData,
        recommendations,
        now,
      });

      // Step 8: Save detected conflicts (use runMutation)
      for (const conflict of conflicts) {
        await ctx.runMutation(api.functions.analysis._saveDetectedConflict, {
          analysisId,
          productAId: conflict.productAId,
          productBId: conflict.productBId,
          ingredientAId: conflict.ingredientA,
          ingredientBId: conflict.ingredientB,
          severity: conflict.severity,
          conflictType: conflict.conflictType,
          explanation: conflict.explanation,
          recommendation: conflict.recommendation,
          isTemporalConflict: conflict.isTemporalConflict,
        });
      }

      console.log("🎉 ===== ANALYSIS COMPLETE =====");
      console.log("📊 Final Results:");
      console.log("   - Analysis ID:", analysisId);
      console.log("   - Safety Score:", safetyScore, "/10");
      console.log("   - Risk Score:", riskScore, "/10");
      console.log("   - Summary Score:", summaryScore);
      console.log("   - Overall Risk Level:", overallRiskScore);
      console.log("   - Conflicts Found:", conflicts.length);
      console.log("   - Ingredients Analyzed:", allMatchedIngredients.length);
      console.log("   - AI Used:", aiAnalysis ? "✅ YES" : "❌ NO (rule-based only)");

      return {
        analysisId,
        routineId,
        safetyScore: safetyScore,
        riskScore: riskScore,
        summaryScore,
        conflictsFound: conflicts.length,
        ingredientsAnalyzed: allMatchedIngredients.length,
      };
    } catch (error) {
      console.error("❌ ===== ANALYSIS ERROR =====");
      console.error("Error in analyzeRoutine:", error);
      throw new Error(`Analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});

/**
 * Get analysis results with full details
 */
export const getAnalysisResults = query({
  args: { analysisId: v.id("analysisResults") },
  handler: async (ctx, args) => {
    const analysis = await ctx.db.get(args.analysisId);
    if (!analysis) return null;

    // Get routine
    const routine = await ctx.db.get(analysis.routineId);

    // Get products
    const products = await ctx.db
      .query("products")
      .withIndex("by_routineId", (q) => q.eq("routineId", analysis.routineId))
      .collect();

    // Get conflicts with ingredient details
    const conflictsRaw = await ctx.db
      .query("detectedConflicts")
      .withIndex("by_analysisId", (q) => q.eq("analysisId", args.analysisId))
      .collect();

    const conflicts = await Promise.all(
      conflictsRaw.map(async (conflict) => {
        const ingredientA = await ctx.db.get(conflict.ingredientAId);
        const ingredientB = await ctx.db.get(conflict.ingredientBId);
        const productA = await ctx.db.get(conflict.productAId);
        const productB = await ctx.db.get(conflict.productBId);

        return {
          ...conflict,
          ingredientA,
          ingredientB,
          productA,
          productB,
        };
      })
    );

    // Parse analysisData if it exists
    const analysisDataParsed = analysis.analysisData 
      ? JSON.parse(analysis.analysisData) 
      : null;

    return {
      analysis: {
        ...analysis,
        safetyScore: analysisDataParsed?.safetyScore || 0,
        overallSafetyScore: analysisDataParsed?.safetyScore || 0, // Backwards compatibility
      },
      routine,
      products,
      conflicts,
    };
  },
});

/**
 * Get user's analysis history
 */
export const getUserAnalyses = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const analyses = await ctx.db
      .query("analysisResults")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(10);

    // Get basic info for each
    const analysesWithDetails = await Promise.all(
      analyses.map(async (analysis) => {
        const routine = await ctx.db.get(analysis.routineId);
        const conflictsCount = await ctx.db
          .query("detectedConflicts")
          .withIndex("by_analysisId", (q) =>
            q.eq("analysisId", analysis._id)
          )
          .collect();

        return {
          ...analysis,
          routineName: routine?.name,
          conflictsCount: conflictsCount.length,
        };
      })
    );

    return analysesWithDetails;
  },
});

/**
 * Action: Enhance analysis with AI insights (optional enhancement)
 * This can be called after the main analysis to add AI commentary
 */
export const enhanceWithAI = action({
  args: { analysisId: v.id("analysisResults") },
  handler: async (ctx, args) => {
    // Get analysis data
    const analysis = await ctx.runQuery(api.analysis.getAnalysisResults, {
      analysisId: args.analysisId,
    });

    if (!analysis) {
      throw new Error("Analysis not found");
    }

    // TODO: Call Claude AI for enhanced insights
    // const aiResponse = await callClaudeAI(analysis);

    // For now, generate a simple summary
    const summary =
      analysis.conflicts.length === 0
        ? "Your routine looks great! No major conflicts detected."
        : `Found ${analysis.conflicts.length} potential conflict(s). Review recommendations below.`;

    // Update analysis with AI summary
    await ctx.runMutation(api.analysis.updateAISummary, {
      analysisId: args.analysisId,
      aiSummary: summary,
    });

    return { summary };
  },
});

/**
 * Internal mutation to update AI summary
 */
export const updateAISummary = mutation({
  args: {
    analysisId: v.id("analysisResults"),
    aiSummary: v.string(),
  },
  handler: async (ctx, args) => {
    // Get current analysis to update recommendations
    const analysis = await ctx.db.get(args.analysisId);
    if (!analysis) {
      throw new Error("Analysis not found");
    }

    // Update recommendations array with AI summary
    const updatedRecommendations = [...analysis.recommendations];
    if (!updatedRecommendations.includes(args.aiSummary)) {
      updatedRecommendations.unshift(args.aiSummary); // Add to beginning
    }

    await ctx.db.patch(args.analysisId, {
      recommendations: updatedRecommendations,
    });
  },
});

