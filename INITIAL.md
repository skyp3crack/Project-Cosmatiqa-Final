# Feature Request Template

**Date:** [YYYY-MM-DD]
**Requested By:** [Your Name]
**Priority:** [Critical | High | Medium | Low]

---

## 1. What do you want to build?

[Describe the feature or functionality in 2-3 sentences]

Example:
> I want to build a skincare ingredient compatibility analyzer that checks if ingredients in my routine conflict with each other and provides personalized recommendations based on my skin type.

---

## 2. What problem does this solve?

[Explain the user pain point or business need]

Example:
> Users struggle to understand if their skincare products contain ingredients that neutralize each other or cause irritation when used together. This leads to wasted money on ineffective products and potential skin damage.

---

## 3. Who is this for?

**Primary Users:**
- [User type 1]
- [User type 2]

**Use Cases:**
- [Scenario 1]
- [Scenario 2]

Example:
> **Primary Users:**
> - Skincare enthusiasts who use 5+ products daily
> - People with sensitive skin prone to irritation
>
> **Use Cases:**
> - A user wants to add a new retinol serum to their existing routine and check for conflicts
> - A user with rosacea wants to audit their entire routine for high-risk combinations

---

## 4. What are the key features?

List the must-have features:

1. [Feature 1]
2. [Feature 2]
3. [Feature 3]

Example:
1. Ingredient list parser that normalizes INCI names
2. Conflict detection using hardcoded compatibility matrix
3. AI-powered analysis for unknown ingredient pairs
4. Personalized recommendations based on skin type
5. Visual report with risk scores and explanations

---

## 5. What should it look like?

[Describe the user interface and experience]

**Layout:**
- [Page structure]
- [Key screens]

**Interaction Flow:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Design References:**
- [Link to inspiration (Mobbin, Dribbble, etc.)]
- [Attach screenshots if available]

Example:
> **Layout:**
> - Clean, modern dashboard with a wizard-style input flow
> - Results page with color-coded conflict cards (green/yellow/red)
>
> **Interaction Flow:**
> 1. User enters skin type and concerns
> 2. User pastes ingredient lists from products
> 3. User assigns AM/PM usage times
> 4. System analyzes and shows results
> 5. User reviews recommendations and exports report
>
> **Design References:**
> - Mobbin health apps section
> - The Ordinary's regimen guide interface

---

## 6. What data do you need?

**Input Data:**
- [Data type 1]: [Description]
- [Data type 2]: [Description]

**Output Data:**
- [Data type 1]: [Description]
- [Data type 2]: [Description]

**Database Requirements:**
- [Table/collection 1]: [Purpose]
- [Table/collection 2]: [Purpose]

Example:
> **Input Data:**
> - User profile: Skin type, sensitivities, goals
> - Product ingredient lists: Raw INCI ingredient strings
> - Usage timing: AM/PM/Both/Alternate
>
> **Output Data:**
> - Conflict report: Detected conflicts with severity levels
> - Recommendations: Actionable advice for fixing routine
> - Risk score: Overall routine safety score (A-F)
>
> **Database Requirements:**
> - Ingredients table: Canonical INCI names and properties
> - Compatibility matrix: Known ingredient conflicts
> - User routines: Saved product collections
> - Analysis results: Historical reports

---

## 7. What are the technical requirements?

**Tech Stack:**
- Frontend: [Technology]
- Backend: [Technology]
- Database: [Technology]
- APIs: [External services]

**Integrations:**
- [Service 1]: [Purpose]
- [Service 2]: [Purpose]

**Performance:**
- [Requirement 1]
- [Requirement 2]

Example:
> **Tech Stack:**
> - Frontend: ReactJS with Vite
> - Backend: Convex (serverless functions + database)
> - Database: Convex built-in
> - APIs: Anthropic Claude for AI analysis
>
> **Integrations:**
> - Clerk: User authentication
> - Anthropic API: LLM-powered conflict research
> - Vercel: Deployment and hosting
>
> **Performance:**
> - Analysis completion: < 5 seconds (with cache)
> - Initial page load: < 3 seconds
> - Mobile responsive: Works on all devices

---

## 8. What are the constraints?

**Budget:**
- [Cost limits]

**Timeline:**
- [Deadline or target launch date]

**Technical Limitations:**
- [Constraint 1]
- [Constraint 2]

**Scope Limitations:**
- [What's explicitly NOT included in v1]

Example:
> **Budget:**
> - Use free tiers initially (Convex, Clerk, Vercel)
> - Claude API budget: < $50/month in early stages
>
> **Timeline:**
> - MVP ready in 12 weeks
> - Phased rollout (Beta → Public launch)
>
> **Technical Limitations:**
> - No mobile app (web only for v1)
> - English language only initially
>
> **Scope Limitations:**
> - No product recommendations (only conflict analysis)
> - No OCR/photo scanning in v1
> - No community features in v1

---

## 9. How will you measure success?

**Key Metrics:**
- [Metric 1]: [Target value]
- [Metric 2]: [Target value]

**User Feedback:**
- [What feedback to collect]

**Business Goals:**
- [Goal 1]
- [Goal 2]

Example:
> **Key Metrics:**
> - User registrations: 500+ in first month
> - Routines analyzed: 1000+ in first month
> - Analysis accuracy: 95%+ conflict detection rate
> - User satisfaction: 4.5+ stars average rating
>
> **User Feedback:**
> - Survey after analysis: "Was this helpful?"
> - Feedback form for incorrect detections
> - Feature request collection
>
> **Business Goals:**
> - Prove product-market fit
> - Build user base for future monetization
> - Establish credibility in skincare tech space

---

## 10. What questions do you have?

List any uncertainties or decisions that need to be made:

- [ ] [Question 1]
- [ ] [Question 2]
- [ ] [Question 3]

Example:
> - [ ] Should we build our own ingredient database or use an existing API?
> - [ ] Do we need Clerk authentication for MVP, or can users analyze without accounts?
> - [ ] Should we support haircare products in v1 or focus on skincare only?
> - [ ] What level of detail should LLM explanations have (scientific vs. simple)?

---

## 11. Additional Context

[Any other information that would be helpful]

- Links to research
- Competitor analysis
- User interviews or feedback
- Technical spikes or prototypes

Example:
> **Research:**
> - [Paula's Choice Ingredient Dictionary](https://www.paulaschoice.com/ingredient-dictionary)
> - [The Ordinary Conflict Guide](https://theordinary.com/en-us/regimen-guide)
>
> **Competitors:**
> - SkinCarisma: Has ingredient checker but no AI analysis
> - CosDNA: Focuses on comedogenicity, not conflicts
>
> **User Feedback:**
> - Surveyed 20 skincare enthusiasts: 95% said they'd use this tool
> - Main request: "Make it simple, not too scientific"

---

## Next Steps

After submitting this request:

1. AI assistant will review and ask clarifying questions
2. A detailed PRP (Project Request Prompt) will be generated
3. Implementation will begin phase by phase
4. Progress will be tracked and updated regularly

---

**Submitted By:** [Your Name]
**Date:** [YYYY-MM-DD]
