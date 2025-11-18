# ⚡ Deploy ฟรีแบบเร็ว (Quick Guide)

## 🎯 3 ขั้นตอนง่ายๆ

### 1️⃣ Push Code ไป GitHub
```bash
git add .
git commit -m "Deploy to free tier"
git push origin main
```

### 2️⃣ สร้าง Services ใน Render

**Backend:**
- New → Web Service
- Connect GitHub repo
- Name: `musecraft-backend`
- Root: `backend`
- Build: `npm install && npm run build`
- Start: `npm run start:prod`
- **Plan: Free** ⭐
- Env:
  ```
  NODE_ENV=production
  PORT=10000
  FRONTEND_URL=https://musecraft-frontend.onrender.com
  ```

**Frontend:**
- New → Web Service
- Connect GitHub repo (เดียวกัน)
- Name: `musecraft-frontend`
- Root: `frontend`
- Build: `npm install && npm run build`
- Start: `npm run start`
- **Plan: Free** ⭐
- Env:
  ```
  NODE_ENV=production
  NEXT_PUBLIC_API_URL=https://musecraft-backend.onrender.com
  PORT=10000
  ```

### 3️⃣ รอ Build เสร็จ

- Backend: `https://musecraft-backend.onrender.com`
- Frontend: `https://musecraft-frontend.onrender.com`

---

## ⚠️ ข้อจำกัดสำคัญ

1. **ข้อมูลจะหายเมื่อ restart** (ไม่มี persistent disk)
2. **Service จะ sleep หลัง 15 นาทีไม่ใช้งาน**
3. **Request แรกหลัง sleep ใช้เวลา ~30 วินาที**

---

## 💡 แก้ปัญหา Sleep

ใช้ **Uptime Robot** (ฟรี):
1. ไปที่ https://uptimerobot.com
2. สร้าง account
3. เพิ่ม Monitor:
   - URL: `https://musecraft-backend.onrender.com`
   - Interval: 5 minutes
4. ทำเหมือนกันสำหรับ frontend

---

## ✅ เสร็จแล้ว!

ดูรายละเอียดเพิ่มเติมใน `DEPLOY-FREE.md`

