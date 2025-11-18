# Deployment Guide for MuseCraft on Render

## Prerequisites
- GitHub repository with your code
- Render account (sign up at https://render.com)
- Domain name: muscraft.com (configured DNS)

## Step 1: Prepare Repository

1. Ensure all code is committed and pushed to GitHub
2. Verify `render.yaml` is in the root directory

## Step 2: Deploy Backend Service

1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repository
3. Configure:
   - **Name**: `musecraft-backend`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Plan**: Starter ($7/month)

4. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://muscraft.com
   ```

5. Add Persistent Disk:
   - **Name**: `musecraft-database`
   - **Mount Path**: `/opt/render/project/src/backend/database`
   - **Size**: 1GB

6. Click "Create Web Service"

## Step 3: Deploy Frontend Service

1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repository
3. Configure:
   - **Name**: `musecraft-frontend`
   - **Environment**: `Node`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Starter ($7/month)

4. Add Environment Variables:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://musecraft-backend.onrender.com
   PORT=10000
   ```

5. Click "Create Web Service"

## Step 4: Configure Custom Domain

1. In Frontend Service settings → Custom Domains
2. Add domain: `muscraft.com`
3. Follow DNS configuration instructions:
   - Add CNAME record pointing to your Render service
   - Or add A record with Render's IP addresses

4. Wait for SSL certificate provisioning (automatic)

## Step 5: Update Backend CORS

After frontend is deployed, update backend environment variable:
```
FRONTEND_URL=https://muscraft.com
```

## Step 6: Verify Deployment

1. Check backend health: `https://musecraft-backend.onrender.com`
2. Check frontend: `https://muscraft.com`
3. Test API connectivity from frontend
4. Verify database persistence (data should persist after restarts)

## Troubleshooting

### Build Failures
- Check build logs in Render dashboard
- Verify all dependencies are in package.json
- Ensure TypeScript compiles without errors

### Database Issues
- Verify persistent disk is mounted correctly
- Check file permissions in `/opt/render/project/src/backend/database`
- Ensure database files are created on first run

### CORS Errors
- Verify FRONTEND_URL in backend matches actual frontend URL
- Check browser console for specific CORS errors
- Ensure credentials: true is set in CORS config

### Environment Variables
- All `NEXT_PUBLIC_*` variables must be set in frontend service
- Backend variables should not have `NEXT_PUBLIC_` prefix
- Restart services after changing environment variables

## Cost Estimate

- Backend Service: $7/month (Starter plan)
- Frontend Service: $7/month (Starter plan)
- Persistent Disk: Included in Starter plan
- **Total: ~$14/month**

## Alternative: Free Tier

For free tier (with limitations):
- Use Free plan (spins down after inactivity)
- Remove persistent disk (use in-memory storage)
- Note: Data will be lost on service restart

