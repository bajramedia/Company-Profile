# 🎯 Langkah Selanjutnya - Deploy ke Vercel

## ✅ Status Saat Ini
- ✅ Code sudah di-push ke GitHub: https://github.com/AnggaPuspa/bajramedia
- ✅ Database MySQL sudah dikonfigurasi
- ✅ Build scripts sudah siap
- ✅ Environment configuration sudah dipersiapkan

## 🚀 Langkah Deployment ke Vercel

### 1. Buka Vercel
- Pergi ke: https://vercel.com
- Login dengan akun GitHub Anda

### 2. Import Project
- Klik **"New Project"**
- Pilih repository **"AnggaPuspa/bajramedia"**
- Klik **"Import"**

### 3. ⚠️ PENTING - Konfigurasi Environment Variables

**SEBELUM** deploy, pastikan menambahkan environment variable:

1. **Di halaman import project Vercel:**
   - Expand **"Environment Variables"** section
   - Jangan langsung deploy dulu!

2. **Tambahkan variable:**
   - **Name:** `DATABASE_URL`
   - **Value:** Connection string database MySQL production Anda
   - **Environment:** Pilih "Production", "Preview", dan "Development"

**Format connection string:**
```
mysql://username:password@host:port/database_name
```

**Contoh:**
```
mysql://u980665614_bajramedia:yourpassword@yourhost:3306/u980665614_bajramedia
```

⚠️ **CATATAN:** Pastikan DATABASE_URL sudah ditambahkan SEBELUM klik Deploy!

### 4. Deploy
- Klik **"Deploy"**
- Tunggu proses build selesai (sekitar 2-3 menit)

### 5. Setup Database Schema
Setelah deployment berhasil, jalankan migration:

**Option A: Via Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel link
npx prisma db push
npx prisma db seed
```

**Option B: Via Database Console**
- Connect ke database production
- Import schema dari Prisma
- Run seed data

## 📋 Checklist Verifikasi

Setelah deployment, pastikan:

- [ ] Website dapat diakses
- [ ] Homepage loading dengan benar  
- [ ] Blog page menampilkan posts
- [ ] Admin panel dapat diakses di `/admin`
- [ ] Database terkoneksi dengan benar

## 🎉 Selesai!

Jika semua langkah berhasil, website Bajramedia sudah live di Vercel!

**Domain Vercel:** https://bajramedia.vercel.app (atau sesuai yang diberikan Vercel)

---

💡 **Tips:** Simpan dokumentasi ini untuk referensi deploy selanjutnya!
