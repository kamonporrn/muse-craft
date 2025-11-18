# MuseCraft Deployment Guide

## Quick Start for Render Deployment

### 1. Backend Service Setup

1. **Create New Web Service** on Render
   - Connect your GitHub repository
   - Name: `musecraft-backend`
   - Environment: `Node`
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`

2. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://muscraft.com
   ```

3. **Persistent Disk (Optional but Recommended):**
   - Name: `musecraft-database`
   - Mount Path: `/opt/render/project/src/backend/database`
   - Size: 1GB

### 2. Frontend Service Setup

1. **Create New Web Service** on Render
   - Connect your GitHub repository
   - Name: `musecraft-frontend`
   - Environment: `Node`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`

2. **Environment Variables:**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://musecraft-backend.onrender.com
   PORT=10000
   ```

### 3. Custom Domain Setup

1. In Frontend Service → Settings → Custom Domains
2. Add: `muscraft.com`
3. Configure DNS:
   - **Option A (CNAME)**: Point `muscraft.com` CNAME to `musecraft-frontend.onrender.com`
   - **Option B (A Record)**: Use Render's IP addresses (provided in dashboard)

4. Wait for SSL certificate (automatic, ~5 minutes)

### 4. Update Backend CORS

After frontend is deployed with custom domain:
1. Go to Backend Service → Environment
2. Update `FRONTEND_URL` to: `https://muscraft.com`
3. Save and restart service

## Important Notes

### Database Persistence
- **With Persistent Disk**: Data persists across restarts
- **Without Disk**: Data is lost on service restart (use for testing only)

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- No persistent disk on free tier

### Production Checklist
- [ ] Backend service is running
- [ ] Frontend service is running
- [ ] Custom domain is configured
- [ ] SSL certificate is active
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] Database persistence is enabled (if needed)
- [ ] Health checks are passing

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Verify all dependencies in package.json
- Ensure TypeScript compiles without errors

### 500 Errors
- Check service logs
- Verify environment variables
- Ensure database files are accessible

### CORS Errors
- Verify FRONTEND_URL matches actual domain
- Check browser console for specific errors
- Ensure backend allows credentials

### Domain Not Working
- Verify DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Check SSL certificate status

## Cost Estimate

- **Starter Plan**: $7/month per service
- **Total**: ~$14/month (Backend + Frontend)
- **Free Tier**: Available but with limitations

## Support

For issues, check:
1. Render service logs
2. Build logs
3. Browser console
4. Network tab in DevTools

