# How to Check and Set the Correct Convex Deployment

## Current Issue

The project might be connected to a different deployment than your team's deployment (`lovable-anaconda-325`).

## Quick Check

1. **Run Convex dev and check the output:**

    ```bash
    cd Backend
    npx convex dev
    ```

2. **Look for the dashboard URL in the output.** It should show something like:

    ```
    View the Convex dashboard at https://dashboard.convex.dev/t/khalif/backend-34e2d/lovable-anaconda-325/
    ```

3. **If it shows a different deployment** (like `accomplished-vulture-933`), you need to switch.

## How to Switch to Team Deployment

### Method 1: Interactive Configuration (Easiest)

1. **Stop any running `npx convex dev`** (Ctrl+C)

2. **Run the configure command:**

    ```bash
    cd Backend
    npx convex dev --configure existing
    ```

3. **Follow the prompts:**
    - Select team: `khalif`
    - Select project: `backend-34e2d`
    - Select deployment: Choose `lovable-anaconda-325` from the list

### Method 2: Check Available Deployments

1. **Open the Convex dashboard:**

    ```bash
    npx convex dashboard
    ```

2. **Navigate to:** `https://dashboard.convex.dev/t/khalif/backend-34e2d/`

3. **Check the deployments list** - you should see:
    - `lovable-anaconda-325` (or similar)
    - Other deployments (dev, prod, etc.)

4. **Note the exact deployment name** you want to use

### Method 3: Set Deployment via Environment Variable

1. **Create `.env.local` in the Backend folder:**

    ```env
    CONVEX_DEPLOYMENT=lovable-anaconda-325
    ```

2. **Or use the full URL:**

    ```env
    CONVEX_DEPLOYMENT=https://lovable-anaconda-325.convex.cloud
    ```

3. **Run:**
    ```bash
    npx convex dev
    ```

## Verify You're on the Right Deployment

After configuring, when you run `npx convex dev`, check:

1. **The dashboard URL** in the terminal output
2. **The deployment name** in the URL should match your team's deployment
3. **The data** - if you see data that matches what your team expects, you're connected correctly

## Important Notes

- **Dev vs Prod**: Teams often have separate dev and production deployments
- **Deployment Names**: Names like `lovable-anaconda-325` are auto-generated
- **Team Access**: Make sure you're logged in and have access to the `khalif` team
- **Schema Sync**: If you see schema validation errors, the deployment might have different data structure

## If You Still See the Wrong Deployment

1. **Check with your team** - ask for the exact deployment name or URL
2. **Verify team access** - make sure you're added to the `khalif` team
3. **Check for multiple projects** - you might have multiple Convex projects configured
4. **Clear Convex cache** (if needed):
    - Delete `.convex` folder in Backend (if it exists)
    - Re-run `npx convex dev --configure existing`
