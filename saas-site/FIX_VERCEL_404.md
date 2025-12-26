# Fix Vercel 404 Error - Update Root Directory

You deployed without setting the Root Directory. Here's how to fix it:

## Quick Fix Steps

### Step 1: Go to Project Settings

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Click on your **Condo** project
3. Click **"Settings"** tab at the top

### Step 2: Update Root Directory

1. In the left sidebar, click **"General"**
2. Scroll down to **"Root Directory"** section
3. Click **"Edit"**
4. Enter: `saas-site`
5. Click **"Save"**

### Step 3: Redeploy

1. Go to the **"Deployments"** tab
2. Click the three dots (...) on the latest deployment
3. Click **"Redeploy"**

OR

1. Go to the main project page
2. Click **"Redeploy"** button

### Step 4: Wait for Build

- Wait 2-3 minutes for the build to complete
- Once done, click your deployment URL
- You should now see your website!

## Verify It's Working

1. Visit your Vercel URL (e.g., `https://condo-xxxx.vercel.app`)
2. You should see the home page
3. Go to `/signup`
4. Try creating a test account

## If You Still See 404

**Double-check these settings:**

1. **Root Directory:** Must be `saas-site` (exactly, case-sensitive)
2. **Framework Preset:** Should be "Next.js"
3. **Build Command:** Should be `npm run build` or `next build`
4. **Output Directory:** Should be `.next`

**Environment Variable Check:**
1. Go to Settings → Environment Variables
2. Verify `MONGODB_URI` is set:
   ```
   mongodb+srv://marcondesgustavo_db_user:wUL7_9wHxV.yVDB@facilit3s.dapgdwk.mongodb.net/?appName=Facilit3s
   ```
3. Make sure it's enabled for Production, Preview, and Development

## Alternative: Delete and Reimport

If the above doesn't work:

1. **Delete the project:**
   - Go to Settings → General
   - Scroll to bottom
   - Click "Delete Project"

2. **Reimport correctly:**
   - Go to https://vercel.com/new
   - Select GCMGCM/Condo
   - **BEFORE clicking Deploy:**
     - Set Root Directory: `saas-site`
     - Add environment variable `MONGODB_URI`
   - Click "Deploy"

## Success!

Once the Root Directory is set correctly and redeployed:
- ✅ Home page loads at your Vercel URL
- ✅ `/signup` page is accessible
- ✅ Users can create accounts
- ✅ Data saves to MongoDB Atlas

---

**Need help?** Check build logs in Vercel → Deployments → (your deployment) → View Function Logs
