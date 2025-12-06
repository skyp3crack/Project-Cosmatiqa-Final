# Vercel NOT_FOUND Error - Complete Fix & Explanation

## 1. ✅ The Fix

### Changes Made

#### A. Updated `vercel.json` Configuration

**Before:**
```json
{
  "buildCommand": "cd Frontend && npm install && npm run build",
  "outputDirectory": "Frontend/dist",
  ...
}
```

**After:**
```json
{
  "buildCommand": "npm install && npm run build",
  "outputDirectory": "dist",
  "rootDirectory": "Frontend",
  ...
}
```

**Key Changes:**
1. ✅ Added `"rootDirectory": "Frontend"` - Tells Vercel where your app lives
2. ✅ Simplified build commands - No need for `cd` when rootDirectory is set
3. ✅ Updated outputDirectory - Now relative to rootDirectory (`dist` instead of `Frontend/dist`)

#### B. Improved Environment Variable Handling

Updated `Frontend/src/main.jsx` to gracefully handle missing environment variables in production:
- Shows user-friendly error message instead of crashing
- Still throws error in development for immediate feedback

---

## 2. 🔍 Root Cause Analysis

### What Was Happening

**The Problem:**
Vercel couldn't find your built application files because of misconfigured paths in a monorepo structure.

**Why It Failed:**

1. **Missing `rootDirectory` Configuration**
   - Your project has a `Frontend/` subdirectory (monorepo structure)
   - Vercel was looking for files in the repository root
   - Without `rootDirectory`, Vercel doesn't know where your app actually is
   - **Result:** Vercel tried to serve files from the wrong location → NOT_FOUND

2. **Incorrect Path Resolution**
   - `outputDirectory: "Frontend/dist"` was trying to reference a path
   - But without `rootDirectory`, Vercel interpreted this path incorrectly
   - Build succeeded, but Vercel couldn't locate the output
   - **Result:** Built files existed, but Vercel looked in the wrong place

3. **Client-Side Routing (Secondary Issue)**
   - React Router uses client-side routing
   - Direct navigation to `/onboarding`, `/product-input`, etc. would 404
   - The rewrite rule was correct, but Vercel never found the app to apply it

### The Misconception

**What the code was doing:**
- Building correctly in the Frontend directory
- Creating dist folder with all assets
- BUT: Vercel was configured as if the app was in the root

**What it needed to do:**
- Tell Vercel explicitly: "This is a monorepo, the app is in Frontend/"
- Use `rootDirectory` so all paths resolve relative to Frontend/
- Let Vercel handle the directory navigation automatically

---

## 3. 📚 Understanding the Concept

### Why Does This Error Exist?

**Vercel's Deployment Model:**
1. **Build Phase:** Runs your build command to create static files
2. **Serve Phase:** Serves those files to visitors
3. **Path Resolution:** Must know WHERE the files are to serve them

**The NOT_FOUND Error Protects You By:**
- Preventing confusion (showing wrong files would be worse)
- Forcing you to fix configuration before users see broken behavior
- Making deployment issues obvious during setup

### Correct Mental Model

**Monorepo Deployment:**

```
Your Repository Root
├── Frontend/          ← Your app lives here
│   ├── src/
│   ├── package.json
│   └── dist/         ← Build output goes here
├── Backend/
└── vercel.json       ← Config file
```

**How Vercel Processes It:**

1. **Read `vercel.json`** → Finds `rootDirectory: "Frontend"`
2. **Sets Working Directory** → Changes to `Frontend/`
3. **Runs Build Command** → `npm run build` (now runs in Frontend/)
4. **Looks for Output** → Finds `dist/` (relative to Frontend/)
5. **Serves Files** → All paths resolve correctly

**Without `rootDirectory`:**
- Vercel stays in repository root
- Build command `cd Frontend && npm run build` works
- But `outputDirectory: "Frontend/dist"` confuses path resolution
- Result: NOT_FOUND

### Framework Integration

**Single-Page Applications (SPAs) Like React:**
- All routes are handled by JavaScript on the client
- Server doesn't have physical files for `/onboarding`, `/product-input`, etc.
- Need rewrite rules to serve `index.html` for all routes
- BUT: Rewrites only work if Vercel can find `index.html` first!

**The Rewrite Rule:**
```json
"rewrites": [
  { "source": "/(.*)", "destination": "/index.html" }
]
```

This says: "For any path that doesn't match a real file, serve index.html instead"
- Works perfectly IF Vercel can find your dist folder
- Fails if dist folder isn't in the expected location

---

## 4. ⚠️ Warning Signs & Prevention

### What to Look For

#### 🚩 Red Flags

1. **Monorepo Structure Without `rootDirectory`**
   ```
   ✅ GOOD: Project has subdirectory → Use rootDirectory
   ❌ BAD:  Using cd commands in buildCommand as workaround
   ```

2. **Absolute Paths in vercel.json**
   ```
   ❌ BAD:  "outputDirectory": "Frontend/dist"
   ✅ GOOD: "outputDirectory": "dist" (with rootDirectory set)
   ```

3. **Complex Build Commands**
   ```
   ❌ BAD:  "buildCommand": "cd Frontend && npm install && npm run build"
   ✅ GOOD: "buildCommand": "npm install && npm run build" (with rootDirectory)
   ```

4. **Testing Locally vs Production**
   - Local: `npm run build` works
   - Vercel: Build succeeds but site shows NOT_FOUND
   - **Diagnosis:** Path configuration issue

### Prevention Checklist

**Before Deploying to Vercel:**

- [ ] If using a subdirectory, add `rootDirectory` to `vercel.json`
- [ ] All paths in `vercel.json` should be relative to `rootDirectory`
- [ ] Test the build locally: `cd <rootDirectory> && npm run build`
- [ ] Verify `dist/` (or your output folder) exists and contains `index.html`
- [ ] Check environment variables are set in Vercel dashboard
- [ ] Verify rewrite rules exist for SPA routing

### Similar Mistakes to Avoid

**1. Multiple Output Directories**
```json
❌ "outputDirectory": ["dist", "public"]  // Wrong format
✅ Use a single output directory
```

**2. Framework Detection Conflicts**
```json
❌ Setting framework: "vite" but rootDirectory in wrong place
✅ Let Vercel auto-detect OR be explicit everywhere
```

**3. Environment Variable Paths**
```json
❌ Referencing ../Backend in Frontend env vars
✅ Use separate environment variables per service
```

---

## 5. 🔄 Alternative Approaches

### Approach 1: Monorepo with rootDirectory (✅ CURRENT - RECOMMENDED)

**Configuration:**
```json
{
  "rootDirectory": "Frontend",
  "outputDirectory": "dist"
}
```

**Pros:**
- ✅ Clean, explicit configuration
- ✅ Works well with Vercel's deployment pipeline
- ✅ Easy to understand and maintain
- ✅ Supports monorepo structures naturally

**Cons:**
- ⚠️ Requires vercel.json configuration
- ⚠️ Need to remember to set rootDirectory

**Best For:** Your current setup - monorepo with clear Frontend/Backend separation

---

### Approach 2: Separate Vercel Projects

**Setup:**
- Deploy Frontend as one Vercel project
- Deploy Backend as separate project (or use Convex as you're doing)

**Configuration:**
- Frontend project: Root directory = Frontend/
- Backend: Separate Convex deployment (current)

**Pros:**
- ✅ Independent deployments
- ✅ Can scale frontend/backend separately
- ✅ Clear separation of concerns

**Cons:**
- ⚠️ More projects to manage
- ⚠️ Requires separate environment variable setup

**Best For:** Large teams or when frontend/backend have different deployment needs

---

### Approach 3: Move App to Repository Root

**Structure Change:**
```
Before:
Project/
├── Frontend/
│   └── src/
└── Backend/

After:
Project/
├── src/           ← Move Frontend contents here
├── package.json
└── Backend/
```

**Configuration:**
```json
{
  "outputDirectory": "dist"
  // No rootDirectory needed
}
```

**Pros:**
- ✅ Simpler configuration
- ✅ Works out-of-the-box with Vercel
- ✅ No path resolution issues

**Cons:**
- ⚠️ Requires restructuring project
- ⚠️ May not fit your monorepo preferences
- ⚠️ Harder to keep Frontend/Backend separate

**Best For:** New projects or when simplicity is priority

---

### Approach 4: Use Vercel's Framework Presets (Auto-Detection)

**Configuration:**
```json
{
  // Remove framework, let Vercel detect
  "rootDirectory": "Frontend"
}
```

Vercel auto-detects Vite based on:
- Presence of `vite.config.js`
- `package.json` dependencies

**Pros:**
- ✅ Less configuration
- ✅ Automatic optimizations

**Cons:**
- ⚠️ Less explicit control
- ⚠️ May not detect complex setups

**Best For:** Standard Vite projects

---

## 🎯 Recommended Solution

**Stick with Approach 1** (monorepo with rootDirectory) because:
1. ✅ Matches your current structure
2. ✅ Minimal changes required
3. ✅ Maintains clean separation
4. ✅ Easy to understand and maintain

---

## 📋 Deployment Checklist

After applying the fix:

1. **Verify vercel.json:**
   ```bash
   cat vercel.json
   # Should show rootDirectory: "Frontend"
   ```

2. **Test Build Locally:**
   ```bash
   cd Frontend
   npm install
   npm run build
   ls dist/index.html  # Should exist
   ```

3. **Set Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `VITE_CONVEX_URL` = `https://your-project.convex.cloud`
   - Select: Production, Preview, Development

4. **Redeploy:**
   ```bash
   vercel --prod
   # OR push to main branch for auto-deploy
   ```

5. **Test Routes:**
   - Visit: `https://your-app.vercel.app/`
   - Visit: `https://your-app.vercel.app/onboarding`
   - Visit: `https://your-app.vercel.app/product-input`
   - All should load (not show 404)

---

## 🔧 Troubleshooting

### Still Getting NOT_FOUND?

1. **Check Build Logs:**
   - Vercel Dashboard → Deployments → Click deployment → View Build Logs
   - Verify build completed successfully
   - Check that `dist/` folder was created

2. **Verify File Structure:**
   ```
   Frontend/
   ├── dist/
   │   ├── index.html  ← Must exist
   │   └── assets/
   ├── package.json
   └── vite.config.js
   ```

3. **Test Environment Variables:**
   ```bash
   # In Vercel build logs, should see:
   ✅ Convex client connected to: https://...
   # NOT:
   ❌ VITE_CONVEX_URL is not set...
   ```

4. **Check Rewrite Rules:**
   - Verify `vercel.json` has the rewrite rule
   - Test by accessing a route directly (e.g., `/onboarding`)

### Common Mistakes

1. **Forgot to Set Environment Variables**
   - Build succeeds, but app crashes
   - Solution: Set in Vercel dashboard

2. **rootDirectory Typo**
   ```json
   ❌ "rootDirectory": "frontend"  // lowercase
   ✅ "rootDirectory": "Frontend"  // matches actual folder
   ```

3. **Wrong Output Directory**
   ```json
   ❌ "outputDirectory": "Frontend/dist"  // absolute path
   ✅ "outputDirectory": "dist"           // relative to rootDirectory
   ```

---

## 📖 Additional Resources

- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos)
- [Vercel Configuration Reference](https://vercel.com/docs/projects/project-configuration)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)

---

## ✅ Summary

**The Fix:**
- Added `rootDirectory: "Frontend"` to `vercel.json`
- Simplified build commands (no `cd` needed)
- Fixed `outputDirectory` to be relative

**Why It Works:**
- Vercel now knows where your app lives
- All paths resolve correctly relative to Frontend/
- Rewrite rules can find index.html

**Key Takeaway:**
In monorepos, always specify `rootDirectory` so Vercel knows where to look!

