# Compatibility Matrix Table Guide

## 📊 Table Schema

The `compatibilityMatrix` table stores known ingredient conflicts. Here are all available columns:

### Columns (Fields)

| Column Name | Type | Required | Description |
|-------------|------|----------|-------------|
| `ingredientAId` | `Id<"ingredients">` | ✅ Yes | Reference to first ingredient |
| `ingredientBId` | `Id<"ingredients">` | ✅ Yes | Reference to second ingredient |
| `conflictType` | `string` | ✅ Yes | Type of conflict (e.g., "pH Conflict", "High Irritation", "Deactivation") |
| `severity` | `string` | ✅ Yes | Severity level: `"critical"`, `"severe"`, `"moderate"`, `"low"` |
| `recommendation` | `string` | ✅ Yes | What user should do (e.g., "Use separately - Retinol at night, Vitamin C in morning") |
| `scientificBasis` | `string` | ❌ Optional | Scientific explanation of the conflict |

### Indexes

- `by_ingredientA` - Find conflicts where ingredient A is involved
- `by_ingredientB` - Find conflicts where ingredient B is involved  
- `by_pair` - Find specific conflict between two ingredients (both directions checked)

---

## 🔧 How to Fill/Populate the Table

### Method 1: Using Seed Function (Recommended)

**Run the seed function:**

```bash
cd Backend
npx convex run functions/seed:seedCompatibilityMatrix
```

This will populate **21 known conflicts** from the seed data.

**What it does:**
- Checks if ingredients exist in database
- Checks if conflict already exists (both directions)
- Inserts new conflicts
- Returns: `{ added: X, skipped: Y, total: 21 }`

---

### Method 2: Add Conflicts Manually via Convex Dashboard

1. Go to Convex Dashboard → `compatibilityMatrix` table
2. Click "Add Row"
3. Fill in:
   - `ingredientAId`: Select ingredient ID (e.g., Retinol)
   - `ingredientBId`: Select ingredient ID (e.g., L-Ascorbic Acid)
   - `conflictType`: e.g., "pH Conflict, Stability Risk"
   - `severity`: "critical" | "severe" | "moderate" | "low"
   - `recommendation`: e.g., "Use separately - Retinol at night, Vitamin C in morning"
   - `scientificBasis`: (optional) Scientific explanation

---

### Method 3: Create a Custom Mutation

Create a new mutation in `Backend/convex/functions/`:

```typescript
import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const addConflict = mutation({
  args: {
    ingredientA: v.string(), // INCI name
    ingredientB: v.string(), // INCI name
    conflictType: v.string(),
    severity: v.string(),
    recommendation: v.string(),
    scientificBasis: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get ingredient IDs
    const ingA = await ctx.db
      .query("ingredients")
      .withIndex("by_inciName", (q) => q.eq("inciName", args.ingredientA))
      .first();
    
    const ingB = await ctx.db
      .query("ingredients")
      .withIndex("by_inciName", (q) => q.eq("inciName", args.ingredientB))
      .first();

    if (!ingA || !ingB) {
      throw new Error("One or both ingredients not found");
    }

    // Check if conflict already exists
    const existing = await ctx.db
      .query("compatibilityMatrix")
      .withIndex("by_pair", (q) =>
        q.eq("ingredientAId", ingA._id).eq("ingredientBId", ingB._id)
      )
      .first();

    if (existing) {
      throw new Error("Conflict already exists");
    }

    // Insert conflict
    await ctx.db.insert("compatibilityMatrix", {
      ingredientAId: ingA._id,
      ingredientBId: ingB._id,
      conflictType: args.conflictType,
      severity: args.severity,
      recommendation: args.recommendation,
      scientificBasis: args.scientificBasis,
    });

    return { success: true };
  },
});
```

**Then run:**
```bash
npx convex run functions/yourFile:addConflict --args '{"ingredientA": "Retinol", "ingredientB": "Benzoyl Peroxide", "conflictType": "Deactivation", "severity": "critical", "recommendation": "Never use together"}'
```

---

## 📝 Example Conflict Entry

```json
{
  "ingredientAId": "j570bnzfg2ejhb7ph93d7t4tps7ws1zn",  // Retinol ID
  "ingredientBId": "k123abc456def789ghi012jkl345mno",  // L-Ascorbic Acid ID
  "conflictType": "pH Conflict, Stability Risk",
  "severity": "severe",
  "recommendation": "Use separately - Retinol at night, Vitamin C in morning. Wait 30 minutes between applications.",
  "scientificBasis": "Retinol works best at pH 5.5-6.5, while L-Ascorbic Acid requires pH 2.5-3.5. Using together can deactivate both ingredients."
}
```

---

## 🎯 Severity Levels

| Severity | Meaning | Example |
|----------|---------|---------|
| `"critical"` | Never use together, dangerous | Retinol + Benzoyl Peroxide |
| `"severe"` | High risk, avoid combining | Retinol + Glycolic Acid |
| `"moderate"` | Some risk, use carefully | Glycolic Acid + Salicylic Acid |
| `"low"` | Minor concern, usually safe | Niacinamide + L-Ascorbic Acid |

---

## 🔍 Conflict Types

Common conflict types:
- `"pH Conflict"` - Different pH requirements
- `"High Irritation"` - Can cause excessive irritation
- `"Deactivation"` - One ingredient deactivates the other
- `"Stability Risk"` - May reduce effectiveness
- `"Synergy"` - Actually work well together (low severity)

---

## 📊 Current Seed Data

The `seedCompatibilityMatrix` function includes **21 conflicts**:

1. Retinol ✕ L-Ascorbic Acid (severe)
2. Retinol ✕ Glycolic Acid (severe)
3. Retinol ✕ Salicylic Acid (severe)
4. Retinol ✕ Benzoyl Peroxide (critical)
5. L-Ascorbic Acid ✕ Copper Peptides (moderate)
6. Niacinamide ✕ L-Ascorbic Acid (low)
7. Glycolic Acid ✕ Salicylic Acid (moderate)
8. Tretinoin ✕ Benzoyl Peroxide (critical)
9. Adapalene ✕ Benzoyl Peroxide (critical)
10. Retinol ✕ Lactic Acid (moderate)
11. Glycolic Acid ✕ L-Ascorbic Acid (moderate)
12. Salicylic Acid ✕ Benzoyl Peroxide (moderate)
13. Tretinoin ✕ Salicylic Acid (severe)
14. Tretinoin ✕ Glycolic Acid (severe)
15. Azelaic Acid ✕ L-Ascorbic Acid (low)
16. Retinol ✕ Mandelic Acid (low)
17. Niacinamide ✕ Glycolic Acid (low)
18. Niacinamide ✕ Salicylic Acid (low)
19. Alpha Arbutin ✕ L-Ascorbic Acid (low - synergy)
20. Ferulic Acid ✕ L-Ascorbic Acid (low - synergy)
21. Vitamin E ✕ L-Ascorbic Acid (low - synergy)

---

## 🚀 Quick Start

**To populate the table:**

```bash
cd Backend
npx convex run functions/seed:seedCompatibilityMatrix
```

**To check what's in the table:**

Go to Convex Dashboard → `compatibilityMatrix` table

**To add more conflicts:**

Use Method 2 (Dashboard) or Method 3 (Custom Mutation) above.

---

## 💡 Tips

1. **Bidirectional**: The system checks both A→B and B→A, so you only need to add one direction
2. **Ingredient IDs**: Make sure ingredients exist in `ingredients` table first
3. **Avoid Duplicates**: The seed function checks for existing conflicts before adding
4. **Use INCI Names**: When adding manually, use the exact INCI name from the ingredients table

---

## 🔗 Related Functions

- `seedCompatibilityMatrix` - Populates initial conflicts
- `checkConflict` (in helpers.ts) - Checks if conflict exists between two ingredients
- `getIngredientConflicts` (in helpers.ts) - Gets all conflicts for an ingredient





