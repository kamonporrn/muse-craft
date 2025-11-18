# 🆓 คู่มือ Deploy MuseCraft แบบฟรี (Free Tier)

## ⚠️ ข้อจำกัดของ Free Tier

- **Services จะ spin down** หลังจากไม่ใช้งาน 15 นาที
- **Request แรกหลัง spin-down** จะใช้เวลาประมาณ 30 วินาที
- **ไม่มี Persistent Disk** - ข้อมูลจะหายเมื่อ service restart
- **Build timeout**: 45 นาที
- **Memory**: 512MB RAM
- **CPU**: 0.1 CPU share

---

## 🚀 ขั้นตอน Deploy แบบฟรี

### ขั้นตอนที่ 1: เตรียม Code

1. **Commit และ Push ไปยัง GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for free tier deployment"
   git push origin main
   ```

2. **ตรวจสอบไฟล์ที่จำเป็น:**
   - ✓ `render.yaml` (ใน root directory)
   - ✓ `backend/package.json`
   - ✓ `frontend/package.json`

---

### ขั้นตอนที่ 2: Deploy Backend (Free Tier)

1. **ไปที่ Render Dashboard** → คลิก **"New"** → เลือก **"Web Service"**

2. **เชื่อมต่อ GitHub Repository:**
   - เลือก repository: `muse-craft`
   - Branch: `main`

3. **ตั้งค่าบริการ:**
   ```
   Name: musecraft-backend
   Environment: Node
   Region: Singapore (หรือเลือกที่ใกล้ที่สุด)
   Branch: main
   Root Directory: backend
   Build Command: npm install && npm run build
   Start Command: npm run start:prod
   Instance Type: Free (เลือก Free แทน Starter)
   ```

4. **เพิ่ม Environment Variables:**
   - คลิก **"Advanced"** → **"Add Environment Variable"**
   ```
   NODE_ENV = production
   PORT = 10000
   FRONTEND_URL = https://musecraft-frontend.onrender.com
   ```
   ⚠️ **หมายเหตุ:** ใช้ `.onrender.com` URL สำหรับ Free Tier (ยังไม่ตั้งค่า custom domain)

5. **Auto-Deploy:** เปิดใช้งาน (จะ deploy อัตโนมัติเมื่อ push code)

6. **คลิก "Create Web Service"**
   - รอให้ build เสร็จ (ประมาณ 5-10 นาที)
   - บันทึก URL: `https://musecraft-backend.onrender.com`

---

### ขั้นตอนที่ 3: Deploy Frontend (Free Tier)

1. **ไปที่ Render Dashboard** → คลิก **"New"** → เลือก **"Web Service"**

2. **เชื่อมต่อ GitHub Repository เดียวกัน:**
   - เลือก repository: `muse-craft`
   - Branch: `main`

3. **ตั้งค่าบริการ:**
   ```
   Name: musecraft-frontend
   Environment: Node
   Region: Singapore (เลือกเดียวกับ backend)
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Start Command: npm run start
   Instance Type: Free (เลือก Free)
   ```

4. **เพิ่ม Environment Variables:**
   ```
   NODE_ENV = production
   NEXT_PUBLIC_API_URL = https://musecraft-backend.onrender.com
   PORT = 10000
   ```

5. **Auto-Deploy:** เปิดใช้งาน

6. **คลิก "Create Web Service"**
   - รอให้ build เสร็จ
   - บันทึก URL: `https://musecraft-frontend.onrender.com`

---

### ขั้นตอนที่ 4: อัปเดต Backend CORS

1. **ไปที่ Backend Service** → **"Environment"**

2. **อัปเดต Environment Variable:**
   ```
   FRONTEND_URL = https://musecraft-frontend.onrender.com
   ```

3. **คลิก "Save Changes"**

---

## 🔧 แก้ไข Code สำหรับ Free Tier

### ปัญหา: Database ข้อมูลหายเมื่อ Restart

**วิธีแก้:** ใช้ localStorage ใน frontend แทน (สำหรับข้อมูลชั่วคราว)

หรือใช้ **External Database Service ฟรี** เช่น:
- **Supabase** (Free tier)
- **MongoDB Atlas** (Free tier)
- **PlanetScale** (Free tier)

---

### ปัญหา: Service Spin Down

**วิธีแก้:** ใช้ **Uptime Robot** หรือ **Cron-job.org** (ฟรี) เพื่อ ping service ทุก 5 นาที

**ตัวอย่าง Uptime Robot:**
1. ไปที่ https://uptimerobot.com
2. สร้าง account ฟรี
3. เพิ่ม Monitor:
   - Type: HTTP(s)
   - URL: `https://musecraft-backend.onrender.com`
   - Interval: 5 minutes
4. ทำเหมือนกันสำหรับ frontend

---

## 📝 ข้อควรระวังสำหรับ Free Tier

### 1. Database Persistence
- ❌ **ไม่มี Persistent Disk** - ข้อมูลจะหายเมื่อ restart
- ✅ **วิธีแก้:** ใช้ external database หรือ localStorage

### 2. Cold Start
- ⏱️ **Request แรกหลัง spin-down** ใช้เวลา ~30 วินาที
- ✅ **วิธีแก้:** ใช้ uptime monitor เพื่อ keep service alive

### 3. Memory Limit
- 💾 **512MB RAM** - อาจไม่พอสำหรับ production
- ✅ **วิธีแก้:** Optimize code, ลด dependencies

### 4. Build Timeout
- ⏰ **45 นาที** - ถ้า build ใช้เวลานานอาจ fail
- ✅ **วิธีแก้:** Optimize build process

---

## 🎯 Best Practices สำหรับ Free Tier

### 1. Optimize Build Time
```json
// frontend/package.json
{
  "scripts": {
    "build": "next build" // ไม่ใช้ --turbopack ใน production
  }
}
```

### 2. Reduce Dependencies
- ลบ dependencies ที่ไม่จำเป็น
- ใช้ tree-shaking

### 3. Use External Storage
- ใช้ Supabase/MongoDB Atlas สำหรับ database
- ใช้ Cloudinary/ImgBB สำหรับรูปภาพ

### 4. Monitor Services
- ใช้ Uptime Robot เพื่อ keep services alive
- ตรวจสอบ logs เป็นประจำ

---

## 🔄 Deploy ใหม่ (Free Tier)

### Auto Deploy (แนะนำ)
```bash
git add .
git commit -m "Update code"
git push origin main
```
Render จะ deploy อัตโนมัติ

### Manual Deploy
1. ไปที่ Service ใน Render Dashboard
2. คลิก **"Manual Deploy"** → **"Deploy latest commit"**

---

## ✅ ตรวจสอบหลัง Deploy

### Checklist

- [ ] **Backend Service**
  - [ ] Status: Live
  - [ ] URL: `https://musecraft-backend.onrender.com`
  - [ ] Health check: เปิด URL ควรเห็น response

- [ ] **Frontend Service**
  - [ ] Status: Live
  - [ ] URL: `https://musecraft-frontend.onrender.com`
  - [ ] เปิด URL ควรเห็นหน้าเว็บ

- [ ] **ทดสอบฟังก์ชัน**
  - [ ] Sign in/Sign up
  - [ ] ดูสินค้า
  - [ ] API calls ทำงาน

---

## 🆓 ใช้ Custom Domain ฟรี (Optional)

Render Free Tier **รองรับ custom domain** แต่ต้อง:
1. มี domain name ของตัวเอง
2. ตั้งค่า DNS records

**ขั้นตอน:**
1. Frontend Service → Settings → Custom Domains
2. เพิ่ม domain: `muscraft.com`
3. ตั้งค่า DNS (CNAME หรือ A record)
4. รอ SSL certificate (อัตโนมัติ)

---

## 💡 Tips สำหรับ Free Tier

### 1. Keep Services Alive
```bash
# ใช้ curl ใน cron job (ทุก 5 นาที)
curl https://musecraft-backend.onrender.com
curl https://musecraft-frontend.onrender.com
```

### 2. Monitor Logs
- ตรวจสอบ logs เป็นประจำ
- ดู error patterns

### 3. Optimize Performance
- ใช้ CDN สำหรับ static files
- Enable caching
- Minimize bundle size

---

## 🆚 เปรียบเทียบ Free vs Paid

| Feature | Free Tier | Starter ($7/month) |
|---------|-----------|---------------------|
| Spin Down | ✅ 15 นาที | ❌ ไม่มี |
| Persistent Disk | ❌ ไม่มี | ✅ มี |
| Memory | 512MB | 512MB |
| Build Time | 45 นาที | 45 นาที |
| Custom Domain | ✅ มี | ✅ มี |
| SSL | ✅ ฟรี | ✅ ฟรี |

---

## 🎉 สรุป

### URLs สำหรับ Free Tier
- **Backend**: `https://musecraft-backend.onrender.com`
- **Frontend**: `https://musecraft-frontend.onrender.com`

### Environment Variables

**Backend:**
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://musecraft-frontend.onrender.com
```

**Frontend:**
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://musecraft-backend.onrender.com
PORT=10000
```

### ข้อจำกัดสำคัญ
- ⚠️ ข้อมูลจะหายเมื่อ service restart (ไม่มี persistent disk)
- ⚠️ Service จะ spin down หลัง 15 นาทีไม่ใช้งาน
- ⚠️ Request แรกหลัง spin-down ใช้เวลา ~30 วินาที

### แนะนำ
- ใช้ **Uptime Robot** เพื่อ keep services alive
- พิจารณาใช้ **external database** สำหรับ production
- Monitor logs เป็นประจำ

---

**Happy Free Deploying! 🆓🚀**

