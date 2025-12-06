# Project Setup Guide

This guide will help you set up the Project Cosmatiqa after cloning the repository.

## Prerequisites

Before starting, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

## Step 1: Install Dependencies

Dependencies have been installed automatically. If you need to reinstall:

### Backend Dependencies
```bash
cd Backend
npm install
```

**Installed packages:**
- `convex` - Backend-as-a-Service framework
- `@anthropic-ai/sdk` - Anthropic Claude API SDK

### Frontend Dependencies
```bash
cd Frontend
npm install
```

**Installed packages:**
- `react` & `react-dom` - React framework
- `convex` - Convex client for React
- `@tanstack/react-query` - Data fetching and caching
- `zustand` - State management
- `@clerk/clerk-react` - Clerk authentication
- `lucide-react` - Icon library
- `clsx` & `tailwind-merge` - Utility functions for className management
- `tailwindcss` - CSS framework (dev dependency)

## Step 2: Set Up Convex Backend

1. **Install Convex CLI** (if not already installed):
   ```bash
   npm install -g convex
   ```

2. **Login to Convex**:
   ```bash
   npx convex login
   ```

3. **Link your project** (if not already linked):
   ```bash
   cd Backend
   npx convex dev
   ```
   
   This will:
   - Start the Convex development server
   - Generate the deployment URL
   - Watch for changes and auto-deploy

4. **Copy the Convex URL** from the terminal output. It will look like:
   ```
   https://your-project.convex.cloud
   ```

## Step 3: Set Up Environment Variables

### Frontend Environment Variables

1. Create a `.env.local` file in the `Frontend` folder:
   ```bash
   cd Frontend
   copy .env.example .env.local
   ```

2. Edit `.env.local` and fill in the values:

   ```env
   # Convex Backend URL (from Step 2)
   VITE_CONVEX_URL=https://your-project.convex.cloud

   # Clerk Authentication (see Step 4)
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...

   # Anthropic Claude API (see Step 5)
   ANTHROPIC_API_KEY=sk-ant-...
   ```

### Backend Environment Variables (Convex)

Convex environment variables are set in the Convex dashboard:

1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:
   - `ANTHROPIC_API_KEY` - Your Anthropic API key
   - `CLERK_SECRET_KEY` - Your Clerk secret key (if needed)

## Step 4: Set Up Clerk Authentication

1. **Create a Clerk account** at [clerk.com](https://clerk.com)
2. **Create a new application**
3. **Get your API keys**:
   - Go to **API Keys** in your Clerk dashboard
   - Copy the **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - Copy the **Secret Key** (starts with `sk_test_` or `sk_live_`)
4. **Add the keys** to your `.env.local` file (Frontend) and Convex dashboard (Backend)

## Step 5: Set Up Anthropic Claude API

1. **Create an Anthropic account** at [console.anthropic.com](https://console.anthropic.com/)
2. **Create an API key**:
   - Go to **API Keys** in the dashboard
   - Click **Create Key**
   - Copy the key (starts with `sk-ant-`)
3. **Add the key** to:
   - `.env.local` file (Frontend) - if needed
   - Convex dashboard environment variables (Backend) - **required**

## Step 6: Start Development Servers

### Terminal 1: Convex Backend
```bash
cd Backend
npx convex dev
```

Keep this running. It will:
- Watch for changes in `convex/` folder
- Auto-deploy changes
- Show logs and errors

### Terminal 2: Frontend Development Server
```bash
cd Frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` (or another port if 5173 is busy).

## Step 7: Verify Setup

1. **Check Convex connection**:
   - Open the frontend in your browser
   - Check the browser console for any connection errors
   - The Convex dev server should show successful connections

2. **Test the application**:
   - Navigate through the app
   - Check that components load correctly
   - Verify API calls are working

## Troubleshooting

### Convex Connection Issues

- **Error: "Invalid deployment URL"**
  - Make sure `VITE_CONVEX_URL` in `.env.local` matches the URL from `npx convex dev`
  - Restart the frontend dev server after changing `.env.local`

- **Error: "Authentication failed"**
  - Verify you're logged in: `npx convex login`
  - Check that the project is linked correctly

### Environment Variable Issues

- **Variables not loading in Frontend**
  - Make sure the file is named `.env.local` (not `.env`)
  - Restart the dev server after changing environment variables
  - Variables must start with `VITE_` to be accessible in Vite

- **Backend environment variables**
  - These must be set in the Convex dashboard, not in `.env` files
  - Go to: Dashboard → Settings → Environment Variables

### Port Already in Use

- If port 5173 is busy, Vite will automatically use the next available port
- Check the terminal output for the actual port number

## Next Steps

Once setup is complete:

1. Review the [README.md](../README.md) for project overview
2. Check [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) for development details
3. Start developing! 🚀

## Additional Resources

- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Vite Documentation](https://vitejs.dev/)

---

**Need Help?** Check the project README or open an issue.

