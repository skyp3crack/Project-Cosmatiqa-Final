# 🧴 Cosmatiqa - Skincare Ingredient Compatibility Analyzer

> **Built for [Cursor x Anthropic Hackathon Malaysia 2025](https://luma.com/cursor-hack-my?tk=q1bHZ5)**

An AI-powered web application that analyzes skincare routines for ingredient conflicts, providing personalized recommendations based on skin type and usage timing. Never waste money on incompatible products again!

![Built with Cursor](https://img.shields.io/badge/Built%20with-Cursor-000000?style=for-the-badge&logo=cursor)
![Powered by Claude](https://img.shields.io/badge/Powered%20by-Claude%203.5-FF6B35?style=for-the-badge)
![Built with Convex](https://img.shields.io/badge/Built%20with-Convex-FFD43B?style=for-the-badge&logo=convex)
![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)

---

## 🎯 Problem Statement

Skincare enthusiasts waste money and risk skin damage by unknowingly combining incompatible active ingredients (e.g., Retinol + Vitamin C, AHAs + Retinoids). Generic compatibility charts don't account for individual skin types, sensitivities, or usage timing (AM/PM routines).

**Pain Points:**

-   Information overload: Thousands of ingredients with unclear interactions
-   Generic advice doesn't consider skin type (oily vs. sensitive)
-   No single tool combines hardcoded knowledge + AI research
-   Users don't know if problems are chemical (deactivation) or dermatological (irritation)

---

## ✨ Features

### 🧬 **Ingredient Conflict Detection**

-   Parses ingredient lists from any skincare product
-   Matches ingredients to comprehensive database using fuzzy search
-   Detects conflicts using hardcoded compatibility matrix
-   Identifies temporal conflicts (same-time usage) vs. chemical conflicts

### 🤖 **AI-Powered Analysis**

-   Claude 3.5 Sonnet integration for unknown ingredient pairs
-   Personalized recommendations based on skin type and sensitivities
-   Scientific explanations for each detected conflict
-   Routine optimization suggestions

### 📊 **Smart Safety Scoring**

-   Real-time safety score calculation (0-10 scale)
-   Color-coded risk indicators (Green/Yellow/Red)
-   Severity classification (High/Medium/Mild)
-   Individual and pairwise risk assessment

### 👤 **Personalized Profiles**

-   Skin type selection (Oily, Dry, Combination, Normal, Sensitive)
-   Sensitivity tracking (Acne, Rosacea, Eczema, etc.)
-   Skincare goals (Anti-aging, Acne treatment, Hydration, etc.)
-   Routine history and analysis tracking

### ⏰ **AM/PM Routine Management**

-   Separate morning and evening routine analysis
-   Timing-based conflict detection
-   Product organization by usage time
-   Visual routine display

---

## 🛠️ Tech Stack

### Frontend

-   **React 19** - Modern UI framework
-   **Vite** - Lightning-fast build tool
-   **React Router** - Client-side routing
-   **Tailwind CSS** - Utility-first styling
-   **Lucide React** - Beautiful icons
-   **Recharts** - Data visualization

### Backend

-   **Convex** - Real-time backend with built-in database
-   **TypeScript** - Type-safe server functions
-   **Convex Search** - Full-text ingredient search

### AI & Integrations

-   **Anthropic Claude 3.5 Sonnet** - AI-powered conflict analysis
-   **Clerk** - User authentication (ready for integration)

### Deployment

-   **Vercel** - Frontend hosting
-   **Convex Cloud** - Backend deployment

### Development Tools

-   **Cursor** - AI-powered IDE for rapid development
-   **ESLint** - Code quality
-   **Git** - Version control

---

## 🚀 Quick Start

### Prerequisites

-   Node.js 18+ and npm
-   Convex account (free tier works)
-   Anthropic API key (for AI features)

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/Project-Cosmatiqa-Final.git
    cd Project-Cosmatiqa-Final
    ```

2. **Set up Backend (Convex)**

    ```bash
    cd Backend
    npm install
    npx convex dev
    ```

    Follow the prompts to create a new Convex project or connect to existing one.

3. **Set up Frontend**

    ```bash
    cd Frontend
    npm install
    cp .env.example .env.local
    ```

    Update `Frontend/.env.local`:

    ```env
    VITE_CONVEX_URL=https://your-deployment.convex.cloud
    VITE_ANTHROPIC_API_KEY=your-anthropic-api-key
    ```

4. **Start Development Servers**

    Terminal 1 (Backend):

    ```bash
    cd Backend
    npx convex dev
    ```

    Terminal 2 (Frontend):

    ```bash
    cd Frontend
    npm run dev
    ```

5. **Open the app**
   Navigate to `http://localhost:5173` in your browser

---

## 📖 Usage Guide

### 1. **Onboarding**

-   Select your skin type
-   Choose your sensitivities and skincare goals
-   Click "Continue" to save your profile

### 2. **Add Products**

-   Enter product name
-   Paste ingredient list (INCI format)
-   Select usage timing (AM/PM/Both)
-   Add multiple products to build your routine

### 3. **Analyze Routine**

-   Click "Analyze My Routine"
-   Wait for AI-powered analysis (5-10 seconds)
-   View real-time results dashboard

### 4. **Review Results**

-   Check your safety score (0-10)
-   Review detected conflicts with severity levels
-   Read personalized recommendations
-   View products organized by timing

### Example Test Data

**Product 1:**

-   Name: `The Ordinary Niacinamide 10%`
-   Ingredients: `Aqua, Niacinamide, Pentylene Glycol, Zinc PCA, Dimethicone, Tamarindus Indica Seed Gum, Acacia Senegal Gum, Hydrolyzed Rice Protein, PEG-20 Methyl Glucose Sesquistearate, Salicylic Acid, Sodium Chloride, Phenoxyethanol, Chlorphenesin`
-   Timing: `AM`

**Product 2:**

-   Name: `Paula's Choice 2% BHA Liquid`
-   Ingredients: `Water, Methylpropanediol, Butylene Glycol, Salicylic Acid, Polysorbate 20, Camellia Oleifera Leaf Extract, Sodium Hydroxide, Tetrasodium EDTA`
-   Timing: `PM`

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │Welcome   │→ │Onboarding│→ │Product   │→ │Results   │  │
│  │Page      │  │          │  │Input     │  │Dashboard │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Convex Client
                        │
┌───────────────────────▼─────────────────────────────────────┐
│              Backend (Convex Functions)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │users.ts      │  │products.ts   │  │analysis.ts   │    │
│  │- Profile mgmt│  │- Routine mgmt │  │- Conflict    │    │
│  │              │  │              │  │  detection   │    │
│  └──────────────┘  └──────────────┘  └──────┬───────┘    │
│                                               │            │
│  ┌────────────────────────────────────────────▼───────┐    │
│  │           llm.ts (Claude AI Integration)            │    │
│  │  - Unknown ingredient pair analysis                 │    │
│  │  - Personalized recommendations                    │    │
│  └────────────────────────────────────────────────────┘    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Real-time Queries
                        │
┌───────────────────────▼─────────────────────────────────────┐
│              Convex Database                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │userProfiles  │  │routines      │  │ingredients   │    │
│  │products      │  │analysisResults│ │compatibility │    │
│  │detectedConflicts│              │  │Matrix        │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Hackathon Track Eligibility

This project is eligible for multiple hackathon tracks:

### 🏆 **Cursor Track: Best Project made with Cursor**

-   Entire project built using Cursor AI IDE
-   Rapid development with AI pair programming
-   Complex features implemented in 24 hours

### 🤖 **Anthropic Track: Best Use of Claude**

-   Claude 3.5 Sonnet integration for ingredient conflict analysis
-   AI-powered personalized recommendations
-   Scientific explanations for ingredient interactions

### ⚡ **Convex Track: Best Use of Convex**

-   Real-time backend with Convex functions
-   Comprehensive database schema with relationships
-   Live data synchronization between frontend and backend

### 🎨 **Mobbin Track: Best UI/UX Design**

-   Clean, modern interface
-   Intuitive wizard-style flow
-   Color-coded risk indicators
-   Mobile-responsive design

---

## 📁 Project Structure

```
Project-Cosmatiqa-Final/
├── Backend/
│   └── convex/
│       ├── functions/
│       │   ├── analysis.ts      # Core conflict detection engine
│       │   ├── products.ts       # Routine & product management
│       │   ├── users.ts          # User profile management
│       │   ├── llm.ts            # Claude AI integration
│       │   └── seedAll.ts        # Database seeding
│       └── schema.ts             # Database schema definitions
│
├── Frontend/
│   └── src/
│       ├── Components/
│       │   ├── WelcomePage/      # Landing page
│       │   ├── Onboarding/       # User profile setup
│       │   ├── ProductInput/     # Product entry form
│       │   ├── AnalysisLoading/  # Loading animation
│       │   ├── ResultsDashboard/ # Results display
│       │   ├── DetailedView/     # Conflict details
│       │   └── Profile/          # User profile
│       ├── context/
│       │   └── UserContext.jsx   # Global state management
│       └── App.jsx               # Main app component
│
└── README.md                     # This file
```

---

## 🔬 How It Works

### 1. **Ingredient Parsing**

-   Splits ingredient strings by commas
-   Normalizes ingredient names (removes percentages, CAS numbers)
-   Fuzzy matches to canonical database names

### 2. **Conflict Detection**

-   Checks all ingredient pairs against compatibility matrix
-   Identifies known conflicts (e.g., Retinol + Vitamin C)
-   Determines conflict type (pH incompatibility, deactivation, irritation)

### 3. **AI Enhancement**

-   For unknown ingredient pairs, queries Claude API
-   Receives scientific analysis and recommendations
-   Stores results for future reference

### 4. **Safety Scoring**

-   Calculates individual ingredient risk scores
-   Aggregates pairwise conflicts
-   Considers temporal usage (AM/PM separation)
-   Generates overall routine safety score (0-10)

### 5. **Personalization**

-   Filters recommendations by skin type
-   Considers user sensitivities
-   Aligns suggestions with skincare goals

---

## 🧪 Testing

### Manual Testing Flow

1. Complete onboarding with test profile
2. Add 2+ products with known conflicting ingredients
3. Verify conflicts are detected
4. Check safety score calculation
5. Review AI-generated recommendations

### Example Conflict Test

-   **Product A (AM):** Contains Retinol
-   **Product B (PM):** Contains Vitamin C
-   **Expected:** No conflict (different times)
-   **Product A (AM):** Contains Retinol
-   **Product B (AM):** Contains AHA
-   **Expected:** High conflict detected

---

## 🚧 Future Enhancements

-   [ ] OCR scanning for ingredient lists
-   [ ] Product database with pre-loaded ingredients
-   [ ] Routine history and comparison
-   [ ] Export analysis as PDF
-   [ ] Social sharing of routines
-   [ ] Mobile app (React Native)
-   [ ] Multi-language support
-   [ ] Haircare product support

---

## 📚 Documentation

-   [Quick Start Guide](./QUICK_START.md)
-   [Integration Complete](./INTEGRATION_COMPLETE.md)
-   [Claude AI Integration](./CLAUDE_AI_INTEGRATION.md)
-   [Compatibility Matrix Guide](./COMPATIBILITY_MATRIX_GUIDE.md)
-   [Vercel Deployment](./VERCEL_DEPLOYMENT.md)

---

## 👥 Team

Built during the **Cursor x Anthropic Hackathon Malaysia 2025** (24-hour hackathon)

**Event:** [Cursor x Anthropic Hackathon MY 2025](https://luma.com/cursor-hack-my?tk=q1bHZ5)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

-   **Cursor** - Amazing AI-powered IDE that accelerated development
-   **Anthropic** - Claude API for intelligent ingredient analysis
-   **Convex** - Real-time backend platform
-   **Vercel** - Seamless deployment experience
-   **The skincare community** - For inspiration and feedback

---

## 🔗 Links

-   ~~**Live Demo:** [Coming soon]~~
-   **Hackathon Event:** [Cursor x Anthropic Hackathon Malaysia](https://luma.com/cursor-hack-my?tk=q1bHZ5)
-   **Convex Dashboard:** [Your deployment dashboard]
-   **GitHub Repository:** [Your repo URL]

---

<div align="center">

**Made with ❤️ at Cursor x Anthropic Hackathon Malaysia 2025**

[⬆ Back to Top](#-cosmatiqa---skincare-ingredient-compatibility-analyzer)

</div>
