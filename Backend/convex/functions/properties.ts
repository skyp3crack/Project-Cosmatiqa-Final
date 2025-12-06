import { action, mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";

/**
 * Get ingredient properties by ingredient ID
 */
export const getIngredientProperties = query({
  args: { ingredientId: v.id("ingredients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ingredientProperties")
      .withIndex("by_ingredientId", (q) => q.eq("ingredientId", args.ingredientId))
      .first();
  },
});

/**
 * Get all ingredient properties (for debugging)
 */
export const getAllIngredientProperties = query({
  args: {},
  handler: async (ctx) => {
    const allProps = await ctx.db.query("ingredientProperties").collect();
    const ingredients = await ctx.db.query("ingredients").collect();
    const ingredientMap = new Map(ingredients.map((ing: any) => [ing._id, ing]));
    
    return allProps.map((prop: any) => ({
      ...prop,
      ingredientName: ingredientMap.get(prop.ingredientId)?.inciName || "Unknown",
    }));
  },
});

/**
 * Get all ingredients missing properties
 */
export const getIngredientsWithoutProperties = query({
  args: {},
  handler: async (ctx) => {
    const allIngredients = await ctx.db.query("ingredients").collect();
    const ingredientsWithoutProps: Array<{ _id: Id<"ingredients">; inciName: string }> = [];

    for (const ingredient of allIngredients) {
      const props = await ctx.db
        .query("ingredientProperties")
        .withIndex("by_ingredientId", (q) => q.eq("ingredientId", ingredient._id))
        .first();

      if (!props) {
        ingredientsWithoutProps.push({
          _id: ingredient._id,
          inciName: ingredient.inciName,
        });
      }
    }

    return ingredientsWithoutProps;
  },
});

/**
 * Create or update ingredient properties
 */
export const upsertIngredientProperties = mutation({
  args: {
    ingredientId: v.id("ingredients"),
    phRangeMin: v.optional(v.number()),
    phRangeMax: v.optional(v.number()),
    irritancyScore: v.number(),
    comedogenicScore: v.number(),
    isHarmful: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("ingredientProperties")
      .withIndex("by_ingredientId", (q) => q.eq("ingredientId", args.ingredientId))
      .first();

    const properties = {
      ingredientId: args.ingredientId,
      phRangeMin: args.phRangeMin,
      phRangeMax: args.phRangeMax,
      irritancyScore: args.irritancyScore,
      comedogenicScore: args.comedogenicScore,
      isHarmful: args.isHarmful,
    };

    if (existing) {
      await ctx.db.patch(existing._id, properties);
      console.log(`✅ Updated properties for ingredient ${args.ingredientId}`);
      return { id: existing._id, updated: true };
    } else {
      const id = await ctx.db.insert("ingredientProperties", properties);
      console.log(`✅ Created properties for ingredient ${args.ingredientId} (ID: ${id})`);
      return { id, updated: false };
    }
  },
});

/**
 * Extract ingredient properties using AI
 */
export const extractPropertiesWithAI = action({
  args: {
    ingredientId: v.id("ingredients"),
    inciName: v.string(),
    function: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    // @ts-ignore - process.env is available in Node.js runtime
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY not set");
    }

    const { Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({ apiKey });

    const prompt = `You are a skincare ingredient expert. Analyze this ingredient and provide its properties in JSON format:

Ingredient: ${args.inciName}
Function: ${args.function}
Category: ${args.category}

Provide a JSON object with these exact fields:
{
  "phRangeMin": number or null (optimal pH minimum, e.g., 2.5 for L-Ascorbic Acid, 5.5 for Retinol),
  "phRangeMax": number or null (optimal pH maximum, e.g., 3.5 for L-Ascorbic Acid, 6.5 for Retinol),
  "irritancyScore": number 0-5 (0 = non-irritating, 5 = highly irritating),
  "comedogenicScore": number 0-5 (0 = non-comedogenic, 5 = highly comedogenic),
  "isHarmful": boolean (true if ingredient is known to be harmful or unsafe)
}

Guidelines:
- pH range: Only provide if ingredient has specific pH requirements (acids, retinoids, etc.). Most ingredients don't need pH range.
- Irritancy: 0 = gentle (Hyaluronic Acid), 1-2 = mild (Niacinamide), 3 = moderate (Retinol), 4-5 = high (Benzoyl Peroxide, strong acids)
- Comedogenicity: 0 = won't clog pores, 5 = highly likely to clog pores
- Harmful: true only for known unsafe ingredients (e.g., banned substances, high concentrations of certain chemicals)

Return ONLY the JSON object, no other text.`;

    try {
      const primaryModel = "claude-haiku-4-5-20251001";
      const fallbackModel = "claude-3-haiku-20240307";

      let message: any = null;
      let usedModel = "";

      try {
        message = await anthropic.messages.create({
          model: primaryModel,
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        });
        usedModel = primaryModel;
      } catch (error: any) {
        console.log(`Primary model failed, trying fallback: ${fallbackModel}`);
        message = await anthropic.messages.create({
          model: fallbackModel,
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        });
        usedModel = fallbackModel;
      }

      const content = message.content[0];
      if (content.type !== "text") {
        throw new Error("Unexpected response type from Claude");
      }

      console.log(`📝 Raw AI response for ${args.inciName}:`, content.text);

      // Parse JSON response
      let properties: any;
      try {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          properties = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (parseError) {
        console.error("Failed to parse properties response:", parseError);
        // Fallback: default safe values
        properties = {
          phRangeMin: null,
          phRangeMax: null,
          irritancyScore: 1,
          comedogenicScore: 0,
          isHarmful: false,
        };
      }

      // Validate and normalize
      const validatedProperties = {
        phRangeMin: properties.phRangeMin !== null && properties.phRangeMin !== undefined ? Number(properties.phRangeMin) : undefined,
        phRangeMax: properties.phRangeMax !== null && properties.phRangeMax !== undefined ? Number(properties.phRangeMax) : undefined,
        irritancyScore: Math.max(0, Math.min(5, Math.round(Number(properties.irritancyScore) || 0))),
        comedogenicScore: Math.max(0, Math.min(5, Math.round(Number(properties.comedogenicScore) || 0))),
        isHarmful: Boolean(properties.isHarmful),
      };

      console.log(`🔬 Extracted properties for ${args.inciName} (${usedModel}):`, validatedProperties);

      // Save to database
      const saveResult = await ctx.runMutation(api.functions.properties.upsertIngredientProperties, {
        ingredientId: args.ingredientId,
        ...validatedProperties,
      });

      console.log(`💾 Save result for ${args.inciName}:`, saveResult);

      // Verify it was saved
      const verify = await ctx.runQuery(api.functions.properties.getIngredientProperties, {
        ingredientId: args.ingredientId,
      });

      console.log(`✅ Verified saved properties for ${args.inciName}:`, verify);

      return {
        success: true,
        properties: validatedProperties,
        model: usedModel,
        saveResult,
        verified: verify,
      };
    } catch (error) {
      console.error(`Failed to extract properties for ${args.inciName}:`, error);
      throw new Error(`Property extraction failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});

/**
 * Get ingredients with default/empty properties (need enhancement)
 */
export const getIngredientsWithDefaultProperties = query({
  args: {},
  handler: async (ctx) => {
    const allIngredients = await ctx.db.query("ingredients").collect();
    const ingredientsNeedingEnhancement: Array<{
      _id: Id<"ingredients">;
      inciName: string;
      function: string;
      category: string;
    }> = [];

    for (const ingredient of allIngredients) {
      const props = await ctx.db
        .query("ingredientProperties")
        .withIndex("by_ingredientId", (q) => q.eq("ingredientId", ingredient._id))
        .first();

      // Consider "default" if: irritancy=0, comedogenic=0, isHarmful=false, and no pH range
      // OR if it's missing properties entirely
      if (!props) {
        ingredientsNeedingEnhancement.push({
          _id: ingredient._id,
          inciName: ingredient.inciName,
          function: ingredient.function,
          category: ingredient.category,
        });
      } else if (
        props.irritancyScore === 0 &&
        props.comedogenicScore === 0 &&
        props.isHarmful === false &&
        !props.phRangeMin &&
        !props.phRangeMax
      ) {
        // Has default values - might need enhancement
        ingredientsNeedingEnhancement.push({
          _id: ingredient._id,
          inciName: ingredient.inciName,
          function: ingredient.function,
          category: ingredient.category,
        });
      }
    }

    return ingredientsNeedingEnhancement;
  },
});

/**
 * Populate properties for all ingredients missing them
 * Uses AI to extract properties for each ingredient
 */
export const populateAllProperties = action({
  args: {
    batchSize: v.optional(v.number()), // Process in batches to avoid rate limits
    enhanceExisting: v.optional(v.boolean()), // If true, also enhance ingredients with default values
  },
  handler: async (ctx, args) => {
    const batchSize = args.batchSize || 5; // Default: 5 at a time
    const enhanceExisting = args.enhanceExisting ?? false;

    // Get all ingredients without properties
    let ingredientsToProcess = await ctx.runQuery(
      api.functions.properties.getIngredientsWithoutProperties,
      {}
    );

    // If enhanceExisting is true, also get ingredients with default values
    if (enhanceExisting && ingredientsToProcess.length === 0) {
      const defaultProps = await ctx.runQuery(
        api.functions.properties.getIngredientsWithDefaultProperties,
        {}
      );
      ingredientsToProcess = defaultProps.map((ing: any) => ({
        _id: ing._id,
        inciName: ing.inciName,
      }));
    }

    if (ingredientsToProcess.length === 0) {
      return {
        message: "All ingredients already have properties",
        processed: 0,
        total: 0,
      };
    }

    console.log(`📊 Found ${ingredientsToProcess.length} ingredients to process`);

    // Get full ingredient details
    const allIngredients = await ctx.runQuery(api.functions.helpers.getAllIngredients, {});
    const ingredientMap = new Map(allIngredients.map((ing: any) => [ing._id, ing]));

    const results: Array<{
      ingredient: string;
      status: "success" | "error";
      error?: string;
    }> = [];

    // Process in batches
    for (let i = 0; i < ingredientsToProcess.length; i += batchSize) {
      const batch = ingredientsToProcess.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(ingredientsToProcess.length / batchSize)}`);

      const batchPromises = batch.map(async (ing) => {
        try {
          const fullIngredient = ingredientMap.get(ing._id);
          if (!fullIngredient) {
            throw new Error("Ingredient not found");
          }

          await ctx.runAction(api.functions.properties.extractPropertiesWithAI, {
            ingredientId: ing._id,
            inciName: ing.inciName,
            function: fullIngredient.function,
            category: fullIngredient.category,
          });

          return { ingredient: ing.inciName, status: "success" as const };
        } catch (error) {
          return {
            ingredient: ing.inciName,
            status: "error" as const,
            error: error instanceof Error ? error.message : String(error),
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Small delay between batches to avoid rate limits
      if (i + batchSize < ingredientsToProcess.length) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay
      }
    }

    const successful = results.filter((r) => r.status === "success").length;
    const failed = results.filter((r) => r.status === "error").length;

    return {
      message: `Property population complete`,
      processed: results.length,
      successful,
      failed,
      results,
    };
  },
});
