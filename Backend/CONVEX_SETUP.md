# Connecting to Team Convex Deployment

## Problem
The project is currently connected to a different deployment (`accomplished-vulture-933`) instead of the team's deployment (`lovable-anaconda-325`).

## Solution: Link to Team Deployment

### Option 1: Using Convex CLI (Recommended)

1. **Stop any running `npx convex dev` process** (Ctrl+C)

2. **Link to the team's project:**
   ```bash
   cd Backend
   npx convex dev --configure existing
   ```

3. **When prompted, enter:**
   - Team: `khalif`
   - Project: `backend-34e2d`
   - Deployment: Select `lovable-anaconda-325` (or the dev deployment you want)

### Option 2: Manual Configuration

1. **Create `convex.json` in the Backend folder:**
   ```json
   {
     "project": "backend-34e2d",
     "team": "khalif"
   }
   ```

2. **Set the deployment via environment variable:**
   Create a `.env.local` file in the Backend folder:
   ```env
   CONVEX_DEPLOYMENT=lovable-anaconda-325
   ```

3. **Or use the full URL:**
   ```env
   CONVEX_DEPLOYMENT=https://lovable-anaconda-325.convex.cloud
   ```

### Option 3: Using Deployment URL Directly

If you have the deployment URL, you can set it in the Frontend `.env.local`:
```env
VITE_CONVEX_URL=https://lovable-anaconda-325.convex.cloud
```

## Verify Connection

After configuring, run:
```bash
cd Backend
npx convex dev
```

Check the output - it should show:
- Team: `khalif`
- Project: `backend-34e2d`
- Deployment: `lovable-anaconda-325` (or your chosen deployment)

The dashboard URL should be:
```
https://dashboard.convex.dev/t/khalif/backend-34e2d/lovable-anaconda-325/
```

## Important Notes

- **Dev vs Prod Deployments**: The team might have separate dev and prod deployments
- **Deployment Names**: Deployment names like `lovable-anaconda-325` are auto-generated
- **Team Access**: Make sure you're logged in with an account that has access to the `khalif` team

## Troubleshooting

If you get permission errors:
1. Make sure you're logged in: `npx convex login`
2. Verify you have access to the `khalif` team
3. Check with your team lead if you need to be added to the team

If the deployment doesn't appear:
1. List available deployments: Check the Convex dashboard
2. Ask your team for the exact deployment name
3. You might need to use a different deployment (dev vs prod)

