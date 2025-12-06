# Feature Request Example: Ingredient Compatibility Analyzer

**Date:** 2025-12-05
**Requested By:** Product Team
**Priority:** High

---

## 1. What do you want to build?

A web application that analyzes skincare and haircare product routines for ingredient conflicts. Users paste their product ingredient lists, and the system identifies incompatible combinations, provides personalized recommendations based on skin type, and explains the science behind each conflict using AI.

---

## 2. What problem does this solve?

**Primary Problem:**
Consumers waste money and risk skin damage by unknowingly combining incompatible active ingredients (e.g., Retinol + Vitamin C, AHAs + Retinoids). They lack the expertise to audit their own routines and generic compatibility charts don't account for individual skin types or usage timing.

**Pain Points:**
- Information overload: Thousands of ingredients, unclear interactions
- Generic advice doesn't consider skin type (oily vs. sensitive)
- No single tool combines hardcoded knowledge + AI research
- Users don't know if problems are chemical (deactivation) or dermatological (irritation)

---

## 3. Who is this for?

**Primary Users:**
- Skincare enthusiasts using 5+ products with multiple actives
- People with sensitive skin prone to irritation (rosacea, eczema, acne)
- Beauty beginners overwhelmed by ingredient complexity
- Dermatology enthusiasts who want scientific explanations

**Use Cases:**
1. **Routine Audit:** User with 8 products wants to check entire AM/PM routine for conflicts
2. **New Product:** User wants to add Retinol serum to existing routine and verify compatibility
3. **Sensitive Skin:** User with rosacea needs to identify high-risk combinations before trying
4. **Education:** User wants to understand WHY certain ingredients conflict, not just that they do

---

## 4. What are the key features?

**Must-Have (MVP):**
1. User profile setup: Skin type, sensitivities, skincare goals
2. Product input: Paste ingredient lists (INCI format), assign AM/PM usage
3. Ingredient normalization: Match raw text to canonical database names
4. Hardcoded conflict detection: Fast lookup for 20+ known conflicts (Retinol+AHA, etc.)
5. AI-powered research: Claude analyzes unknown ingredient pairs with grounding
6. Risk scoring: Visual summary (A-F grade) based on conflict severity
7. Personalized recommendations: "Use Retinol at night only, Vitamin C in morning"
8. LLM explanations: Friendly, non-technical conflict explanations

**Nice-to-Have (Future):**
- OCR scanning of product labels via camera
- Community-contributed conflict reports
- Product database integration (auto-fill ingredient lists)
- PDF export of analysis report
- Calendar integration for AM/PM reminders

---

## 5. What should it look like?

**Layout:**
- Clean, minimal dashboard with wizard-style flow
- Step 1: Profile setup (skin type cards, checkboxes for sensitivities)
- Step 2: Add products (expandable cards, large text area for ingredients)
- Step 3: Review (list of products with drag-drop reordering)
- Step 4: Results (summary score at top, conflict cards below, recommendations at bottom)

**Interaction Flow:**
1. User lands on home page, clicks "Analyze My Routine"
2. Create account (Clerk) or continue as guest
3. Select skin type (Oily/Dry/Combo/Normal/Sensitive)
4. Check sensitivity boxes (Acne-prone, Rosacea, Eczema)
5. Add first product: Name + paste ingredient list + select AM/PM/Both
6. Add more products (up to 15)
7. Click "Analyze Routine"
8. Loading screen with progress ("Analyzing product 3 of 8...")
9. Results page:
   - Large circular badge: "B+ Grade, 2 Conflicts Found"
   - Conflict cards (expandable):
     - Red border for high risk
     - "Retinol (Serum A) + L-Ascorbic Acid (Serum B)"
     - "Conflict Type: pH Incompatibility, Stability Risk"
     - Expand for LLM explanation
   - Recommendations section:
     - "1. Move Retinol to PM routine only"
     - "2. Use Vitamin C in AM routine only"
10. Export or share report (optional)

**Design References:**
- Mobbin: Health & wellness app section (clean cards, progress indicators)
- The Ordinary regimen guide: Simple conflict matrix aesthetic
- Notion: Expandable cards with smooth animations
- Linear: Color-coded priority badges

**Color Scheme:**
- Safe (Green): #10b981
- Caution (Yellow): #f59e0b
- High Risk (Red): #ef4444
- Primary brand: #6366f1 (indigo)
- Background: Clean white with subtle grays

---

## 6. What data do you need?

**Input Data:**
- User profile:
  - Skin type (enum: oily, dry, combination, normal, sensitive)
  - Sensitivities (array: acne-prone, rosacea, eczema, sensitive)
  - Goals (array: anti-aging, brightening, hydration, oil control)
- Products:
  - Product name (string)
  - Brand (optional string)
  - Raw ingredient list (INCI string, comma-separated)
  - Usage time (enum: AM, PM, both, alternate, weekly)
  - Order in routine (number)

**Output Data:**
- Analysis report:
  - Overall risk score (A-F grade)
  - Conflicts detected (array):
    - Ingredient A + Ingredient B
    - Conflict type (deactivation, irritation, pH, stability)
    - Severity (severe, critical, moderate, low)
    - LLM explanation (string)
    - Scientific basis (optional string)
  - Recommendations (array of strings):
    - Actionable advice (separate AM/PM, alternate days, etc.)
  - Timestamp

**Database Requirements:**
- **Ingredients table:** 500+ common ingredients
  - INCI name (canonical)
  - Common names (aliases)
  - Function (exfoliant, antioxidant, etc.)
  - Category (active, base, preservative)
  - Properties (pH range, irritancy score, comedogenic score)
- **Compatibility matrix:** 20+ hardcoded conflicts
  - Ingredient A ID, Ingredient B ID
  - Conflict type, severity, recommendation
  - Scientific basis, citations
- **User routines:** Saved product collections
- **Analysis results:** Historical reports
- **LLM cache:** Cached Claude responses (30-day TTL)

---

## 7. What are the technical requirements?

**Tech Stack:**
- **Frontend:** ReactJS 18, Vite (fast builds), TailwindCSS (styling)
- **Backend:** Convex (serverless functions + realtime database)
- **Database:** Convex built-in (NoSQL, TypeScript-first)
- **Authentication:** Clerk (JWT-based, social login)
- **AI:** Anthropic Claude 3.5 Sonnet (via official SDK)
- **Deployment:** Vercel (frontend auto-deploy from GitHub)

**Integrations:**
- **Clerk API:** User authentication and profile management
- **Anthropic API:** LLM for ingredient conflict research and advice generation
- **Convex Realtime:** Live updates during analysis (optional)

**Performance:**
- Initial page load: < 3 seconds
- Analysis completion: < 10 seconds (< 5s if cached)
- LLM cache hit rate: > 70% (reduce API costs)
- Time to Interactive: < 4 seconds
- Mobile responsive: Works on 320px+ screens

**Browser Support:**
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Android (latest)

---

## 8. What are the constraints?

**Budget:**
- Free tiers for all services initially
- Anthropic Claude budget: < $50/month in beta (cache aggressively)
- Convex free tier: 1GB storage, 1M function calls/month
- Clerk free tier: 10,000 monthly active users
- Vercel free tier: Unlimited bandwidth for personal projects

**Timeline:**
- MVP ready: 12 weeks (3 months)
- Beta launch: Week 10 (private beta with 50 users)
- Public launch: Week 12 (after beta feedback)

**Technical Limitations:**
- Web-only (no native mobile app in v1)
- English language only (no i18n in MVP)
- Manual ingredient input (no OCR in v1)
- Single-user analysis (no team/family accounts)

**Scope Limitations:**
- No product recommendations (only conflict analysis)
- No e-commerce integration (no affiliate links)
- No community features (no forums, reviews, etc.)
- No ingredient concentration analysis (assume standard %)
- No dermatologist consultation (disclaimer: not medical advice)

---

## 9. How will you measure success?

**Key Metrics:**
- **User Acquisition:** 500+ registered users in first month
- **Engagement:** 1,000+ routines analyzed in first month
- **Accuracy:** 95%+ conflict detection rate (verified against known conflicts)
- **Performance:** < 10s average analysis time
- **Satisfaction:** 4.5+ stars average rating (post-analysis survey)
- **Retention:** 40%+ users analyze 2+ routines

**User Feedback:**
- Post-analysis survey: "Was this helpful?" (Yes/No + optional comment)
- Feedback button: Report incorrect conflicts
- Feature requests: Vote on next features
- Beta tester interviews: 1-on-1 feedback sessions

**Business Goals:**
- Prove product-market fit (PMF)
- Build email list for future monetization
- Establish authority in skincare tech space
- Gather data to improve ingredient database

**Technical KPIs:**
- LLM cache hit rate: > 70% (cost control)
- API error rate: < 0.5%
- System uptime: > 99.5%
- Page load speed: 90+ Lighthouse score

---

## 10. What questions do you have?

- [x] **Q:** Should we build our own ingredient database or use an existing API?
  - **A:** Build our own using data from INCIDecoder, Paula's Choice, CosDNA. No good free API exists.

- [x] **Q:** Do we need authentication for MVP, or can users analyze without accounts?
  - **A:** Use Clerk auth. Allow "guest" analysis (no save), require account to save routines.

- [x] **Q:** Should we support haircare products in v1?
  - **A:** No. Focus on skincare only for MVP. Haircare in v2 if demand exists.

- [x] **Q:** What level of detail for LLM explanations?
  - **A:** Simple, 2-3 sentences, high school reading level. Avoid jargon. Link to citations for "learn more."

- [ ] **Q:** Should we show ingredient concentration (% in formula)?
  - **A:** Not in MVP (data unavailable). Assume standard concentrations.

- [ ] **Q:** How to handle unknown ingredients (not in database)?
  - **A:** Flag as "unknown," still analyze known ingredients, suggest user contact support.

---

## 11. Additional Context

**Research:**
- [Paula's Choice Ingredient Dictionary](https://www.paulaschoice.com/ingredient-dictionary) - 500+ ingredient profiles
- [The Ordinary Conflict Guide](https://theordinary.com/en-us/regimen-guide) - Simple matrix format
- [INCIDecoder](https://incidecoder.com/) - INCI name explanations
- [Reddit r/SkincareAddiction](https://www.reddit.com/r/SkincareAddiction/) - User pain points

**Competitor Analysis:**
- **SkinCarisma:** Ingredient checker but no AI, no conflict analysis
- **CosDNA:** Focuses on comedogenicity, not pairwise conflicts
- **Curology/Apostrophe:** Prescription services, not DIY analysis
- **Gap:** No one combines hardcoded knowledge + AI + personalization

**User Feedback (Informal Survey):**
- Surveyed 20 skincare enthusiasts:
  - 95% said they'd use this tool
  - 80% have experienced irritation from unknown conflicts
  - Main request: "Make it simple, not too scientific"
  - Willingness to pay: 60% would pay $5-10/month for premium features

**Technical Spikes:**
- Tested Claude API for ingredient analysis: Works well with structured prompts
- Tested Convex realtime: Smooth experience for live analysis updates
- Tested fuzzy matching for ingredient names: Levenshtein distance works for typos

**Sample Conflicts to Implement:**
1. Retinol + L-Ascorbic Acid (Vitamin C) - pH conflict, instability
2. AHA (Glycolic, Lactic) + Retinol - Over-exfoliation, high irritation
3. BHA (Salicylic Acid) + Retinol - Same as AHA
4. Vitamin C + Copper Peptides - Oxidation, deactivation
5. Niacinamide + Vitamin C - Debunked myth (actually fine), but flag for education
6. Benzoyl Peroxide + Retinol - Deactivation
7. Vitamin C + AHA/BHA - pH conflict (if same routine)

---

## Next Steps

After submitting this request:

1. ✅ AI assistant reviews and asks clarifying questions (if needed)
2. ⏳ Generate detailed PRP (Project Request Prompt)
3. ⏳ Break down into implementation phases
4. ⏳ Begin Phase 1: Project setup
5. ⏳ Iterate and track progress

---

**Submitted By:** Product Team
**Date:** 2025-12-05
