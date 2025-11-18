# Render Deployment Setup for muscraft.com

## 🚀 Quick Deployment Steps

### Step 1: Prepare GitHub Repository
1. Push all code to GitHub
2. Ensure `render.yaml` is in root directory
3. Verify `.gitignore` excludes sensitive files

### Step 2: Deploy Backend (API)

1. **Go to Render Dashboard** → New → Web Service
2. **Connect GitHub** repository
3. **Configure Service:**
   ```
   Name: musecraft-backend
   Environment: Node
   Region: Singapore (or closest to your users)
   Branch: main
   Root Directory: backend
   Build Command: npm install && npm run build
   Start Command: npm run start:prod
   ```

4. **Environment Variables:**
   ```
   NODE_ENV = production
   PORT = 10000
   FRONTEND_URL = https://muscraft.com
   ```

5. **Add Persistent Disk** (Important for database):
   - Click "Add Disk"
   - Name: `musecraft-database`
   - Mount Path: `/opt/render/project/src/backend/database`
   - Size: 1GB

6. **Click "Create Web Service"**
7. **Note the service URL**: `https://musecraft-backend.onrender.com`

### Step 3: Deploy Frontend

1. **Go to Render Dashboard** → New → Web Service
2. **Connect GitHub** repository (same repo)
3. **Configure Service:**
   ```
   Name: musecraft-frontend
   Environment: Node
   Region: Singapore (same as backend)
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Start Command: npm run start
   ```

4. **Environment Variables:**
   ```
   NODE_ENV = production
   NEXT_PUBLIC_API_URL = https://musecraft-backend.onrender.com
   PORT = 10000
   ```

5. **Click "Create Web Service"**

### Step 4: Configure Custom Domain (muscraft.com)

1. **In Frontend Service** → Settings → Custom Domains
2. **Add Domain**: `muscraft.com`
3. **DNS Configuration:**
   
   **Option 1: CNAME (Recommended)**
   ```
   Type: CNAME
   Name: @ (or leave blank for root domain)
   Value: musecraft-frontend.onrender.com
   TTL: 3600
   ```

   **Option 2: A Record**
   - Use IP addresses provided by Render
   - Check Render dashboard for current IPs

4. **Wait for SSL Certificate** (automatic, ~5-10 minutes)
5. **Verify**: Visit `https://muscraft.com`

### Step 5: Update Backend CORS

After frontend domain is active:
1. Go to **Backend Service** → Environment
2. Update `FRONTEND_URL` to: `https://muscraft.com`
3. **Save** and service will auto-restart

## 📋 Environment Variables Summary

### Backend Service
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://muscraft.com
```

### Frontend Service
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://musecraft-backend.onrender.com
PORT=10000
```

## 🔧 Post-Deployment Checklist

- [ ] Backend service is running (green status)
- [ ] Frontend service is running (green status)
- [ ] Backend health check passes: `https://musecraft-backend.onrender.com`
- [ ] Frontend loads: `https://muscraft.com`
- [ ] SSL certificate is active (lock icon in browser)
- [ ] API calls work from frontend
- [ ] Database persists data (test by creating user/product)
- [ ] CORS errors are resolved

## 🐛 Troubleshooting

### Build Fails
- **Check**: Build logs in Render dashboard
- **Common issues**: 
  - Missing dependencies
  - TypeScript errors
  - Build timeout (increase if needed)

### 500 Internal Server Error
- **Check**: Service logs
- **Common issues**:
  - Missing environment variables
  - Database file permissions
  - Port conflicts

### CORS Errors
- **Verify**: `FRONTEND_URL` in backend matches actual domain
- **Check**: Browser console for specific CORS message
- **Ensure**: Backend allows credentials

### Domain Not Resolving
- **Wait**: DNS propagation (up to 48 hours)
- **Verify**: DNS records are correct
- **Check**: SSL certificate status in Render dashboard

### Database Data Lost
- **Ensure**: Persistent disk is mounted
- **Check**: Mount path is correct
- **Verify**: Disk size is sufficient

## 💰 Pricing

- **Starter Plan**: $7/month per service
- **Total Cost**: ~$14/month (Backend + Frontend)
- **Free Tier**: Available but services spin down after inactivity

## 📝 Notes

- Services auto-restart on code push (if auto-deploy enabled)
- Builds can take 5-10 minutes
- First deployment may take longer
- Database files are created automatically on first run
- SSL certificates are provisioned automatically

## 🔗 Useful Links

- Render Dashboard: https://dashboard.render.com
- Render Docs: https://render.com/docs
- Service URLs will be: 
  - Backend: `https://musecraft-backend.onrender.com`
  - Frontend: `https://muscraft.com`

