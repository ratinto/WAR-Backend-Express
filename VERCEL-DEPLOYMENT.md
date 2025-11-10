# Vercel Deployment Guide for WAR Backend

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- GitHub account with your repository pushed
- PostgreSQL database URL (e.g., from Aiven, which you already have)

## Deployment Steps

### 1. **Push to GitHub**
Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### 2. **Connect to Vercel**

#### Option A: Using Vercel CLI (Recommended)
```bash
npm install -g vercel
vercel login
vercel
```

#### Option B: Using Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Click "Import"

### 3. **Configure Environment Variables**

In the Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables (use the template from `.env.example` as reference):

```
DATABASE_URL=<your-postgresql-connection-string>
JWT_SECRET=<your-jwt-secret-key>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-domain.com
EMAIL_DOMAIN=rishihood.edu.in
NODE_ENV=production
```

**Important:** 
- Replace `<your-postgresql-connection-string>` with your actual PostgreSQL database URL
- Replace `<your-jwt-secret-key>` with a secure random string
- Update `CORS_ORIGIN` with your actual frontend domain
- Store all secrets securely in Vercel Environment Variables, never in version control

### 4. **Set Build Command**
The build command should automatically be detected as `npm run build` or you can manually set it to:
```bash
npm run vercel-build
```

### 5. **Deploy**

#### Using CLI:
```bash
vercel --prod
```

#### Using Dashboard:
- Click "Deploy" button (automatic on push to main)

### 6. **Run Database Migrations**

After the first deployment, run:
```bash
vercel env pull
npx prisma migrate deploy
```

Or from Vercel dashboard function logs:
```bash
npx prisma db push
```

## Post-Deployment

### 1. **Verify Deployment**
- Your API will be available at: `https://your-vercel-url.vercel.app`
- Check health: `https://your-vercel-url.vercel.app/health`
- Check status: `https://your-vercel-url.vercel.app/`

### 2. **Update Frontend CORS**
Update your frontend to use the new API URL:
```javascript
// In your frontend config
const API_BASE_URL = "https://your-vercel-url.vercel.app/api";
```

### 3. **Monitor Logs**
View deployment logs in Vercel dashboard:
- Go to your project → "Deployments" → Recent deployment → "Logs"

### 4. **Set Custom Domain (Optional)**
In Vercel Dashboard:
1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Ensure PostgreSQL server is accessible from Vercel
- Check SSL mode requirement (sslmode=require)

### Build Failures
- Check build logs in Vercel dashboard
- Ensure `npm run build` works locally
- Verify all dependencies are in package.json

### Runtime Errors
- Check function logs in Vercel dashboard
- Ensure all environment variables are set
- Verify database migrations have run

## Environment-Specific Setup

### Development
```bash
npm run dev
```

### Production
Handled automatically by Vercel after deployment

## Files Created for Vercel

- `vercel.json` - Vercel configuration
- `api/index.ts` - Serverless function entry point
- `.vercelignore` - Files to ignore during deployment
- `package.json` - Updated with vercel-build script

## Additional Notes

- Serverless functions have a 30-second timeout by default
- Vercel provides automatic HTTPS
- Automatic deployments on push to main branch
- Free tier includes 100GB bandwidth/month
- Environment variables are secure and not exposed to client

For more info: https://vercel.com/docs/functions/nodejs/quickstart
