# Environment Variables Setup

## Frontend (.env.local)

Create a file named `.env.local` in the `Frontend` folder with the following:

```env
# Convex Backend URL
# Get this from: npx convex dev (in Backend folder)
VITE_CONVEX_URL=https://your-project.convex.cloud

# Clerk Authentication
# Get these from: https://dashboard.clerk.com
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Anthropic Claude API
# Get this from: https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-...
```

**Note:** Variables must start with `VITE_` to be accessible in Vite applications.

## Backend (Convex Dashboard)

Set these in the Convex Dashboard at: https://dashboard.convex.dev → Your Project → Settings → Environment Variables

```env
ANTHROPIC_API_KEY=sk-ant-...
CLERK_SECRET_KEY=sk_test_...
```

## Getting API Keys

### Convex URL
1. Run `cd Backend && npx convex dev`
2. Copy the deployment URL from the terminal output

### Clerk Keys
1. Go to https://dashboard.clerk.com
2. Create/select your application
3. Go to **API Keys**
4. Copy **Publishable Key** and **Secret Key**

### Anthropic API Key
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Go to **API Keys**
4. Click **Create Key**
5. Copy the key (starts with `sk-ant-`)

