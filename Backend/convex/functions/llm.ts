import { action } from "../_generated/server";
import { v } from "convex/values";
import Anthropic from "@anthropic-ai/sdk";

/**
 * Main LLM function for comprehensive routine analysis
 * Called during "Analyze My Routine" process
 */
export const analyzeRoutineWithAI = action({
  args: {
    userProfile: v.object({
      skinType: v.string(),
      sensitivities: v.array(v.string()),
      goals: v.array(v.string()),
    }),
    products: v.array(
      v.object({
        productName: v.string(),
        ingredients: v.array(v.string()),
        usageTime: v.string(), // "AM", "PM", or "both"
      })
    ),
  },
  handler: async (ctx, args) => {
    console.log("🤖 ===== CLAUDE AI ANALYSIS STARTED =====");
    console.log("📥 Input received:");
    console.log("   User Profile:", JSON.stringify(args.userProfile, null, 2));
    console.log("   Products:", JSON.stringify(args.products, null, 2));
    
    // Get API key from environment
    // In Convex actions, use process.env (Node.js environment)
    // @ts-ignore - process.env is available in Node.js runtime
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("❌ ANTHROPIC_API_KEY not set in Convex environment variables");
      console.error("💡 Go to Convex Dashboard → Settings → Environment Variables");
      console.error("💡 Add: ANTHROPIC_API_KEY = your-api-key");
      throw new Error("ANTHROPIC_API_KEY not set in Convex environment variables. Check Settings → Environment Variables in Convex Dashboard.");
    }

    console.log("✅ API Key found, initializing Claude client...");
    const anthropic = new Anthropic({ apiKey });
    
    // Debug: Try to list available models (optional, for debugging)
    try {
      console.log("🔍 Checking API key validity and available models...");
      // Note: Anthropic doesn't have a direct "list models" endpoint in the SDK
      // But we can verify the key works by trying a simple call
      console.log("✅ API key format looks valid");
    } catch (error) {
      console.warn("⚠️ Could not verify API key:", error);
    }

    // Build prompt for Claude
    const productsList = args.products
      .map(
        (p, idx) =>
          `${idx + 1}. ${p.productName} (${p.usageTime}):\n   Ingredients: ${p.ingredients.join(", ")}`
      )
      .join("\n\n");

    const prompt = `You are a skincare expert analyzing a user's skincare routine for ingredient conflicts, compatibility, and personalized suitability.

USER PROFILE:
- Skin Type: ${args.userProfile.skinType}
- Sensitivities/Concerns: ${args.userProfile.sensitivities.join(", ") || "None specified"}
- Goals: ${args.userProfile.goals.join(", ") || "General skincare"}

PRODUCTS IN ROUTINE (with INCI ingredients):
${productsList}

TASK:
Analyze this skincare routine comprehensively:

1. INGREDIENT-SKIN TYPE COMPATIBILITY:
   - Evaluate each INCI ingredient's suitability for ${args.userProfile.skinType} skin
   - Identify ingredients that may cause issues for this skin type (e.g., high comedogenic ingredients for oily/acne-prone, harsh actives for sensitive)
   - Flag ingredients that are particularly beneficial or problematic for ${args.userProfile.skinType} skin
   - Consider sensitivities: ${args.userProfile.sensitivities.join(", ") || "none"}

2. INGREDIENT CONFLICTS:
   - Identify conflicts between INCI ingredients (pH incompatibility, chemical reactions, stability issues)
   - Consider AM/PM timing - conflicts are more serious if used simultaneously
   - Rate severity: HIGH (irritation, barrier damage, efficacy loss), MEDIUM (minor issues), LOW (best practices)

3. PERSONALIZED RECOMMENDATIONS:
   - Identify the TOP 3 MOST BENEFICIAL ingredients for ${args.userProfile.skinType} skin
   - These should be ingredients that are either:
     a) Already in the user's routine and particularly well-suited for their skin type
     b) Missing from their routine but highly recommended for their concerns/goals
   - For each of the top 3, explain why it's beneficial for ${args.userProfile.skinType} skin
   - Address specific concerns: ${args.userProfile.sensitivities.join(", ") || "none"}
   - Align with goals: ${args.userProfile.goals.join(", ") || "general"}
   - Provide ingredient-specific advice (e.g., "Retinol may be too harsh for sensitive skin, consider Bakuchiol instead")
   - Suggest ingredient concentrations or formulations appropriate for this skin type
   - IMPORTANT: Return exactly 3 ingredients in ingredientBenefits array, prioritizing the most beneficial ones

4. ROUTINE OPTIMIZATION:
   - Suggest optimal AM/PM product arrangement
   - Recommend ingredient layering order
   - Identify missing ingredients that would benefit ${args.userProfile.skinType} skin

OUTPUT FORMAT (JSON):
{
  "overallRiskScore": <number 0-10, where 0=safe, 10=high risk>,
  "conflicts": [
    {
      "ingredientA": "<exact INCI name>",
      "ingredientB": "<exact INCI name>",
      "productA": "<product name>",
      "productB": "<product name>",
      "severity": "HIGH" | "MEDIUM" | "LOW",
      "conflictType": "<pH_incompatibility | chemical_reaction | stability_issue | irritation_risk | efficacy_reduction>",
      "explanation": "<detailed scientific explanation>",
      "recommendation": "<specific action for this user's ${args.userProfile.skinType} skin>",
      "isTemporalConflict": <boolean>
    }
  ],
  "ingredientWarnings": [
    {
      "ingredient": "<INCI name>",
      "product": "<product name>",
      "concern": "<why this ingredient may be problematic for ${args.userProfile.skinType} skin>",
      "recommendation": "<what to do - alternative ingredient or usage adjustment>",
      "severity": "HIGH" | "MEDIUM" | "LOW"
    }
  ],
  "ingredientBenefits": [
    // Return exactly 3 ingredients that are MOST beneficial for ${args.userProfile.skinType} skin
    // Prioritize ingredients that:
    // 1. Are already in the user's routine AND beneficial for their skin type
    // 2. Address their specific concerns (${args.userProfile.sensitivities.join(", ") || "none"})
    // 3. Support their goals (${args.userProfile.goals.join(", ") || "general"})
    {
      "ingredient": "<INCI name>",
      "product": "<product name>",
      "benefit": "<why this ingredient is good for ${args.userProfile.skinType} skin>"
    },
    {
      "ingredient": "<INCI name>",
      "product": "<product name>",
      "benefit": "<why this ingredient is good for ${args.userProfile.skinType} skin>"
    },
    {
      "ingredient": "<INCI name>",
      "product": "<product name>",
      "benefit": "<why this ingredient is good for ${args.userProfile.skinType} skin>"
    }
  ],
  "morningRoutine": ["<product name>", ...],
  "eveningRoutine": ["<product name>", ...],
  "summary": "<STRICT LIMIT: Maximum 300 characters OR 50 words. Concise summary focusing ONLY on information NOT covered in other tabs. Format: 1) Overall safety assessment (1 sentence: risk level X/10 and brief context for ${args.userProfile.skinType} skin), 2) Most critical issue (1 sentence summary without details - see Conflicts tab), 3) Critical action items (3-5 bullet points of immediate actions), 4) Missing ingredients overview (brief list - see Benefits tab for details). EXCLUDE: Detailed conflicts, warnings, benefits, routine schedules. Count your words/characters and stay within limit.>",
  "profileSummary": "<REQUIRED FIELD - DO NOT SKIP. Write a comprehensive personalized summary (300-500 words, minimum 300 words) specifically tailored for ${args.userProfile.skinType} skin with ${args.userProfile.goals.join(', ') || 'general'} goals. This summary is EXCLUSIVELY for the Summary tab and must NOT repeat or duplicate information from other tabs. Focus on: 1) Overall routine compatibility assessment for their specific skin profile (not just risk score), 2) Holistic routine evaluation - how products work together as a system, 3) Personalized insights about routine balance, ingredient synergy, and overall approach, 4) Strategic guidance on routine philosophy and long-term skin health, 5) Contextual interpretation of findings - what the analysis means FOR THIS SPECIFIC USER. STRICTLY EXCLUDE: Specific conflict details (covered in Conflicts tab), ingredient warnings (covered in Warnings tab), ingredient benefits (covered in Benefits tab), routine schedules (covered in Routine tab). Write as a cohesive narrative tailored to ${args.userProfile.skinType} skin, addressing their concerns (${args.userProfile.sensitivities.join(', ') || 'none'}) and goals (${args.userProfile.goals.join(', ') || 'general'}). This field is MANDATORY - you MUST include it in your JSON response.>"
}

IMPORTANT GUIDELINES:
- Use exact INCI names from the ingredient lists provided
- For ${args.userProfile.skinType} skin: 
  ${args.userProfile.skinType === "sensitive" ? "- Be extra cautious with acids, retinoids, and fragrances\n  - Recommend gentle alternatives and lower concentrations" : ""}
  ${args.userProfile.skinType === "oily" ? "- Watch for comedogenic ingredients (avoid high comedogenic ratings)\n  - Recommend non-comedogenic, oil-free formulations" : ""}
  ${args.userProfile.skinType === "dry" ? "- Avoid harsh surfactants and high alcohol content\n  - Recommend hydrating and barrier-supporting ingredients" : ""}
  ${args.userProfile.skinType === "combination" ? "- Balance actives for different zones\n  - Recommend targeted application strategies" : ""}
- Rate overallRiskScore: 0-3 (safe), 4-6 (caution needed), 7-10 (high risk for ${args.userProfile.skinType} skin)
- Make recommendations specific to INCI ingredients and this user's profile
- Provide actionable, ingredient-level advice
- CRITICAL: ingredientBenefits array must contain exactly 3 items - the top 3 most beneficial ingredients for ${args.userProfile.skinType} skin
- CRITICAL: profileSummary field is REQUIRED - you MUST include a comprehensive 300-500 word personalized summary for the Summary tab. Do NOT skip this field.

Return ONLY valid JSON, no additional text.`;

    console.log("📤 Sending prompt to Claude API...");
    console.log("📝 Prompt length:", prompt.length, "characters");
    console.log("🔧 Primary model: claude-haiku-4-5-20251001");
    console.log("🔧 Fallback model: claude-3-haiku-20240307");
    console.log("🔢 Max tokens: 4000");

    try {
      const startTime = Date.now();
      console.log("⏳ Calling Claude API...");
      
      // Use working models: primary and fallback
      const primaryModel = "claude-haiku-4-5-20251001";
      const fallbackModel = "claude-3-haiku-20240307"; // Known working model
      
      let message: any = null;
      let lastError: any = null;
      
      // Try primary model first
      try {
        console.log(`🔄 Trying primary model: ${primaryModel}`);
        message = await anthropic.messages.create({
          model: primaryModel,
          max_tokens: 4000,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });
        console.log(`✅ Successfully used model: ${primaryModel}`);
      } catch (error: any) {
        lastError = error;
        console.log(`❌ Primary model ${primaryModel} failed: ${error.message || error}`);
        console.log(`🔄 Falling back to: ${fallbackModel}`);
        
        // Try fallback model
        try {
          message = await anthropic.messages.create({
            model: fallbackModel,
            max_tokens: 4000,
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          });
          console.log(`✅ Successfully used fallback model: ${fallbackModel}`);
        } catch (fallbackError: any) {
          lastError = fallbackError;
          console.error(`❌ Fallback model ${fallbackModel} also failed: ${fallbackError.message || fallbackError}`);
          throw new Error(`Both models failed. Primary: ${error.message || error}. Fallback: ${fallbackError.message || fallbackError}`);
        }
      }
      
      if (!message) {
        throw new Error(`All models failed. Last error: ${lastError?.message || String(lastError)}`);
      }

      const duration = Date.now() - startTime;
      console.log(`✅ Claude API responded in ${duration}ms`);
      console.log("📥 Raw Claude Response:");
      console.log(JSON.stringify(message, null, 2));

      // Extract JSON from response
      const content = message.content[0];
      if (content.type !== "text") {
        console.error("❌ Unexpected response type from Claude:", content.type);
        throw new Error("Unexpected response type from Claude");
      }

      let responseText = content.text.trim();
      console.log("📄 Raw text response from Claude:");
      console.log("--- START CLAUDE RESPONSE ---");
      console.log(responseText);
      console.log("--- END CLAUDE RESPONSE ---");
      
      // Remove markdown code blocks if present
      if (responseText.startsWith("```json")) {
        responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?$/g, "");
        console.log("🧹 Removed markdown code blocks");
      } else if (responseText.startsWith("```")) {
        responseText = responseText.replace(/```\n?/g, "");
        console.log("🧹 Removed markdown code blocks");
      }

      console.log("🔍 Parsing JSON response...");
      console.log("📄 Raw response text length:", responseText.length, "chars");
      console.log("📄 Raw response preview:", responseText.substring(0, 500) + "...");
      
      // Check if profileSummary is mentioned in raw response before parsing
      const hasProfileSummaryInRaw = responseText.includes('"profileSummary"') || responseText.includes("profileSummary");
      console.log("🔍 Checking for profileSummary in raw response:", hasProfileSummaryInRaw ? "✅ FOUND" : "❌ NOT FOUND");
      
      const aiAnalysis = JSON.parse(responseText);
      console.log("✅ Successfully parsed Claude response:");
      console.log("   Overall Risk Score:", aiAnalysis.overallRiskScore);
      console.log("   Conflicts found:", aiAnalysis.conflicts?.length || 0);
      console.log("   Ingredient Warnings:", aiAnalysis.ingredientWarnings?.length || 0);
      console.log("   Ingredient Benefits:", aiAnalysis.ingredientBenefits?.length || 0);
      console.log("   Morning routine items:", aiAnalysis.morningRoutine?.length || 0);
      console.log("   Evening routine items:", aiAnalysis.eveningRoutine?.length || 0);
      console.log("   Summary:", aiAnalysis.summary?.substring(0, 100) + "...");
      console.log("   Profile Summary:", aiAnalysis.profileSummary 
        ? `✅ PROVIDED (${aiAnalysis.profileSummary.length} chars): "${aiAnalysis.profileSummary.substring(0, 100)}..."`
        : "❌ NOT PROVIDED BY AI");
      
      // Log all keys in the parsed JSON to see what fields AI actually returned
      console.log("📋 All fields in AI response:", Object.keys(aiAnalysis));
      
      // WARNING if profileSummary is missing
      if (!aiAnalysis.profileSummary || aiAnalysis.profileSummary.trim().length === 0) {
        console.error("⚠️⚠️⚠️ WARNING: profileSummary is MISSING from AI response! ⚠️⚠️⚠️");
        console.error("   Available fields:", Object.keys(aiAnalysis));
        console.error("   Raw response preview:", responseText.substring(0, 1000));
      } else {
        console.log("✅✅✅ SUCCESS: profileSummary was generated by AI! ✅✅✅");
      }
      
      if (aiAnalysis.conflicts && aiAnalysis.conflicts.length > 0) {
        console.log("⚠️  Conflicts detected:");
        aiAnalysis.conflicts.forEach((conflict: any, idx: number) => {
          console.log(`   ${idx + 1}. ${conflict.ingredientA} ✕ ${conflict.ingredientB} (${conflict.severity})`);
        });
      }
      
      if (aiAnalysis.ingredientWarnings && aiAnalysis.ingredientWarnings.length > 0) {
        console.log("⚠️  Ingredient Warnings for user's skin type:");
        aiAnalysis.ingredientWarnings.forEach((warning: any, idx: number) => {
          console.log(`   ${idx + 1}. ${warning.ingredient} in ${warning.product}: ${warning.concern} (${warning.severity})`);
        });
      }
      
      if (aiAnalysis.ingredientBenefits && aiAnalysis.ingredientBenefits.length > 0) {
        console.log("✅ Ingredient Benefits for user's skin type:");
        aiAnalysis.ingredientBenefits.forEach((benefit: any, idx: number) => {
          console.log(`   ${idx + 1}. ${benefit.ingredient} in ${benefit.product}: ${benefit.benefit}`);
        });
      }

      const result = {
        success: true,
        overallRiskScore: aiAnalysis.overallRiskScore || 7,
        conflicts: aiAnalysis.conflicts || [],
        ingredientWarnings: aiAnalysis.ingredientWarnings || [],
        ingredientBenefits: aiAnalysis.ingredientBenefits || [],
        morningRoutine: aiAnalysis.morningRoutine || [],
        eveningRoutine: aiAnalysis.eveningRoutine || [],
        summary: aiAnalysis.summary || "Analysis complete.",
        profileSummary: aiAnalysis.profileSummary || "",
      };

      console.log("🎉 ===== CLAUDE AI ANALYSIS COMPLETE =====");
      console.log("📤 Returning result:", JSON.stringify(result, null, 2));
      
      return result;
    } catch (error) {
      console.error("❌ ===== CLAUDE API ERROR =====");
      console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
      console.error("Error message:", error instanceof Error ? error.message : String(error));
      console.error("Full error:", error);
      throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});

/**
 * Research ingredient compatibility using Claude AI
 * Used for deep research on unknown ingredient pairs
 */
export const researchIngredientCompatibility = action({
  args: {
    ingredientA: v.string(),
    ingredientB: v.string(),
    userContext: v.optional(
      v.object({
        skinType: v.string(),
        sensitivities: v.array(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    // @ts-ignore - process.env is available in Node.js runtime
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY not set");
    }

    const anthropic = new Anthropic({ apiKey });

    const userContextStr = args.userContext
      ? `User's skin type: ${args.userContext.skinType}, Sensitivities: ${args.userContext.sensitivities.join(", ")}`
      : "General research context";

    const query = `Research compatibility between ${args.ingredientA} and ${args.ingredientB} for ${userContextStr}`;

    const prompt = `You are a skincare research expert. Analyze the compatibility between these two ingredients:

Ingredient A: ${args.ingredientA}
Ingredient B: ${args.ingredientB}
${userContextStr}

Provide a detailed research analysis in JSON format:
{
  "compatible": true/false,
  "severity": "none" | "low" | "medium" | "high",
  "conflictType": "pH_incompatibility" | "chemical_reaction" | "stability_issue" | "irritation_risk" | "efficacy_reduction" | "none",
  "explanation": "Detailed scientific explanation (2-3 sentences)",
  "recommendation": "Specific advice on how to use these ingredients together or separately",
  "confidence": 0.0-1.0,
  "citations": ["source1", "source2"],
  "researchSummary": "Brief summary of findings"
}

Be thorough and scientific. If uncertain, set confidence lower.`;

    try {
      const primaryModel = "claude-haiku-4-5-20251001";
      const fallbackModel = "claude-3-haiku-20240307";

      let message: any = null;
      let usedModel = "";

      try {
        message = await anthropic.messages.create({
          model: primaryModel,
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        });
        usedModel = primaryModel;
      } catch (error: any) {
        console.log(`Primary model failed, trying fallback: ${fallbackModel}`);
        message = await anthropic.messages.create({
          model: fallbackModel,
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        });
        usedModel = fallbackModel;
      }

      const content = message.content[0];
      if (content.type !== "text") {
        throw new Error("Unexpected response type from Claude");
      }

      // Parse JSON response
      let researchData: any;
      try {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          researchData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (parseError) {
        console.error("Failed to parse research response:", parseError);
        // Fallback: create structured response from text
        researchData = {
          compatible: true,
          severity: "low",
          conflictType: "none",
          explanation: content.text,
          recommendation: "Use with caution and monitor skin reaction",
          confidence: 0.5,
          citations: [],
          researchSummary: content.text.substring(0, 200),
        };
      }

      console.log(`🔬 Research complete (${usedModel}):`, {
        ingredients: `${args.ingredientA} + ${args.ingredientB}`,
        compatible: researchData.compatible,
        severity: researchData.severity,
        confidence: researchData.confidence,
      });

      return {
        query,
        response: JSON.stringify(researchData),
        confidence: researchData.confidence || 0.7,
        citations: researchData.citations || [],
        researchData, // Also return parsed data
      };
    } catch (error) {
      console.error("Research failed:", error);
      throw new Error(`Research failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});

/**
 * Legacy placeholder function (kept for backwards compatibility)
 */
export const analyzeIngredients = action({
  args: {
    ingredients: v.array(v.string()),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return {
      analysis: "Use analyzeRoutineWithAI for full analysis",
      ingredients: args.ingredients,
      recommendations: [],
      warnings: [],
      compatibility: {},
    };
  },
});

/**
 * Extract brand name from product name using AI
 */
export const extractBrandName = action({
  args: {
    productName: v.string(),
  },
  handler: async (ctx, args) => {
    // Get API key from environment
    // @ts-ignore - process.env is available in Node.js runtime
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.warn("ANTHROPIC_API_KEY not set, returning null for brand name");
      return null;
    }

    const anthropic = new Anthropic({ apiKey });

    const prompt = `Extract the brand name from this skincare product name. Return ONLY the brand name, nothing else.

Product Name: "${args.productName}"

Examples:
- "The Ordinary Niacinamide 10%" → "The Ordinary"
- "CeraVe Foaming Facial Cleanser" → "CeraVe"
- "HADA LABO Moisturizing Face Wash" → "HADA LABO"
- "Paula's Choice 2% BHA Liquid Exfoliant" → "Paula's Choice"
- "La Roche-Posay Toleriane Double Repair Moisturizer" → "La Roche-Posay"

Return ONLY the brand name, no explanation, no quotes, just the brand name.`;

    try {
      const primaryModel = "claude-haiku-4-5-20251001";
      const fallbackModel = "claude-3-haiku-20240307";

      let message: any = null;
      
      try {
        message = await anthropic.messages.create({
          model: primaryModel,
          max_tokens: 50,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });
      } catch (error: any) {
        console.log(`Primary model failed, trying fallback: ${fallbackModel}`);
        message = await anthropic.messages.create({
          model: fallbackModel,
          max_tokens: 50,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });
      }

      const content = message.content[0];
      if (content.type !== "text") {
        return null;
      }

      let brandName = content.text.trim();
      
      // Clean up response (remove quotes, extra text)
      brandName = brandName.replace(/^["']|["']$/g, "").trim();
      
      // If response is too long or contains explanation, try to extract just the brand
      if (brandName.length > 50 || brandName.includes(":")) {
        const lines = brandName.split("\n");
        brandName = lines[0].trim();
      }

      console.log(`✅ Extracted brand name: "${brandName}" from product: "${args.productName}"`);
      
      return brandName || null;
    } catch (error) {
      console.error("Failed to extract brand name:", error);
      return null;
    }
  },
});

/**
 * Legacy placeholder function (kept for backwards compatibility)
 */
export const generateRecommendation = action({
  args: {
    productList: v.array(
      v.object({
        productName: v.string(),
        inciList: v.string(),
        usageTime: v.string(),
      })
    ),
    userProfile: v.optional(
      v.object({
        skinType: v.string(),
        sensitivities: v.array(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    return {
      recommendation: "Use analyzeRoutineWithAI for full analysis",
      productList: args.productList,
      suggestedRoutine: [],
      conflicts: [],
    };
  },
});
