# Lumiq Deployment Guide

## 🚀 Deploying to Vercel

### Prerequisites
- [ ] GitHub account with your code pushed
- [ ] Vercel account (sign up at vercel.com)
- [ ] MongoDB Atlas database URL
- [ ] Environment variables ready

---

## Step 1: Deploy Frontend

### Via Vercel Dashboard:

1. **Go to [Vercel Dashboard](https://vercel.com/new)**

2. **Import Your Repository**
   - Click "Add New" → "Project"
   - Select your GitHub repository: `SanMine/Lumiq`
   - Click "Import"

3. **Configure Frontend Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app/api
   ```
   (You'll update this after deploying backend)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Copy your frontend URL (e.g., `lumiq-frontend.vercel.app`)

---

## Step 2: Deploy Backend

### Via Vercel Dashboard:

1. **Go to [Vercel Dashboard](https://vercel.com/new)**

2. **Import Same Repository Again**
   - Click "Add New" → "Project"
   - Select your GitHub repository: `SanMine/Lumiq`
   - Click "Import"

3. **Configure Backend Project**
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   PORT=3000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   GROQ_API_KEY=your_groq_api_key (if you have one)
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Copy your backend URL (e.g., `lumiq-backend.vercel.app`)

---

## Step 3: Update Frontend Environment Variable

1. Go to your **Frontend project** in Vercel dashboard
2. Go to "Settings" → "Environment Variables"
3. Update `VITE_API_URL` to your backend URL:
   ```
   VITE_API_URL=https://lumiq-backend.vercel.app/api
   ```
4. Click "Save"
5. Go to "Deployments" tab
6. Click "..." on latest deployment → "Redeploy"

---

## Step 4: Configure CORS

Your backend needs to allow requests from your frontend domain.

The CORS should already be configured in your `backend/src/index.js`, but verify it includes your frontend URL.

---

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Try signing in
3. Test all features
4. Check browser console for errors

---

## 🔧 Troubleshooting

### Build Errors:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify Node version compatibility

### API Not Working:
- Check CORS configuration
- Verify environment variables are set
- Check backend logs in Vercel dashboard

### Database Connection Issues:
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Verify MONGODB_URI is correct
- Check MongoDB Atlas cluster is running

---

## 📝 Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Sign in/Sign up works
- [ ] API calls succeed
- [ ] Database operations work
- [ ] All pages load without errors
- [ ] Environment variables are set
- [ ] CORS is properly configured
- [ ] Custom domain configured (optional)

---

## 🔄 Automatic Deployments

Both projects will auto-deploy when you push to GitHub:
- Push to `main` branch → Automatic deployment to production
- Create pull request → Automatic preview deployment

---

## 🌐 Custom Domain (Optional)

1. Go to project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS instructions

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
