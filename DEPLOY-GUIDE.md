# 🚀 คู่มือ Deploy MuseCraft ไปยัง Render.com

## 📋 สารบัญ
1. [เตรียมพร้อมก่อน Deploy](#เตรียมพร้อมก่อน-deploy)
2. [Deploy ครั้งแรก](#deploy-ครั้งแรก)
3. [Deploy ใหม่ (Re-deploy)](#deploy-ใหม่-re-deploy)
4. [ตรวจสอบหลัง Deploy](#ตรวจสอบหลัง-deploy)
5. [แก้ไขปัญหา](#แก้ไขปัญหา)

---

## ✅ เตรียมพร้อมก่อน Deploy

### 1. ตรวจสอบไฟล์ที่จำเป็น
```bash
# ตรวจสอบว่าไฟล์เหล่านี้มีอยู่ในโปรเจค
✓ render.yaml (ใน root directory)
✓ backend/package.json
✓ frontend/package.json
✓ .gitignore
```

### 2. Commit และ Push ไปยัง GitHub
```bash
# ตรวจสอบสถานะ
git status

# เพิ่มไฟล์ที่เปลี่ยนแปลง
git add .

# Commit
git commit -m "Prepare for deployment"

# Push ไปยัง GitHub
git push origin main
```

### 3. ตรวจสอบ Render Account
- เข้าสู่ระบบที่ https://dashboard.render.com
- ตรวจสอบว่าเชื่อมต่อ GitHub repository แล้ว

---

## 🆕 Deploy ครั้งแรก

### ขั้นตอนที่ 1: Deploy Backend Service

1. **ไปที่ Render Dashboard** → คลิก **"New"** → เลือก **"Web Service"**

2. **เชื่อมต่อ GitHub Repository**
   - เลือก repository: `muse-craft` (หรือชื่อ repo ของคุณ)
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
   Instance Type: Starter ($7/month)
   ```

4. **เพิ่ม Environment Variables:**
   - คลิก **"Advanced"** → **"Add Environment Variable"**
   - เพิ่มตัวแปรต่อไปนี้:
     ```
     NODE_ENV = production
     PORT = 10000
     FRONTEND_URL = https://muscraft.com
     ```

5. **เพิ่ม Persistent Disk (สำคัญสำหรับ Database):**
   - คลิก **"Add Disk"**
   - Name: `musecraft-database`
   - Mount Path: `/opt/render/project/src/backend/database`
   - Size: 1GB

6. **คลิก "Create Web Service"**
   - รอให้ build เสร็จ (ประมาณ 5-10 นาที)
   - บันทึก URL: `https://musecraft-backend.onrender.com`

---

### ขั้นตอนที่ 2: Deploy Frontend Service

1. **ไปที่ Render Dashboard** → คลิก **"New"** → เลือก **"Web Service"**

2. **เชื่อมต่อ GitHub Repository เดียวกัน**
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
   Instance Type: Starter ($7/month)
   ```

4. **เพิ่ม Environment Variables:**
   ```
   NODE_ENV = production
   NEXT_PUBLIC_API_URL = https://musecraft-backend.onrender.com
   PORT = 10000
   ```

5. **คลิก "Create Web Service"**
   - รอให้ build เสร็จ (ประมาณ 5-10 นาที)

---

### ขั้นตอนที่ 3: ตั้งค่า Custom Domain (muscraft.com)

1. **ใน Frontend Service** → ไปที่ **"Settings"** → **"Custom Domains"**

2. **คลิก "Add Custom Domain"**
   - ใส่: `muscraft.com`

3. **ตั้งค่า DNS:**
   
   **วิธีที่ 1: CNAME (แนะนำ)**
   - ไปที่ DNS provider ของคุณ (เช่น Namecheap, GoDaddy)
   - เพิ่ม CNAME record:
     ```
     Type: CNAME
     Name: @ (หรือเว้นว่างสำหรับ root domain)
     Value: musecraft-frontend.onrender.com
     TTL: 3600
     ```

   **วิธีที่ 2: A Record**
   - ใช้ IP addresses ที่ Render ให้มา
   - ดู IP addresses ใน Render dashboard

4. **รอ SSL Certificate**
   - Render จะสร้าง SSL certificate อัตโนมัติ
   - ใช้เวลาประมาณ 5-10 นาที
   - ตรวจสอบสถานะใน Render dashboard

5. **ทดสอบ**
   - เปิดเบราว์เซอร์ไปที่ `https://muscraft.com`
   - ควรเห็นหน้าเว็บ MuseCraft

---

### ขั้นตอนที่ 4: อัปเดต Backend CORS

หลังจาก frontend domain ทำงานแล้ว:

1. **ไปที่ Backend Service** → **"Environment"**

2. **อัปเดต Environment Variable:**
   ```
   FRONTEND_URL = https://muscraft.com
   ```

3. **คลิก "Save Changes"**
   - Service จะ restart อัตโนมัติ

---

## 🔄 Deploy ใหม่ (Re-deploy)

### วิธีที่ 1: Auto Deploy (แนะนำ)

1. **Push code ใหม่ไปยัง GitHub:**
   ```bash
   git add .
   git commit -m "Update code"
   git push origin main
   ```

2. **Render จะ deploy อัตโนมัติ**
   - ตรวจสอบใน Render dashboard
   - ดู build logs เพื่อติดตามความคืบหน้า

### วิธีที่ 2: Manual Deploy

1. **ไปที่ Service ใน Render Dashboard**

2. **คลิก "Manual Deploy"** → **"Deploy latest commit"**

3. **รอให้ build เสร็จ**

---

## ✅ ตรวจสอบหลัง Deploy

### Checklist

- [ ] **Backend Service**
  - [ ] Status: Live (สีเขียว)
  - [ ] Health check: เปิด `https://musecraft-backend.onrender.com` ควรเห็น "Hello World" หรือ response
  - [ ] Logs: ไม่มี error

- [ ] **Frontend Service**
  - [ ] Status: Live (สีเขียว)
  - [ ] เปิด `https://muscraft.com` ควรเห็นหน้าเว็บ
  - [ ] SSL Certificate: Active (มีรูปกุญแจในเบราว์เซอร์)
  - [ ] Logs: ไม่มี error

- [ ] **ทดสอบฟังก์ชันการทำงาน**
  - [ ] Sign in/Sign up ทำงาน
  - [ ] ดูสินค้าได้
  - [ ] เพิ่มสินค้าเข้าตะกร้าได้
  - [ ] สร้าง order ได้
  - [ ] Database เก็บข้อมูลได้ (ทดสอบโดยสร้าง user/product แล้ว restart service)

---

## 🐛 แก้ไขปัญหา

### Build ล้มเหลว

**อาการ:** Build fail ใน Render dashboard

**วิธีแก้:**
1. ดู Build Logs ใน Render dashboard
2. ตรวจสอบ error message
3. ปัญหาที่พบบ่อย:
   - **TypeScript errors**: แก้ไข type errors
   - **Missing dependencies**: ตรวจสอบ `package.json`
   - **Build timeout**: เพิ่ม build timeout ใน Render settings

**ตัวอย่างคำสั่งตรวจสอบ:**
```bash
# ทดสอบ build ในเครื่อง
cd backend
npm install
npm run build

cd ../frontend
npm install
npm run build
```

---

### 500 Internal Server Error

**อาการ:** หน้าเว็บแสดง 500 error

**วิธีแก้:**
1. ดู Service Logs ใน Render dashboard
2. ตรวจสอบ:
   - Environment variables ครบถ้วนหรือไม่
   - Database files มีสิทธิ์เข้าถึงหรือไม่
   - Port conflicts

**ตรวจสอบ Logs:**
```bash
# ใน Render dashboard → Service → Logs
# ดู error messages
```

---

### CORS Errors

**อาการ:** Console แสดง CORS error

**วิธีแก้:**
1. ตรวจสอบ `FRONTEND_URL` ใน Backend service
   - ต้องตรงกับ domain จริง: `https://muscraft.com`
2. ตรวจสอบ CORS config ใน `backend/src/main.ts`
3. Restart backend service

---

### รูปภาพไม่แสดง

**อาการ:** รูปสินค้าไม่แสดง

**วิธีแก้:**
1. ตรวจสอบว่าไฟล์รูปอยู่ใน `frontend/public/img/`
2. ตรวจสอบชื่อไฟล์ (case-sensitive)
3. ตรวจสอบ path ใน `frontend/lib/products/store.ts`

---

### Domain ไม่ทำงาน

**อาการ:** `muscraft.com` ไม่เปิด

**วิธีแก้:**
1. ตรวจสอบ DNS records
   - ใช้ `nslookup muscraft.com` หรือ `dig muscraft.com`
2. รอ DNS propagation (อาจใช้เวลาถึง 48 ชั่วโมง)
3. ตรวจสอบ SSL certificate status ใน Render dashboard

---

### Database ข้อมูลหาย

**อาการ:** ข้อมูลหายหลังจาก restart

**วิธีแก้:**
1. ตรวจสอบว่า Persistent Disk ถูก mount แล้ว
2. ตรวจสอบ Mount Path: `/opt/render/project/src/backend/database`
3. ตรวจสอบ Disk size เพียงพอหรือไม่

---

## 📞 สรุป

### URLs ที่สำคัญ
- **Backend API**: `https://musecraft-backend.onrender.com`
- **Frontend**: `https://muscraft.com`
- **Render Dashboard**: https://dashboard.render.com

### Environment Variables

**Backend:**
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://muscraft.com
```

**Frontend:**
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://musecraft-backend.onrender.com
PORT=10000
```

### ค่าใช้จ่าย
- **Starter Plan**: $7/เดือน ต่อ service
- **Total**: ~$14/เดือน (Backend + Frontend)

---

## 🎉 เสร็จสิ้น!

หากมีปัญหาหรือคำถามเพิ่มเติม:
1. ตรวจสอบ Render service logs
2. ตรวจสอบ browser console
3. ตรวจสอบ network tab ใน DevTools

**Happy Deploying! 🚀**

