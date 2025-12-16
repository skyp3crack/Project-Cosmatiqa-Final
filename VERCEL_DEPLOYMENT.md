# Vercel Deployment Guide for Cosmatiqa

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) if you don't have one
2. **Convex Deployment URL**: You'll need your Convex deployment URL for the environment variable

## Step 1: Get Your Convex URL

If you haven't deployed your Convex backend yet:

```bash
cd Backend
npx convex deploy --prod
```

After deployment, Convex will provide you with a deployment URL that looks like:
```
https://your-project.convex.cloud
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Navigate to project root**:
```bash
cd C:\Users\kuran\Documents\vscode\hackaton\Project-Cosmatiqa-Final
```

4. **Deploy**:
```bash
vercel
```

5. **Follow the prompts**:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No** (for first deployment)
   - Project name? (Press Enter for default or enter a custom name)
   - Directory? **Press Enter** (uses current directory)
   - Override settings? **No**

6. **Add Environment Variables**:
   After the first deployment, you'll need to add your environment variable:
```bash
vercel env add VITE_CONVEX_URL
```
   - When prompted, enter your Convex URL (e.g., `https://your-project.convex.cloud`)
   - Select environment: **Production, Preview, Development** (select all)

7. **Redeploy**:
```bash
vercel --prod
```

### Option B: Using Vercel Dashboard (Web UI)

1. **Go to [vercel.com](https://vercel.com)** and sign in

2. **Click "Add New Project"**

3. **Import your Git repository**:
   - Select your GitHub/GitLab/Bitbucket account
   - Find and select `Project-Cosmatiqa-Final`
   - Click "Import"

4. **Configure Project Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: Leave as root (`.`)
   - **Build Command**: `cd Frontend && npm install && npm run build`
   - **Output Directory**: `Frontend/dist`
   - **Install Command**: `cd Frontend && npm install`

5. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add: `VITE_CONVEX_URL` = `https://your-project.convex.cloud`
   - Select all environments (Production, Preview, Development)

6. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete

## Step 3: Verify Deployment

1. After deployment, Vercel will provide you with a URL like:
   ```
   https://your-project.vercel.app
   ```

2. **Test your application**:
   - Visit the URL
   - Check that the app loads correctly
   - Test the connection to Convex backend

## Step 4: Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Build Fails

- **Check build logs** in Vercel dashboard
- **Verify environment variables** are set correctly
- **Ensure Convex backend is deployed** and accessible

### Environment Variables Not Working

- Make sure variables start with `VITE_` prefix
- Redeploy after adding environment variables
- Check that variables are set for the correct environment (Production/Preview/Development)

### Convex Connection Issues

- Verify `VITE_CONVEX_URL` is correct
- Check Convex dashboard to ensure backend is running
- Ensure CORS is configured in Convex (should be automatic)

## Continuous Deployment

Once connected to Git:
- **Automatic deployments** on push to `main` branch
- **Preview deployments** for pull requests
- **Production deployments** from `main` branch

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_CONVEX_URL` | Your Convex deployment URL | ✅ Yes |

## Next Steps

- Set up custom domain
- Configure analytics (optional)
- Set up monitoring and error tracking
- Configure preview deployments for branches




