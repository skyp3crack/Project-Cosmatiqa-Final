# Implementation Plan: LLM-Enhanced Ingredient Compatibility Analyzer

## Project Overview
A sophisticated skincare/haircare ingredient compatibility analyzer that uses Claude AI to provide personalized routine auditing and recommendations.

## Tech Stack

### Frontend
- **ReactJS** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Query** - Data fetching/caching
- **Zustand** - State management

### Backend
- **Convex** - Backend-as-a-Service (realtime database, functions, file storage)
- **Anthropic Claude API** - LLM for grounded search and personalized advice

### Authentication
- **Clerk** - User authentication and management

### Deployment
- **Vercel** - Frontend hosting and deployment

### Design Reference
- **Mobbin** - UI/UX design inspiration

### AI Integration
- **Lean MCP (Model Context Protocol)** - For structured AI interactions
- **Anthropic SDK** - Claude API integration

---

## Phase 1: Project Setup & Infrastructure

### 1.1 Initialize Project Structure

```
skincare-analyzer/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── forms/           # Form components
│   │   ├── reports/         # Report display components
│   │   └── layout/          # Layout components
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Analysis.jsx
│   │   ├── Results.jsx
│   │   └── Dashboard.jsx
│   ├── hooks/               # Custom React hooks
│   ├── utils/
│   │   ├── ingredient-parser.js
│   │   ├── risk-calculator.js
│   │   └── formatters.js
│   ├── constants/
│   │   ├── skin-types.js
│   │   └── conflict-types.js
│   ├── store/               # Zustand stores
│   └── lib/
│       ├── convex.js        # Convex client setup
│       └── anthropic.js     # Claude API wrapper
├── convex/
│   ├── schema.ts            # Database schema
│   ├── ingredients.ts       # Ingredient queries/mutations
│   ├── analysis.ts          # Analysis functions
│   ├── compatibility.ts     # Compatibility matrix logic
│   └── claude.ts            # Claude AI integration
├── public/
└── package.json
```

### 1.2 Environment Setup

**Tools to Install:**
- Node.js (v18+)
- npm/yarn/pnpm
- Convex CLI
- Git

**Create `.env.local`:**
```env
# Convex
VITE_CONVEX_URL=

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Anthropic Claude
ANTHROPIC_API_KEY=

# Deployment
VERCEL_TOKEN=
```

### 1.3 Initialize Technologies

**Commands:**
```bash
# Initialize React + Vite
npm create vite@latest skincare-analyzer -- --template react

# Install core dependencies
npm install convex @clerk/clerk-react @anthropic-ai/sdk
npm install @tanstack/react-query zustand
npm install tailwindcss postcss autoprefixer
npm install lucide-react clsx tailwind-merge

# Initialize Convex
npx convex dev

# Initialize Clerk
npm install @clerk/clerk-react
```

---

## Phase 2: Database Schema & Core Data (Convex)

### 2.1 Convex Schema Design

**File: `convex/schema.ts`**

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users Profile Extension
  userProfiles: defineTable({
    userId: v.string(), // Clerk user ID
    skinType: v.union(
      v.literal("oily"),
      v.literal("dry"),
      v.literal("combination"),
      v.literal("normal"),
      v.literal("sensitive")
    ),
    sensitivities: v.array(v.string()), // ["acne-prone", "rosacea", "eczema"]
    goals: v.array(v.string()), // ["anti-aging", "brightening", "hydration"]
    hairType: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  // Master Ingredients Database
  ingredients: defineTable({
    inciName: v.string(), // Canonical INCI name
    commonNames: v.array(v.string()), // Alternative names
    function: v.string(), // "Antioxidant", "Exfoliant", etc.
    category: v.union(
      v.literal("active"),
      v.literal("base"),
      v.literal("preservative"),
      v.literal("fragrance")
    ),
    description: v.optional(v.string()),
    isActive: v.boolean(), // Is it an active ingredient?
    createdAt: v.number(),
  })
    .index("by_inciName", ["inciName"])
    .searchIndex("search_ingredients", {
      searchField: "inciName",
      filterFields: ["category", "isActive"],
    }),

  // Ingredient Properties
  ingredientProperties: defineTable({
    ingredientId: v.id("ingredients"),
    phRangeMin: v.optional(v.number()),
    phRangeMax: v.optional(v.number()),
    irritancyScore: v.number(), // 0-5
    comedogenicScore: v.number(), // 0-5
    isHarmful: v.boolean(),
    photosensitizing: v.boolean(),
    pregnancySafe: v.boolean(),
  }).index("by_ingredientId", ["ingredientId"]),

  // Compatibility Matrix (Hardcoded Knowledge Base)
  compatibilityMatrix: defineTable({
    ingredientAId: v.id("ingredients"),
    ingredientBId: v.id("ingredients"),
    conflictType: v.union(
      v.literal("deactivation"),
      v.literal("high_irritation"),
      v.literal("stability_risk"),
      v.literal("ph_conflict")
    ),
    severity: v.union(
      v.literal("severe"),
      v.literal("critical"),
      v.literal("moderate"),
      v.literal("low")
    ),
    recommendation: v.string(),
    scientificBasis: v.optional(v.string()),
    citations: v.optional(v.array(v.string())),
  })
    .index("by_ingredientA", ["ingredientAId"])
    .index("by_ingredientB", ["ingredientBId"])
    .index("by_pair", ["ingredientAId", "ingredientBId"]),

  // User Product Routines
  routines: defineTable({
    userId: v.string(),
    name: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  // Products in Routine
  products: defineTable({
    routineId: v.id("routines"),
    productName: v.string(),
    brandName: v.optional(v.string()),
    rawInciList: v.string(), // Full ingredient list
    usageTime: v.union(
      v.literal("AM"),
      v.literal("PM"),
      v.literal("both"),
      v.literal("alternate"),
      v.literal("weekly")
    ),
    orderInRoutine: v.number(),
    createdAt: v.number(),
  }).index("by_routineId", ["routineId"]),

  // Product Ingredients (Normalized)
  productIngredients: defineTable({
    productId: v.id("products"),
    ingredientId: v.id("ingredients"),
    position: v.number(), // Position in ingredient list
    concentration: v.optional(v.number()),
  })
    .index("by_productId", ["productId"])
    .index("by_ingredientId", ["ingredientId"]),

  // Analysis Results
  analysisResults: defineTable({
    userId: v.string(),
    routineId: v.id("routines"),
    overallRiskScore: v.union(
      v.literal("safe"),
      v.literal("caution"),
      v.literal("high_risk")
    ),
    summaryScore: v.string(), // "A+", "B", "C", etc.
    conflictsFound: v.number(),
    analysisData: v.string(), // JSON stringified detailed analysis
    recommendations: v.array(v.string()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_routineId", ["routineId"]),

  // Detected Conflicts
  detectedConflicts: defineTable({
    analysisId: v.id("analysisResults"),
    productAId: v.id("products"),
    productBId: v.id("products"),
    ingredientAId: v.id("ingredients"),
    ingredientBId: v.id("ingredients"),
    conflictType: v.string(),
    severity: v.string(),
    explanation: v.string(), // LLM-generated or hardcoded
    recommendation: v.string(),
    isTemporalConflict: v.boolean(), // Same AM/PM timing
  }).index("by_analysisId", ["analysisId"]),

  // LLM Research Cache
  llmResearchCache: defineTable({
    ingredientPairHash: v.string(), // Hash of ingredient pair
    query: v.string(),
    claudeResponse: v.string(),
    confidence: v.number(),
    citations: v.array(v.string()),
    createdAt: v.number(),
    expiresAt: v.number(), // Cache TTL
  }).index("by_pairHash", ["ingredientPairHash"]),
});
```

### 2.2 Seed Hardcoded Compatibility Matrix

**File: `convex/seed.ts`**

Create initial data for common ingredient conflicts:
- Retinol + Vitamin C (L-Ascorbic Acid)
- AHA/BHA + Retinol
- Niacinamide + Vitamin C (outdated but common belief)
- Vitamin C + Copper Peptides
- Benzoyl Peroxide + Retinol
- AHAs + Direct Acids

### 2.3 Ingredient Database Population

**Sources for Data:**
- INCIDecoder
- CosDNA
- Paula's Choice Ingredient Dictionary
- The Ordinary Conflict Guide
- Clinical dermatology papers

---

## Phase 3: Backend Logic (Convex Functions)

### 3.1 Ingredient Processing Functions

**File: `convex/ingredients.ts`**

```typescript
// Key Functions:
- normalizeIngredient(rawName: string): Match to canonical INCI
- parseInciList(rawList: string): Extract and normalize all ingredients
- findIngredientByName(name: string): Fuzzy search
- getIngredientProperties(ingredientId: Id): Fetch properties
```

### 3.2 Compatibility Check Engine

**File: `convex/compatibility.ts`**

```typescript
// Core Analysis Functions:
- checkPairwiseConflicts(ingredientIds: Id[]): Matrix lookup
- checkTemporalConflicts(products: Product[]): AM/PM conflicts
- calculateIndividualRisk(ingredientId: Id, userProfile: UserProfile)
- calculateRoutineRiskScore(conflicts: Conflict[]): Overall score
```

### 3.3 Claude AI Integration

**File: `convex/claude.ts`**

```typescript
import Anthropic from "@anthropic-ai/sdk";

// Functions:
- searchIngredientConflict(ingredientA: string, ingredientB: string)
  // Use Claude with grounding for unknown ingredient pairs

- generatePersonalizedAdvice(conflict: Conflict, userProfile: UserProfile)
  // Generate friendly, personalized explanations

- extractIngredientInfo(rawText: string)
  // Help parse messy ingredient lists using Claude
```

**MCP Integration:**
Use structured prompts with Lean MCP principles:
```typescript
const prompt = `You are a cosmetic chemistry expert. Analyze this ingredient pair:

Ingredient A: ${ingredientA}
Ingredient B: ${ingredientB}

User Context:
- Skin Type: ${userProfile.skinType}
- Sensitivities: ${userProfile.sensitivities.join(", ")}

Task: Determine if these ingredients conflict when used together.
Provide:
1. Conflict type (if any)
2. Severity level
3. Scientific explanation
4. Usage recommendation
5. Citations (if available)

Format response as JSON.`;
```

### 3.4 Analysis Orchestration

**File: `convex/analysis.ts`**

```typescript
// Main Analysis Flow:
export const analyzeRoutine = mutation({
  args: { routineId: v.id("routines") },
  handler: async (ctx, { routineId }) => {
    // 1. Fetch routine and products
    // 2. Normalize all ingredients
    // 3. Run compatibility checks
    // 4. Check LLM cache or call Claude for unknowns
    // 5. Calculate risk scores
    // 6. Generate recommendations
    // 7. Save analysis results
    // 8. Return report data
  },
});
```

---

## Phase 4: Frontend Development (React)

### 4.1 Core Pages

**1. Home/Landing Page (`pages/Home.jsx`)**
- Value proposition
- How it works
- CTA to start analysis
- Design inspiration from Mobbin

**2. Profile Setup (`pages/ProfileSetup.jsx`)**
- Skin type selection
- Sensitivity checkboxes
- Goals multi-select
- Wizard-style UX

**3. Routine Input (`pages/RoutineInput.jsx`)**
- Multi-product form
- Ingredient list paste area
- AM/PM toggle
- Product order management
- Auto-save drafts

**4. Analysis Processing (`pages/Analysis.jsx`)**
- Loading states with progress indicators
- "Analyzing X of Y products"
- Real-time updates via Convex reactivity

**5. Results Dashboard (`pages/Results.jsx`)**
- Summary score badge
- Risk breakdown chart
- Conflict cards with expand/collapse
- Actionable recommendations
- Export/share options

### 4.2 Key Components

**Profile Form (`components/forms/ProfileForm.jsx`)**
```jsx
- SkinTypeSelector
- SensitivityCheckboxGroup
- GoalsMultiSelect
```

**Product Input (`components/forms/ProductInput.jsx`)**
```jsx
- ProductCard
- InciListTextarea with paste detection
- UsageTimeSelector (AM/PM/Both)
- DragDropReorder for routine order
```

**Results Display (`components/reports/ResultsDisplay.jsx`)**
```jsx
- SummaryScoreBadge (Green/Yellow/Red)
- ConflictCard (expand for details)
- RecommendationList
- IngredientBreakdown (color-coded risk tags)
```

**Conflict Explanation (`components/reports/ConflictCard.jsx`)**
```jsx
- Ingredient pair display
- Conflict type badge
- LLM-generated explanation
- Recommendation actions
- Citations/sources
```

### 4.3 State Management (Zustand)

**File: `src/store/useAnalysisStore.js`**

```javascript
import { create } from 'zustand';

export const useAnalysisStore = create((set) => ({
  currentRoutine: null,
  products: [],
  analysisResults: null,
  isAnalyzing: false,

  addProduct: (product) => set((state) => ({
    products: [...state.products, product]
  })),

  removeProduct: (productId) => set((state) => ({
    products: state.products.filter(p => p.id !== productId)
  })),

  setAnalysisResults: (results) => set({ analysisResults: results }),

  resetAnalysis: () => set({
    currentRoutine: null,
    products: [],
    analysisResults: null,
    isAnalyzing: false,
  }),
}));
```

### 4.4 Custom Hooks

**`hooks/useIngredientParser.js`**
```javascript
// Parse pasted ingredient lists
// Detect INCI format
// Clean and normalize text
```

**`hooks/useRoutineAnalysis.js`**
```javascript
// Trigger Convex analysis mutation
// Handle loading states
// Process results
```

**`hooks/useConflictExplanation.js`**
```javascript
// Fetch LLM explanation for conflict
// Cache results
// Handle retries
```

---

## Phase 5: Authentication (Clerk)

### 5.1 Clerk Setup

**File: `src/main.jsx`**
```jsx
import { ClerkProvider } from '@clerk/clerk-react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { Convex } from 'convex/react';

<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
  <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
    <App />
  </ConvexProviderWithClerk>
</ClerkProvider>
```

### 5.2 Protected Routes

- Dashboard (saved routines)
- Analysis history
- Profile settings

### 5.3 User Sync with Convex

**File: `convex/users.ts`**
```typescript
// Sync Clerk user to Convex userProfiles table
export const syncUser = internalMutation({
  handler: async (ctx, { userId, ...userData }) => {
    // Create or update user profile
  },
});
```

---

## Phase 6: AI Integration Strategy

### 6.1 Hardcoded Matrix (Fast Path)

**When to Use:**
- Common ingredient pairs (Retinol + Vitamin C)
- Well-established conflicts
- High-confidence data

**Benefit:** Instant results, no API cost

### 6.2 Claude LLM Search (Dynamic Path)

**When to Use:**
- Unknown ingredient pairs
- Niche/emerging ingredients
- User-specific context needed

**Implementation:**
```typescript
// Convex action (can call external APIs)
export const searchConflictWithClaude = action({
  args: {
    ingredientA: v.string(),
    ingredientB: v.string(),
    userContext: v.object({...}),
  },
  handler: async (ctx, args) => {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: buildSearchPrompt(args),
      }],
    });

    // Parse response
    // Cache result in llmResearchCache table
    // Return structured data
  },
});
```

### 6.3 LLM Advice Generation

**Personalized Explanations:**
```typescript
export const generateAdvice = action({
  args: {
    conflict: v.object({...}),
    userProfile: v.object({...}),
  },
  handler: async (ctx, args) => {
    const prompt = `
You are a friendly skincare expert. Explain this ingredient conflict to a user:

Conflict: ${args.conflict.ingredientA} + ${args.conflict.ingredientB}
Type: ${args.conflict.conflictType}
User's Skin: ${args.userProfile.skinType}, ${args.userProfile.sensitivities}

Provide:
1. Simple explanation (2-3 sentences, no jargon)
2. Why it matters for THEIR skin type
3. Specific fix (what to do differently)

Tone: Warm, helpful, not alarmist.
    `;

    const response = await callClaude(prompt);
    return response;
  },
});
```

### 6.4 Caching Strategy

**LLM Cache Table:**
- Cache Claude responses for 30 days
- Hash ingredient pairs for quick lookup
- Reduce API costs
- Improve response time

---

## Phase 7: UI/UX Design (Mobbin-Inspired)

### 7.1 Design System

**Color Palette:**
```css
:root {
  /* Risk Colors */
  --safe-green: #10b981;
  --caution-yellow: #f59e0b;
  --high-risk-red: #ef4444;

  /* Brand */
  --primary: #6366f1;
  --secondary: #8b5cf6;

  /* Neutrals */
  --bg: #ffffff;
  --surface: #f9fafb;
  --text: #111827;
  --text-muted: #6b7280;
}
```

**Typography:**
- Headings: Inter (bold, semi-bold)
- Body: Inter (regular)
- Monospace (ingredient lists): JetBrains Mono

### 7.2 Key UI Patterns

**Summary Score Badge:**
```jsx
<div className="relative">
  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
    <span className="text-4xl font-bold text-white">A+</span>
  </div>
  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
    <span className="bg-white px-3 py-1 rounded-full text-sm font-medium shadow">
      Safe Routine
    </span>
  </div>
</div>
```

**Conflict Card:**
```jsx
<div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
  <div className="flex items-start justify-between">
    <div>
      <h4 className="font-semibold text-red-900">
        Retinol + Vitamin C (L-Ascorbic Acid)
      </h4>
      <p className="text-sm text-red-800 mt-1">
        pH Conflict, Stability Risk
      </p>
    </div>
    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
      HIGH
    </span>
  </div>
  <p className="text-sm text-red-700 mt-3">
    {llmExplanation}
  </p>
  <button className="mt-3 text-sm font-medium text-red-600 hover:text-red-700">
    View Recommendation →
  </button>
</div>
```

**Ingredient Tag:**
```jsx
<span className={`
  inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
  ${risk === 'safe' ? 'bg-green-100 text-green-800' : ''}
  ${risk === 'moderate' ? 'bg-yellow-100 text-yellow-800' : ''}
  ${risk === 'high' ? 'bg-red-100 text-red-800' : ''}
`}>
  Retinol
  {risk === 'high' && <XCircle className="ml-1 h-3 w-3" />}
</span>
```

### 7.3 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly buttons (min 44x44px)
- Swipeable conflict cards on mobile

### 7.4 Accessibility

- ARIA labels for dynamic content
- Keyboard navigation
- Screen reader announcements for analysis progress
- High contrast mode support

---

## Phase 8: Deployment & DevOps

### 8.1 Vercel Deployment

**Setup:**
1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Configure build settings:
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

**Preview Deployments:**
- Automatic preview for each PR
- Test before merging to main

### 8.2 Convex Deployment

**Production Setup:**
```bash
npx convex deploy --prod
```

**Environment Variables:**
- Set `ANTHROPIC_API_KEY` in Convex dashboard
- Configure production Clerk keys

### 8.3 Monitoring

**Tools:**
- Vercel Analytics (performance)
- Convex Dashboard (function logs)
- Sentry (error tracking)

**Key Metrics:**
- Analysis completion rate
- LLM cache hit rate
- Average analysis time
- Error rates

---

## Phase 9: Testing Strategy

### 9.1 Unit Tests

**Tools:** Vitest

**Test Coverage:**
- Ingredient normalization logic
- Risk score calculations
- Conflict detection algorithms

### 9.2 Integration Tests

**Test Scenarios:**
- Complete analysis flow
- LLM fallback when cache misses
- User profile creation and update

### 9.3 E2E Tests

**Tools:** Playwright

**Critical Paths:**
1. Sign up → Create profile → Add routine → View results
2. Conflict detection accuracy
3. Recommendation generation

### 9.4 Manual Testing

**Test Cases:**
- Known conflict pairs (Retinol + Vitamin C)
- Edge cases (empty ingredient lists, special characters)
- Mobile responsiveness
- Different skin types

---

## Phase 10: Advanced Features (Future Enhancements)

### 10.1 Product Scanning

**OCR Integration:**
- Camera scan ingredient lists
- Auto-populate product data
- Use Google Vision API or Tesseract.js

### 10.2 Community Features

**User-Generated Content:**
- Share routines
- Rate analyses
- Community conflict reports

### 10.3 Product Database

**Integration:**
- CosDNA API
- SkinCarisma data
- Pre-populated product library

### 10.4 Advanced AI Features

**Enhanced Claude Integration:**
- Multi-step reasoning for complex routines
- Seasonal routine adjustments
- Ingredient concentration estimation from position

### 10.5 Export & Sharing

**Features:**
- PDF report generation
- Shareable routine links
- Calendar integration (AM/PM reminders)

---

## Implementation Timeline

### Sprint 1 (Week 1-2): Foundation
- [ ] Project setup (React + Vite)
- [ ] Convex schema design
- [ ] Clerk authentication
- [ ] Basic UI shell

### Sprint 2 (Week 3-4): Core Backend
- [ ] Ingredient database seeding
- [ ] Compatibility matrix implementation
- [ ] Normalization logic
- [ ] Conflict detection engine

### Sprint 3 (Week 5-6): AI Integration
- [ ] Claude API integration
- [ ] LLM search function
- [ ] Advice generation
- [ ] Caching layer

### Sprint 4 (Week 7-8): Frontend UX
- [ ] Profile setup flow
- [ ] Routine input interface
- [ ] Results dashboard
- [ ] Conflict cards and recommendations

### Sprint 5 (Week 9-10): Polish & Testing
- [ ] UI refinement (Mobbin patterns)
- [ ] E2E testing
- [ ] Performance optimization
- [ ] Mobile responsive fixes

### Sprint 6 (Week 11-12): Launch
- [ ] Production deployment
- [ ] Monitoring setup
- [ ] Documentation
- [ ] Beta user testing

---

## Development Best Practices

### Code Organization
- Feature-based folder structure
- Shared components in `components/ui`
- Reusable hooks in `hooks/`
- Constants and config in dedicated files

### Convex Best Practices
- Use queries for reads (reactive)
- Use mutations for writes
- Use actions for external API calls (Claude)
- Optimize indexes for common queries

### React Best Practices
- Component composition over prop drilling
- Custom hooks for reusable logic
- Error boundaries for graceful failures
- Lazy loading for large components

### AI Integration Best Practices
- Always cache LLM responses
- Implement fallbacks for API failures
- Use structured prompts (MCP principles)
- Monitor token usage and costs

---

## Cost Estimation

### API Costs
- **Anthropic Claude:** ~$0.003/analysis (with caching)
- **Clerk:** Free tier (10K MAU)
- **Convex:** Free tier initially, ~$25/month at scale
- **Vercel:** Free tier (hobbyist projects)

### Optimization Strategies
- Aggressive LLM caching (30-day TTL)
- Hardcoded matrix for 80% of cases
- Batch ingredient normalization
- Rate limiting on analysis requests

---

## Security Considerations

### Data Protection
- Encrypt ingredient lists in transit (HTTPS)
- Hash LLM cache keys
- GDPR compliance (user data deletion)

### API Security
- Rate limiting on Convex functions
- Clerk JWT validation
- Environment variable protection
- Input sanitization for ingredient lists

### User Privacy
- No sharing of personal routine data
- Anonymous analytics only
- Clear privacy policy

---

## Success Metrics

### Product KPIs
- User registrations
- Routines analyzed
- Conflicts detected per analysis
- Recommendation acceptance rate

### Technical KPIs
- Analysis completion time < 5s
- LLM cache hit rate > 70%
- System uptime > 99.5%
- Error rate < 0.5%

### User Satisfaction
- NPS score
- User feedback ratings
- Feature request volume
- Retention rate (30-day)

---

## Next Steps

1. **Review this plan** and adjust priorities
2. **Set up development environment** (Convex, Clerk, Vercel accounts)
3. **Create project repository** and initialize with this structure
4. **Begin Sprint 1** with foundation setup
5. **Populate ingredient database** with initial hardcoded conflicts
6. **Design mockups** using Mobbin inspiration
7. **Implement Phase 1** (User Input) frontend
8. **Build Phase 2** (Processing) backend logic
9. **Integrate Claude AI** for dynamic conflict search
10. **Test and iterate** with real skincare routines

---

## Resources & References

### Documentation
- [Convex Docs](https://docs.convex.dev/)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [Clerk Docs](https://clerk.com/docs)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://docs.pmnd.rs/zustand/)

### Design Inspiration
- [Mobbin](https://mobbin.com/) - UI patterns
- [Dribbble](https://dribbble.com/) - Health/wellness apps
- [The Ordinary](https://theordinary.com/) - Skincare guidance UX

### Ingredient Data Sources
- [INCIDecoder](https://incidecoder.com/)
- [CosDNA](https://www.cosdna.com/)
- [Paula's Choice Ingredient Dictionary](https://www.paulaschoice.com/ingredient-dictionary)
- [The Ordinary Regimen Guide](https://theordinary.com/en-us/regimen-guide)

### Scientific Resources
- PubMed for dermatology research
- Journal of Cosmetic Dermatology
- International Journal of Cosmetic Science

---

## Questions to Resolve

1. **Ingredient Database:** Use external API or build custom?
2. **LLM Model:** Claude 3.5 Sonnet vs Haiku for cost optimization?
3. **Mobile App:** Future React Native version?
4. **Monetization:** Freemium model, ads, or fully free?
5. **Product Photos:** Allow image upload for OCR?

---

**Ready to build!** Let me know which phase you'd like to start with, and I'll help implement it step by step.
