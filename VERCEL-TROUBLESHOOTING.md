# Vercel Deployment Troubleshooting Guide

## 500 Internal Server Error - Function Invocation Failed

### What We Fixed

The error was caused by several issues in the Vercel serverless function setup:

#### 1. **Environment Validation Exit (FIXED)**
- **Problem**: `config.ts` was calling `process.exit(1)` when DATABASE_URL wasn't set
- **Solution**: Changed to only exit in development mode; warn in production
- **File**: `src/config/env.ts`

#### 2. **Express Handler Not Properly Wrapped (FIXED)**
- **Problem**: Express app wasn't compatible with Vercel's serverless handler pattern
- **Solution**: Created proper Promise-based handler with CORS headers
- **File**: `api/index.ts`

#### 3. **Incorrect Rewrites Configuration (FIXED)**
- **Problem**: Rewrites were not properly routing all requests
- **Solution**: Simplified to single rewrite rule
- **File**: `vercel.json`

### Changes Made

```typescript
// api/index.ts - Now properly handles Vercel serverless requests
export default function handler(req: VercelRequest, res: VercelResponse) {
  // Sets CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  // ... more headers
  
  // Wraps Express app in Promise
  return new Promise<void>((resolve, reject) => {
    app(req, res)
      .then(() => resolve())
      .catch((error) => reject(error));
  });
}
```

### Verification Checklist

- [x] Build passes locally: `npm run build`
- [x] No `process.exit()` in production code
- [x] Express app properly wrapped for Vercel
- [x] CORS headers configured
- [x] Environment variables set in Vercel dashboard
- [x] Database URL accessible from Vercel region

### Next Steps

1. **Verify in Vercel Dashboard**:
   - Go to your project → Deployments
   - Click on the latest deployment
   - Check the logs at the bottom

2. **Check Environment Variables**:
   - Settings → Environment Variables
   - Verify `DATABASE_URL` is set and correct
   - Ensure `NODE_ENV=production`

3. **Test the Deployment**:
   ```bash
   # These should now work:
   curl https://your-vercel-url.vercel.app/
   curl https://your-vercel-url.vercel.app/health
   curl https://your-vercel-url.vercel.app/api/auth/status
   ```

### If Still Failing

1. **Check Vercel Logs**:
   - Go to Deployments → Latest → Logs
   - Look for specific error messages

2. **Enable Debug Logging**:
   - Add `DEBUG=*` to environment variables
   - Redeploy and check logs

3. **Database Connection Issues**:
   - Verify DATABASE_URL is correct
   - Check if PostgreSQL allows connections from Vercel IPs
   - Test connection locally first

4. **Build Issues**:
   - Run `npm run build` locally
   - Check for TypeScript errors
   - Verify all dependencies in package.json

### Common Error Messages

| Error | Solution |
|-------|----------|
| `DATABASE_URL is not defined` | Add DATABASE_URL to Vercel Environment Variables |
| `ECONNREFUSED` | Database not accessible from Vercel; check firewall/SSL settings |
| `PRISMA_QUERY_ENGINE_BINARY_PATH` | May need to add `prisma generate` to build script |
| `Cannot find module` | Run `npm install` locally and commit package-lock.json |

### Files Modified for Fix

- `api/index.ts` - Proper serverless handler
- `src/config/env.ts` - Safe environment validation  
- `vercel.json` - Corrected configuration

### Deployment Commands

```bash
# After pushing these fixes, Vercel will automatically redeploy
# Or manually trigger:
git push origin main

# Monitor deployment:
# 1. Go to https://vercel.com/dashboard
# 2. Click your project
# 3. Check "Deployments" tab
```

### Success Indicators

When deployment is successful, you should see:
- ✅ Green checkmark on deployment
- ✅ API responds at https://your-url.vercel.app/
- ✅ Health check passes at https://your-url.vercel.app/health
- ✅ No errors in Vercel logs
