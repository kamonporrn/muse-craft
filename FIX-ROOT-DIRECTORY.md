# 🔧 แก้ไขปัญหา Root Directory ใน Render

## ❌ ปัญหาที่พบ

```
Service Root Directory "/opt/render/project/src/src" is missing.
cd: /opt/render/project/src/src: No such file or directory
```

## ✅ วิธีแก้ไข

### วิธีที่ 1: แก้ไขใน Render Dashboard (แนะนำ)

1. **ไปที่ Service ที่มีปัญหา** ใน Render Dashboard

2. **ไปที่ Settings** → **"Build & Deploy"**

3. **ตรวจสอบ Root Directory:**
   - ควรเป็น: `backend` (สำหรับ backend service)
   - หรือ: `frontend` (สำหรับ frontend service)
   - ❌ **ไม่ควรเป็น:** `src` หรือ `backend/src` หรือ `frontend/src`

4. **แก้ไข Root Directory:**
   - Backend Service: ตั้งเป็น `backend`
   - Frontend Service: ตั้งเป็น `frontend`

5. **ตรวจสอบ Build Command:**
   - Backend: `npm install && npm run build` (ไม่ต้อง cd เพราะ rootDir ถูกตั้งเป็น `backend` แล้ว)
   - Frontend: `npm install && npm run build` (ไม่ต้อง cd เพราะ rootDir ถูกตั้งเป็น `frontend` แล้ว)

6. **ตรวจสอบ Start Command:**
   - Backend: `npm run start:prod` (ไม่ต้อง cd)
   - Frontend: `npm run start` (ไม่ต้อง cd)

7. **คลิก "Save Changes"**

8. **Manual Deploy** → **"Deploy latest commit"**

---

### วิธีที่ 2: ใช้ render.yaml

1. **ตรวจสอบ render.yaml** ใน root directory:
   ```yaml
   services:
     - type: web
       name: musecraft-backend
       rootDir: backend  # ✅ ต้องเป็น backend
       buildCommand: npm install && npm run build  # ไม่ต้อง cd เพราะ rootDir ถูกตั้งแล้ว
       startCommand: npm run start:prod
   ```

2. **Commit และ Push:**
   ```bash
   git add render.yaml
   git commit -m "Fix root directory configuration"
   git push origin main
   ```

3. **Render จะ deploy อัตโนมัติ**

---

## 📋 Checklist การตั้งค่า

### Backend Service

- ✅ **Root Directory:** `backend`
- ✅ **Build Command:** `npm install && npm run build`
- ✅ **Start Command:** `npm run start:prod`
- ✅ **Environment Variables:**
  ```
  NODE_ENV=production
  PORT=10000
  FRONTEND_URL=https://musecraft-frontend.onrender.com
  ```

### Frontend Service

- ✅ **Root Directory:** `frontend`
- ✅ **Build Command:** `npm install && npm run build`
- ✅ **Start Command:** `npm run start`
- ✅ **Environment Variables:**
  ```
  NODE_ENV=production
  NEXT_PUBLIC_API_URL=https://musecraft-backend.onrender.com
  PORT=10000
  ```

---

## 🎯 โครงสร้าง Directory ที่ถูกต้อง

```
muse-craft/
├── backend/          ← Root Directory สำหรับ Backend Service
│   ├── src/
│   ├── package.json
│   └── ...
├── frontend/         ← Root Directory สำหรับ Frontend Service
│   ├── app/
│   ├── package.json
│   └── ...
└── render.yaml
```

---

## ⚠️ สิ่งที่ไม่ควรทำ

- ❌ ตั้ง Root Directory เป็น `src`
- ❌ ตั้ง Root Directory เป็น `backend/src`
- ❌ ตั้ง Root Directory เป็น `frontend/src`
- ❌ ตั้ง Root Directory เป็น `/opt/render/project/src/src`

---

## 🔍 ตรวจสอบว่าแก้ไขสำเร็จ

1. **ดู Build Logs:**
   - ควรเห็น: `Installing dependencies...`
   - ไม่ควรเห็น: `cd: /opt/render/project/src/src: No such file or directory`

2. **ตรวจสอบ Service Status:**
   - Status: Live (สีเขียว)
   - Health check: Pass

3. **ทดสอบ API:**
   - Backend: `https://musecraft-backend.onrender.com`
   - Frontend: `https://musecraft-frontend.onrender.com`

---

## 💡 Tips

- **ใช้ render.yaml** เพื่อให้ configuration สอดคล้องกัน
- **ตรวจสอบ Root Directory** ก่อน deploy
- **ดู Build Logs** เพื่อ debug ปัญหา

---

## 📞 หากยังมีปัญหา

1. ลบ Service เก่า
2. สร้าง Service ใหม่
3. ตั้งค่า Root Directory ให้ถูกต้องตั้งแต่ต้น

---

**แก้ไขเสร็จแล้ว! 🎉**

