# Easiest Fix for 404 Error - Delete & Reimport

The Root Directory setting might not be visible in your current settings. The **easiest solution** is to delete the project and reimport it correctly.

## Easiest Fix (5 Minutes)

### Step 1: Delete Current Project

1. Go to https://vercel.com/dashboard
2. Click on your **Condo** project
3. Click **"Settings"** tab
4. In left sidebar, click **"General"**
5. Scroll all the way to the bottom
6. Find **"Delete Project"** section
7. Click **"Delete"**
8. Type the project name to confirm: `Condo`
9. Click **"Delete"**

### Step 2: Reimport with Correct Settings

1. Go to https://vercel.com/new

2. Click **"Import Git Repository"**

3. Select **GCMGCM/Condo** from your repositories

4. **IMPORTANT - Configure Before Deploying:**

   **Project Name:** Condo (or leave default)
   
   **Framework Preset:** Next.js (should auto-detect)
   
   **Root Directory:** Click **"Edit"** next to Root Directory
   - Type: `saas-site`
   - Click **"Continue"**
   
   **Build and Output Settings:** (Expand if needed)
   - Build Command: `npm run build` (default is fine)
   - Output Directory: `.next` (default is fine)
   
   **Environment Variables:** Click **"Add"**
   - **Key:** `MONGODB_URI`
   - **Value:** 
     ```
     mongodb+srv://marcondesgustavo_db_user:wUL7_9wHxV.yVDB@facilit3s.dapgdwk.mongodb.net/?appName=Facilit3s
     ```
   - **Select environments:** Check all 3 (Production, Preview, Development)
   - Click **"Add a variable"** (if you need to add more) or just proceed

5. **Click "Deploy"**

6. **Wait 2-3 minutes** for the build to complete

### Step 3: Test Your Website

1. Once deployment completes, click **"Visit"** or click your assigned URL

2. You should see the home page

3. Navigate to `/signup` by typing it in the URL bar

4. Create a test account:
   - Email: test@example.com
   - Full Name: Test User
   - Password: SecurePass123!
   - Check GDPR consent checkbox
   - Click "Create account"

5. You should be redirected to the dashboard!

## Finding Root Directory Setting During Import

When importing the project, look for the **"Root Directory"** field:

- It's usually right below the "Framework Preset" dropdown
- It shows `./ (Root)` by default
- Click the **"Edit"** button next to it
- Enter `saas-site` in the text field
- Make sure there's **NO leading or trailing slashes** (just `saas-site`, not `/saas-site/`)

## Screenshot Reference (What to Look For)

During import, you'll see a form like this:

```
Framework Preset: [Next.js ▼]

Root Directory: [./ (Root)] [Edit]
  ↑ CLICK "Edit" HERE
  Then type: saas-site

Build and Output Settings: [Override ▼]

Environment Variables:
  KEY: MONGODB_URI
  VALUE: mongodb+srv://...
```

## Success Indicators

✅ **Build succeeds** (no errors in build logs)
✅ **Home page loads** at your Vercel URL
✅ **`/signup` route works** (no 404)
✅ **Can create test account** and see dashboard

## Still Getting 404?

If you still see 404 **after setting Root Directory to `saas-site`**:

1. Check the build logs:
   - Go to Deployments → Click latest deployment
   - Check for error messages

2. V Visit the repository directly to verify code is there:
   - https://github.com/GCMGCM/Condo/tree/main/saas-site
   - Make sure you see `package.json`, `next.config.ts`, `src/` folder

3. Try these Root Directory variations:
   - `saas-site` (recommended)
   - `./saas-site`
   - `saas-site/` (with trailing slash)

---

**This should fix it!** Once you reimport with Root Directory = `saas-site`, everything will work. 🎉
