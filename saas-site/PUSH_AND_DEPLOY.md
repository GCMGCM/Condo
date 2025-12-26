# Push Code to GitLab and Deploy to Vercel

Your code is ready and committed locally. Follow these steps to push it to GitLab and deploy to Vercel.

## Step 1: Push Code to GitLab

Run these commands in your terminal (from `d:\Theapp` directory):

```bash
cd d:\Theapp
git push -u origin master
```

**If prompted for credentials:**
- Username: `marcondes.gustavo`
- Password: Use your GitLab **Personal Access Token** (not your regular password)
  - If you don't have one, create it at: https://gitlab.com/-/user_settings/personal_access_tokens
  - Scopes needed: `write_repository`, `read_repository`

**Alternative (if authentication fails):**
Use SSH instead:
```bash
git remote set-url origin git@gitlab.com:marcondes.gustavo/facilit3s.git
git push -u origin master
```

## Step 2: Deploy to Vercel

Once the code is pushed to GitLab:

1. **Connect GitLab to Vercel (one-time)**
   - Go to: https://vercel.com/dashboard
   - Click your avatar → Settings → Git
   - Click "Connect GitLab Account"
   - Authorize the connection

2. **Import Project**
   - Go to: https://vercel.com/new
   - Click "Import Git Repository"
   - Select: `marcondes.gustavo/facilit3s`
   - Click "Import"

3. **Add Environment Variable (CRITICAL)**
   Before deploying, click "Environment Variables" and add:
   
   **Name:** `MONGODB_URI`
   
   **Value:** 
   ```
   mongodb+srv://marcondesgustavo_db_user:wUL7_9wHxV.yVDB@facilit3s.dapgdwk.mongodb.net/?appName=Facilit3s
   ```
   
   **Environments:** Check all three (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at `https://facilit3s.vercel.app` (or similar)

## Step 3: Test Your Live Website

1. Visit your Vercel URL
2. Go to `/signup`
3. Create a test account:
   - Email: `test@yoursite.com`
   - Full Name: `Test User`
   - Password: `SecurePass123!`
   - Check GDPR consent
4. Click "Create account"
5. Check MongoDB Atlas to see the user was created!

## Verify in MongoDB Atlas

1. Go to: https://cloud.mongodb.com/
2. Sign in and select your project
3. Click "Browse Collections"
4. You should see your `users` collection with the test user

## 🎉 Success!

Your website is now 100% online:
- ✅ Frontend hosted on Vercel
- ✅ Database on MongoDB Atlas
- ✅ No local server needed

## Troubleshooting

**Git push fails?**
- Ensure you're using a Personal Access Token, not your password
- Try SSH method instead of HTTPS

**Vercel says "repository not found"?**
- Make sure GitLab account is connected to Vercel
- Verify the repository exists at: https://gitlab.com/marcondes.gustavo/facilit3s

**Signup returns 500 error?**
- Check Vercel logs (visit your project → Deployments → select latest → View Function Logs)
- Verify `MONGODB_URI` environment variable is set correctly
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

---

**Need help?** Check the full deployment guide in `DEPLOY_TO_VERCEL.md`
