# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Ingredient Compatibility Analyzer - PRP System

A structured project management system using **Project Request Prompts (PRPs)** to build an LLM-enhanced skincare ingredient compatibility analyzer.

## 🎯 Project Overview

This project helps users analyze their skincare routines for ingredient conflicts using:

-   **Hardcoded compatibility matrix** for instant conflict detection
-   **Claude AI** for researching unknown ingredient pairs
-   **Personalized recommendations** based on skin type and usage timing

**Tech Stack:** ReactJS, Convex, Claude AI (Anthropic), Clerk, Vercel

---

## 📁 Project Structure

```
.
├── .claude/
│   ├── commands/
│   │   ├── generate-prp.md       # Creates PRPs from feature requests
│   │   └── execute-prp.md        # Implements PRPs step-by-step
│   └── settings.local.json       # Claude Code permissions
│
├── PRPs/
│   ├── templates/
│   │   └── prp_base.md          # Base template for all PRPs
│   └── PRP-001_Ingredient_Analyzer_Foundation.md  # Main PRP
│
├── examples/                     # Code examples (to be added)
│
├── CLAUDE.md                    # Global AI assistant rules
├── INITIAL.md                   # Template for feature requests
├── INITIAL_EXAMPLE.md           # Example filled feature request
├── IMPLEMENTATION_PLAN.md       # Original detailed plan
└── README.md                    # This file
```

---

## 🚀 Getting Started

### 1. Submit a Feature Request

Copy `INITIAL.md` and fill in your feature requirements:

```bash
cp INITIAL.md MY_FEATURE.md
# Edit MY_FEATURE.md with your requirements
```

See `INITIAL_EXAMPLE.md` for a complete example.

### 2. Generate a PRP

Use the Claude command to generate a detailed implementation plan:

```
/generate-prp from MY_FEATURE.md
```

This creates a comprehensive PRP in `PRPs/PRP-XXX_FeatureName.md` with:

-   Technical design and architecture
-   Database schema and data models
-   Implementation phases with tasks
-   Testing strategy
-   Deployment plan

### 3. Execute the PRP

Implement the feature phase-by-phase:

```
/execute-prp PRP-XXX start from Phase 1
```

The AI assistant will:

-   Implement tasks sequentially
-   Write code following best practices
-   Test as it goes
-   Update the PRP with progress
-   Mark tasks complete

---

## 📋 PRP Workflow

### Typical Flow

```
Feature Idea
    ↓
INITIAL.md (Feature Request)
    ↓
/generate-prp → PRP-XXX_FeatureName.md
    ↓
/execute-prp → Implementation (Phase by Phase)
    ↓
Testing & Deployment
    ↓
Production Launch
```

### Phase Structure

Each PRP is broken into phases:

**Phase 1:** Foundation & Setup
**Phase 2:** Database & Schema
**Phase 3:** Core Business Logic
**Phase 4:** AI Integration
**Phase 5:** Frontend UI
**Phase 6:** Testing & Polish
**Phase 7+:** Deployment & Monitoring

---

## 🛠️ Development Commands

### Claude Commands

```bash
/generate-prp          # Generate PRP from feature request
/execute-prp PRP-001   # Execute a specific PRP
```

### Standard Dev Commands

```bash
# Install dependencies
npm install

# Start Convex dev server
npx convex dev

# Start React dev server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Deploy Convex
npx convex deploy --prod
```

---

## 📚 Key Files Explained

### CLAUDE.md

Global rules for the AI assistant. Defines:

-   Code quality standards
-   Architecture patterns
-   Security best practices
-   Testing requirements
-   Communication style

### INITIAL.md

Template for submitting feature requests. Includes:

-   Problem statement
-   Target users
-   Key features
-   Technical requirements
-   Success metrics

### PRP Template (prp_base.md)

Comprehensive template for PRPs with 14 sections:

1. Feature Overview
2. Technical Design
3. Implementation Phases
4. Dependencies & Integrations
5. Testing Strategy
6. Security & Performance
7. User Experience
8. Documentation
9. Deployment Plan
10. Risks & Mitigations
11. Open Questions
12. Progress Tracking
13. Learnings & Retrospective
14. References

---

## 🎨 Design System

### Colors

-   **Safe (Green):** #10b981
-   **Caution (Yellow):** #f59e0b
-   **High Risk (Red):** #ef4444
-   **Primary Brand:** #6366f1 (indigo)

### Typography

-   **Headings:** Inter (bold, semi-bold)
-   **Body:** Inter (regular)
-   **Code:** JetBrains Mono

### Components

-   Cards with subtle shadows
-   Color-coded badges for risk levels
-   Expandable conflict cards
-   Progress indicators for analysis

---

## 🔒 Security & Privacy

-   User inputs sanitized
-   API keys stored securely in environment variables
-   Clerk JWT validation on protected routes
-   Rate limiting on analysis endpoints
-   HTTPS enforced

---

## 📊 Success Metrics

### Product KPIs

-   User registrations: 500+ in first month
-   Routines analyzed: 1,000+ in first month
-   Conflict detection accuracy: 95%+
-   User satisfaction: 4.5+ stars

### Technical KPIs

-   Analysis time: < 10s (< 5s with cache)
-   LLM cache hit rate: > 70%
-   System uptime: > 99.5%
-   Error rate: < 0.5%

---

## 🧪 Testing Strategy

### Unit Tests

-   Ingredient normalization logic
-   Risk calculation algorithms
-   Database helper functions

### Integration Tests

-   Convex function workflows
-   Claude AI integration with mocks
-   Cache behavior

### E2E Tests

-   Complete user journeys (signup → analyze → results)
-   Error scenarios
-   Mobile responsiveness

---

## 🚢 Deployment

### Vercel (Frontend)

```bash
# Auto-deploys on push to main
git push origin main
```

### Convex (Backend)

```bash
# Deploy schema and functions
npx convex deploy --prod
```

### Environment Variables

```env
VITE_CONVEX_URL=
VITE_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
ANTHROPIC_API_KEY=
```

---

## 📖 Resources

### Documentation

-   [Convex Docs](https://docs.convex.dev/)
-   [Anthropic API](https://docs.anthropic.com/)
-   [Clerk Auth](https://clerk.com/docs)
-   [React Query](https://tanstack.com/query/latest)

### Design Inspiration

-   [Mobbin](https://mobbin.com/) - UI patterns
-   [The Ordinary](https://theordinary.com/en-us/regimen-guide) - Conflict guide UX

### Ingredient Data

-   [INCIDecoder](https://incidecoder.com/)
-   [Paula's Choice Dictionary](https://www.paulaschoice.com/ingredient-dictionary)
-   [CosDNA](https://www.cosdna.com/)

---

## 🤝 Contributing

1. Submit feature request using `INITIAL.md` template
2. AI generates PRP using `/generate-prp`
3. Review and approve PRP
4. AI implements using `/execute-prp`
5. Test and review code
6. Deploy to production

---

## 📝 Current Status

### PRP-001: Ingredient Analyzer Foundation

**Status:** Draft
**Progress:** 0/9 phases complete

**Next Steps:**

1. Initialize React + Vite project
2. Set up Convex backend
3. Configure Clerk authentication
4. Define database schema

---

## 🐛 Known Issues

None yet - project just started!

---

## 📞 Contact

For questions or feedback, open an issue or contact the project maintainer.

---

## 📄 License

MIT License (to be added)

---

**Built with ❤️ using Claude Code and the PRP system**
