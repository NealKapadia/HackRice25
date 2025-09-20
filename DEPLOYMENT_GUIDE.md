# 🚀 GenEngine Deployment Guide

## 🏠 Running Locally on Your Laptop

### Prerequisites
- Node.js (v20+ recommended)
- npm installed
- Git installed

### Quick Start (Automatic)
Simply double-click the `start.bat` file in the root directory, which will:
1. Start the backend server on port 8787
2. Start the frontend on port 5173
3. Open your browser automatically

### Manual Start (Step by Step)

#### 1. Start the Backend Server
Open a terminal in the project root and run:
```bash
cd backend
npm install  # First time only
npm run dev
```
The backend will start on `http://localhost:8787`

#### 2. Start the Frontend (In a New Terminal)
```bash
cd frontend
npm install  # First time only
npm run dev
```
The frontend will start on `http://localhost:5173` and automatically open in your browser.

### 🎮 Using the Application Locally
1. Open http://localhost:5173 in your browser
2. The app will start with a Geometry Dash template game
3. Type commands in the Director Panel like:
   - "Make the player bounce higher"
   - "Change the player to a blue pixel art cube"
   - "Add more obstacles"
4. Click "Generate" to see your game update in real-time!

## ☁️ FREE Deployment to Cloudflare (Production)

### Why Cloudflare?
- **100% FREE** for most use cases
- 100,000 free requests per day
- 10ms CPU time per request
- Free static hosting via Pages
- Global CDN included

### Step 1: Create Cloudflare Account
1. Go to [cloudflare.com](https://dash.cloudflare.com/sign-up)
2. Sign up for a free account
3. Verify your email

### Step 2: Install Wrangler CLI
```bash
npm install -g wrangler
```

### Step 3: Authenticate with Cloudflare
```bash
wrangler login
```
This will open a browser for authentication.

### Step 4: Deploy the Backend

#### A. Create R2 Bucket (Optional - for image storage)
```bash
# Create R2 bucket for storing generated images
wrangler r2 bucket create genengine-assets

# Make the bucket publicly accessible (optional)
# You'll need to configure this in the Cloudflare dashboard
```

#### B. Set up Secrets
```bash
cd backend

# Add your Gemini API key as a secret
wrangler secret put GEMINI_API_KEY
# When prompted, paste: AIzaSyA3rg0QYItzcykI50WL9dTqmPLYGvkiAlo
```

#### C. Deploy the Worker
```bash
# Deploy to production
wrangler deploy

# You'll get a URL like: https://genengine-api.YOUR-SUBDOMAIN.workers.dev
```

### Step 5: Deploy the Frontend

#### A. Update Frontend Configuration
1. Create a `.env.production` file in the `frontend` directory:
```bash
cd ../frontend
echo VITE_API_URL=https://genengine-api.YOUR-SUBDOMAIN.workers.dev > .env.production
```
Replace `YOUR-SUBDOMAIN` with your actual Cloudflare subdomain.

#### B. Build the Frontend
```bash
npm run build
```

#### C. Deploy to Cloudflare Pages
```bash
# Install Pages CLI if you haven't already
npm install -g @cloudflare/pages

# Deploy the dist folder
npx wrangler pages deploy dist --project-name genengine

# First deployment will prompt you to create the project
# Choose "Create a new project"
# Name it "genengine"
```

You'll get a URL like: `https://genengine.pages.dev`

### Alternative: Deploy Frontend via Dashboard
1. Go to [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. Click "Create a project"
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `frontend`
5. Add environment variable:
   - `VITE_API_URL` = Your worker URL from Step 4

## 🔧 Configuration for Production

### Update CORS Settings (if needed)
If you get CORS errors, update `backend/src/index.ts`:

```typescript
app.use('*', cors({
  origin: [
    'https://genengine.pages.dev',
    'http://localhost:5173'
  ],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));
```

### Configure R2 Public Access (Optional)
1. Go to Cloudflare Dashboard → R2
2. Select your `genengine-assets` bucket
3. Go to Settings → Public Access
4. Enable public access
5. Note your public URL
6. Update `backend/src/index.ts` line 152 with your R2 domain

## 💰 Cost Analysis

### Cloudflare FREE Tier Limits:
- **Workers**: 100,000 requests/day, 10ms CPU/request
- **Pages**: Unlimited requests, 500 builds/month
- **R2**: 10GB storage, 1M Class A operations, 10M Class B operations/month

### Estimated Usage:
- **Hobby Project**: 100% FREE
- **Small Team (10 users)**: 100% FREE
- **Medium Usage (100 daily users)**: 100% FREE
- **High Usage (1000+ daily users)**: ~$5/month for extra Workers requests

### When You'll Start Paying:
- Over 100,000 API requests per day
- Over 10GB of generated images stored
- Need more than 10ms CPU time per request (unlikely)

## 🛠️ Troubleshooting

### Common Issues:

1. **"GEMINI_API_KEY is not defined"**
   - Make sure you added the secret: `wrangler secret put GEMINI_API_KEY`

2. **CORS Errors**
   - Update the CORS settings in `backend/src/index.ts`
   - Make sure frontend uses the correct API URL

3. **"Canvas Error: existingAssets is not defined"**
   - Pull the latest code: `git pull`
   - The frontend has been updated to fix this

4. **Build Fails on Cloudflare Pages**
   - Make sure Node version is set to 20 in Pages settings
   - Check environment variables are set correctly

5. **Images not Loading**
   - For local dev: Images will use data URLs (no R2 needed)
   - For production: Configure R2 bucket public access

## 📊 Monitoring Your App

### View Analytics:
1. **Workers**: Dashboard → Workers → Your worker → Analytics
2. **Pages**: Dashboard → Pages → Your project → Analytics
3. **R2**: Dashboard → R2 → Overview

### View Logs:
```bash
# Live tail your worker logs
wrangler tail
```

## 🚀 Quick Commands Reference

```bash
# Local Development
cd backend && npm run dev  # Start backend
cd frontend && npm run dev # Start frontend

# Deployment
cd backend && wrangler deploy              # Deploy backend
cd frontend && npm run build && npx wrangler pages deploy dist # Deploy frontend

# Secrets Management
wrangler secret put GEMINI_API_KEY         # Add API key
wrangler secret list                       # List secrets

# Logs & Debugging
wrangler tail                              # View live logs
wrangler dev --local                       # Test locally with Wrangler
```

## 🎉 Success Checklist

- [ ] Backend running locally on http://localhost:8787
- [ ] Frontend running locally on http://localhost:5173
- [ ] Can generate game code with AI prompts
- [ ] Backend deployed to Cloudflare Workers
- [ ] Frontend deployed to Cloudflare Pages
- [ ] Production app accessible via public URL
- [ ] API key secret configured in production

## 📚 Additional Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [R2 Storage Docs](https://developers.cloudflare.com/r2/)

---

**Need Help?** The entire deployment process should take less than 10 minutes and cost $0!