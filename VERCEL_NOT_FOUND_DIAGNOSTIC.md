# Vercel NOT_FOUND Error - Complete Diagnostic & Fix Guide

## 🔍 1. The Fix

### Current Configuration Analysis

Your `vercel.json` is **correctly configured**:
- ✅ `rootDirectory: "Frontend"` - Tells Vercel where your app lives
- ✅ `outputDirectory: "dist"` - Points to build output (relative to rootDirectory)
- ✅ `rewrites` - Handles client-side routing for React Router
- ✅ `framework: "vite"` - Explicitly sets framework

### Potential Issues & Solutions

#### Issue 1: Build Failing Silently
**Symptom:** Build logs show success, but site returns NOT_FOUND

**Diagnosis:**
1. Check Vercel deployment logs for any warnings
2. Verify `dist/index.html` exists after build
3. Check if environment variables are missing

**Fix:**
```bash
# Test build locally
cd Frontend
npm install
npm run build
ls dist/index.html  # Should exist
```

#### Issue 2: Environment Variables Not Set
**Symptom:** Build succeeds but app crashes or shows error page

**Diagnosis:**
- Check Vercel Dashboard → Settings → Environment Variables
- Verify `VITE_CONVEX_URL` is set for Production, Preview, and Development

**Fix:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `VITE_CONVEX_URL` = `https://your-deployment.convex.cloud`
3. Select all environments (Production, Preview, Development)
4. Redeploy

#### Issue 3: Path Resolution Edge Case
**Symptom:** Configuration looks correct but still NOT_FOUND

**Diagnosis:**
- Vercel might be caching old configuration
- Case sensitivity in `rootDirectory` path

**Fix:**
1. Ensure `rootDirectory: "Frontend"` matches exact folder name (case-sensitive)
2. Clear Vercel cache by redeploying
3. Try removing and re-adding the project in Vercel

#### Issue 4: Build Output Not Found
**Symptom:** Build completes but Vercel can't find dist folder

**Diagnosis:**
- Build might be outputting to different location
- Vite config might override output directory

**Fix:**
Verify `vite.config.js` doesn't override `build.outDir`:
```js
// vite.config.js should NOT have:
build: {
  outDir: '../dist'  // ❌ This would break it
}

// Should be:
build: {
  outDir: 'dist'  // ✅ Or omit (default is 'dist')
}
```

---

## 🔍 2. Root Cause Analysis

### What Was Actually Happening vs. What Should Happen

#### The Problem Flow:

1. **User visits:** `https://your-app.vercel.app/onboarding`
2. **Vercel receives request:** Looks for file at `/onboarding`
3. **File doesn't exist:** React Router routes are client-side only
4. **Expected behavior:** Rewrite rule should serve `/index.html`
5. **Actual behavior:** NOT_FOUND error

#### Why This Happens:

**Scenario A: Build Output Not Found**
- Vercel can't find `dist/index.html` because:
  - `rootDirectory` path is wrong
  - Build failed silently
  - Output directory mismatch

**Scenario B: Rewrite Rule Not Applied**
- Rewrite rules only work if Vercel can find the base file (`index.html`)
- If `index.html` doesn't exist, rewrites never execute
- Result: NOT_FOUND before rewrite can happen

**Scenario C: Environment Variable Missing**
- Build might fail if `VITE_CONVEX_URL` is missing
- Or build succeeds but app crashes on load
- Missing env vars can cause build-time errors

### The Misconception

**What developers often think:**
- "The rewrite rule should handle all routes"
- "If build succeeds, deployment should work"
- "Environment variables are optional for build"

**Reality:**
- Rewrite rules are **secondary** - they only work if base files exist
- Build success ≠ deployment success (path resolution happens after build)
- Missing env vars can cause silent failures or runtime crashes

---

## 📚 3. Understanding the Concept

### Why Does NOT_FOUND Exist?

**Vercel's Security & Clarity:**
1. **Prevents serving wrong content:** Better to show 404 than serve incorrect files
2. **Forces proper configuration:** Makes deployment issues obvious
3. **Protects against path traversal:** Prevents accessing files outside intended scope

### The Correct Mental Model

**Vercel Deployment Pipeline:**

```
1. Git Push
   ↓
2. Vercel Detects Change
   ↓
3. Reads vercel.json
   ↓
4. Sets rootDirectory (changes to Frontend/)
   ↓
5. Runs installCommand (npm install)
   ↓
6. Runs buildCommand (npm run build)
   ↓
7. Looks for outputDirectory (dist/)
   ↓
8. Validates dist/index.html exists
   ↓
9. Applies rewrite rules
   ↓
10. Serves files
```

**Where It Can Fail:**
- Step 4: Wrong `rootDirectory` → Can't find package.json
- Step 6: Build fails → No dist folder created
- Step 7: Wrong `outputDirectory` → Can't find dist
- Step 8: index.html missing → Rewrites can't apply
- Step 9: Rewrite rule wrong → Routes 404

### Framework Integration (SPA Routing)

**Single-Page Applications (SPAs):**
- All routes (`/`, `/onboarding`, `/product-input`) are handled by JavaScript
- Server only has ONE file: `index.html`
- React Router manages navigation client-side

**The Challenge:**
- Direct navigation to `/onboarding` → Server looks for `/onboarding` file
- File doesn't exist → 404 error
- Solution: Rewrite rule tells server "serve index.html for all routes"

**Why Rewrites Are Secondary:**
```
Request: /onboarding
  ↓
Vercel checks: Does /onboarding file exist? → NO
  ↓
Vercel checks: Does index.html exist? → YES (if build succeeded)
  ↓
Vercel applies rewrite: Serve index.html
  ↓
React Router takes over: Shows Onboarding component
```

**If index.html doesn't exist:**
```
Request: /onboarding
  ↓
Vercel checks: Does /onboarding file exist? → NO
  ↓
Vercel checks: Does index.html exist? → NO (build failed or wrong path)
  ↓
Vercel returns: NOT_FOUND (404)
  ↓
Rewrite rule never executes (no base file to rewrite to)
```

---

## ⚠️ 4. Warning Signs & Prevention

### Red Flags to Watch For

#### 🚩 Configuration Issues

1. **Monorepo without `rootDirectory`**
   ```json
   ❌ Missing rootDirectory in monorepo
   ✅ Always set rootDirectory for subdirectory projects
   ```

2. **Absolute paths in outputDirectory**
   ```json
   ❌ "outputDirectory": "Frontend/dist"
   ✅ "outputDirectory": "dist" (with rootDirectory set)
   ```

3. **Complex build commands**
   ```json
   ❌ "buildCommand": "cd Frontend && npm run build"
   ✅ "buildCommand": "npm run build" (with rootDirectory)
   ```

#### 🚩 Build Issues

4. **Build succeeds but files missing**
   - Check: `ls Frontend/dist/` after local build
   - Verify: `index.html` exists
   - Check: Assets folder exists with JS/CSS files

5. **Environment variable warnings**
   - Build logs show: "VITE_CONVEX_URL is not set"
   - Fix: Set in Vercel dashboard before deploying

#### 🚩 Deployment Issues

6. **Deployment shows success but site 404s**
   - Check: Build logs for warnings
   - Verify: Output directory structure
   - Test: Direct URL access to `/`

### Prevention Checklist

**Before Every Deployment:**

- [ ] **Verify vercel.json exists and is valid JSON**
- [ ] **Check rootDirectory matches actual folder name (case-sensitive)**
- [ ] **Test build locally:** `cd Frontend && npm run build`
- [ ] **Verify dist/index.html exists after build**
- [ ] **Check all environment variables are set in Vercel**
- [ ] **Review build logs for any warnings/errors**
- [ ] **Test root route:** `https://your-app.vercel.app/`
- [ ] **Test client route:** `https://your-app.vercel.app/onboarding`

### Code Smells

**Patterns That Indicate This Issue:**

1. **Missing vercel.json in monorepo**
   - No configuration file → Vercel doesn't know about subdirectory

2. **Hardcoded paths in build scripts**
   ```json
   ❌ "buildCommand": "cd Frontend && npm run build"
   ```
   - Indicates rootDirectory not set

3. **Multiple output directories referenced**
   ```json
   ❌ "outputDirectory": ["dist", "public"]
   ```
   - Vercel expects single directory

4. **Framework detection conflicts**
   - Setting `framework: "vite"` but rootDirectory in wrong place
   - Or auto-detection conflicting with manual config

### Similar Mistakes to Avoid

**1. Forgetting rootDirectory in monorepos**
- Always set `rootDirectory` when app is in subdirectory
- Even if build command uses `cd`, still need `rootDirectory`

**2. Case sensitivity**
```json
❌ "rootDirectory": "frontend"  // lowercase
✅ "rootDirectory": "Frontend"  // matches actual folder
```

**3. Relative vs absolute paths**
```json
// With rootDirectory: "Frontend"
❌ "outputDirectory": "Frontend/dist"  // absolute (wrong)
✅ "outputDirectory": "dist"           // relative (correct)
```

**4. Environment variable scope**
- Set env vars for all environments (Production, Preview, Development)
- Don't assume dev vars apply to production

---

## 🔄 5. Alternative Approaches

### Approach 1: Current Setup (Monorepo with rootDirectory) ✅ RECOMMENDED

**Configuration:**
```json
{
  "rootDirectory": "Frontend",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Pros:**
- ✅ Clean separation of Frontend/Backend
- ✅ Works well with Vercel's pipeline
- ✅ Easy to understand and maintain
- ✅ Supports monorepo structure naturally

**Cons:**
- ⚠️ Requires explicit configuration
- ⚠️ Must remember to set rootDirectory

**Best For:** Your current setup - monorepo with clear separation

---

### Approach 2: Separate Vercel Projects

**Setup:**
- Frontend: Deploy as separate Vercel project
- Backend: Keep Convex deployment (current)

**Configuration:**
- Frontend project: Set root directory to `Frontend/` in Vercel UI
- No `vercel.json` needed (configured in dashboard)

**Pros:**
- ✅ Independent deployments
- ✅ Separate scaling
- ✅ Clear separation
- ✅ Different teams can manage independently

**Cons:**
- ⚠️ More projects to manage
- ⚠️ Separate environment variable setup
- ⚠️ More complex CI/CD

**Best For:** Large teams or when frontend/backend have different needs

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
- ✅ Simplest configuration
- ✅ Works out-of-the-box
- ✅ No path resolution issues
- ✅ Standard Vite setup

**Cons:**
- ⚠️ Requires major restructuring
- ⚠️ Loses monorepo benefits
- ⚠️ Harder to keep Frontend/Backend separate

**Best For:** New projects or when simplicity is priority

---

### Approach 4: Use Vercel's Auto-Detection

**Configuration:**
```json
{
  "rootDirectory": "Frontend"
  // Remove framework, let Vercel detect
}
```

Vercel auto-detects based on:
- `vite.config.js` presence
- `package.json` dependencies
- File structure

**Pros:**
- ✅ Less configuration
- ✅ Automatic optimizations
- ✅ Framework-specific defaults

**Cons:**
- ⚠️ Less explicit control
- ⚠️ May not detect complex setups
- ⚠️ Harder to debug if detection fails

**Best For:** Standard Vite projects with typical structure

---

### Approach 5: Use Hash-Based Routing (Not Recommended)

**Change React Router:**
```jsx
// Instead of BrowserRouter
import { HashRouter } from 'react-router-dom'

<HashRouter>
  <App />
</HashRouter>
```

**URLs become:**
- `https://app.vercel.app/#/onboarding`
- `https://app.vercel.app/#/product-input`

**Pros:**
- ✅ No server configuration needed
- ✅ Works on any static host
- ✅ No rewrite rules required

**Cons:**
- ❌ Ugly URLs with `#`
- ❌ Poor SEO (hash routes not indexed)
- ❌ Not standard practice
- ❌ Breaks direct linking expectations

**Best For:** Quick prototypes or when server config isn't possible

---

## 🎯 Recommended Solution

**Stick with Approach 1** (current setup) because:
1. ✅ Matches your existing structure
2. ✅ Minimal changes required
3. ✅ Maintains clean separation
4. ✅ Industry standard for monorepos

**Next Steps:**
1. Verify `vercel.json` is correct (already done)
2. Check environment variables in Vercel dashboard
3. Test build locally
4. Redeploy and verify

---

## 📋 Step-by-Step Fix Procedure

### Step 1: Verify Local Build
```bash
cd Frontend
npm install
npm run build
ls dist/index.html  # Should exist
```

### Step 2: Check vercel.json
```bash
cat vercel.json
# Verify rootDirectory: "Frontend" exists
# Verify outputDirectory: "dist" exists
# Verify rewrites rule exists
```

### Step 3: Set Environment Variables
1. Go to Vercel Dashboard
2. Your Project → Settings → Environment Variables
3. Add: `VITE_CONVEX_URL` = `https://your-deployment.convex.cloud`
4. Select: Production, Preview, Development

### Step 4: Redeploy
```bash
# Option A: Push to trigger auto-deploy
git add .
git commit -m "Fix Vercel configuration"
git push

# Option B: Manual deploy
vercel --prod
```

### Step 5: Test Deployment
1. Visit: `https://your-app.vercel.app/`
2. Visit: `https://your-app.vercel.app/onboarding`
3. Visit: `https://your-app.vercel.app/product-input`
4. All should load (not show 404)

---

## 🔧 Troubleshooting

### Still Getting NOT_FOUND?

#### Check 1: Build Logs
1. Vercel Dashboard → Deployments
2. Click latest deployment
3. View Build Logs
4. Look for:
   - ✅ "Build completed successfully"
   - ✅ "Output directory: dist"
   - ❌ Any errors or warnings

#### Check 2: File Structure
Verify after build:
```
Frontend/
├── dist/
│   ├── index.html  ← Must exist
│   ├── assets/
│   │   ├── index-*.js
│   │   └── index-*.css
│   └── vite.svg
├── package.json
└── vite.config.js
```

#### Check 3: Environment Variables
In build logs, should see:
```
✅ Convex client connected to: https://...
```

NOT:
```
❌ VITE_CONVEX_URL is not set...
```

#### Check 4: Rewrite Rules
Test by accessing route directly:
- `https://your-app.vercel.app/onboarding`
- Should load (not 404)
- If 404, rewrite rule not working

### Common Mistakes

**1. rootDirectory Typo**
```json
❌ "rootDirectory": "frontend"  // lowercase
✅ "rootDirectory": "Frontend"  // matches folder
```

**2. Wrong Output Directory**
```json
// With rootDirectory: "Frontend"
❌ "outputDirectory": "Frontend/dist"  // absolute
✅ "outputDirectory": "dist"           // relative
```

**3. Missing Rewrite Rule**
```json
❌ No rewrites section
✅ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
```

**4. Environment Variables Not Set**
- Build succeeds but app crashes
- Solution: Set in Vercel dashboard

---

## 📖 Additional Resources

- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos)
- [Vercel Configuration Reference](https://vercel.com/docs/projects/project-configuration)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [React Router Deployment](https://reactrouter.com/en/main/start/overview#deploying)

---

## ✅ Summary

**The Fix:**
- ✅ `vercel.json` is correctly configured
- ✅ `rootDirectory: "Frontend"` is set
- ✅ `outputDirectory: "dist"` is relative
- ✅ Rewrite rules are configured

**If Still Getting NOT_FOUND:**
1. Check build logs for errors
2. Verify environment variables are set
3. Test local build works
4. Verify `dist/index.html` exists after build
5. Check for case sensitivity in paths

**Key Takeaway:**
In monorepos, `rootDirectory` is essential. All paths in `vercel.json` are relative to `rootDirectory`. Rewrite rules only work if the base file (`index.html`) exists.

