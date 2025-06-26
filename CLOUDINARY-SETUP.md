# 🌥️ Cloudinary Setup Guide - Bajramedia Project

## Masalah yang dialami

- ❌ Image upload tidak berfungsi
- ❌ Error saat upload ke Cloudinary
- ❌ Environment variables tidak diset dengan benar

## 🚀 Langkah Setup Cloudinary

### 1. Daftar/Login ke Cloudinary

1. Buka https://cloudinary.com
2. Daftar account baru atau login
3. Pilih plan **Free** (sudah cukup untuk development)

### 2. Ambil Credentials dari Dashboard

Setelah login, buka **Dashboard** dan catat:

- ☁️ **Cloud Name**: `dxxxxxxxx`
- 🔑 **API Key**: `123456789012345`
- 🔐 **API Secret**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. Setup Environment Variables

#### Untuk Development (Local)

Buat file `.env.local` di root project:

```bash
# Cloudinary Configuration - WAJIB DIISI!
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Database Configuration (sudah ada)
NEXT_PUBLIC_API_BASE_URL=https://bajramedia.com/api_bridge.php
ADMIN_EMAIL=admin@bajramedia.com
ADMIN_PASSWORD=admin123
```

#### Untuk Production (Vercel)

Di Vercel Dashboard → Settings → Environment Variables, tambahkan:

- `CLOUDINARY_CLOUD_NAME` = `your_cloud_name`
- `CLOUDINARY_API_KEY` = `your_api_key`
- `CLOUDINARY_API_SECRET` = `your_api_secret`

### 4. Test Setup

#### Test via API Endpoint

```bash
# Test local development
curl http://localhost:3000/api/test-cloudinary-simple

# Test production
curl https://company-profile-mu-nine.vercel.app/api/test-cloudinary-simple
```

Harusnya return:

```json
{
  "success": true,
  "message": "Cloudinary connection successful! ✅",
  "config": {
    "cloud_name": "your_cloud_name",
    "api_key_present": true,
    "api_secret_present": true
  }
}
```

#### Test Upload

```bash
# Test upload minimal
curl -X POST http://localhost:3000/api/debug/upload
```

### 5. Troubleshooting

#### Error: "Cloudinary not configured"

- ✅ Pastikan semua 3 environment variables sudah diset
- ✅ Restart development server: `npm run dev`
- ✅ Check typo di nama environment variables

#### Error: "Invalid API Key/Secret"

- ✅ Double check credentials di Cloudinary Dashboard
- ✅ Pastikan tidak ada spasi di awal/akhir
- ✅ Regenerate API secret jika perlu

#### Error: "File size too large"

- ✅ Cloudinary free tier limit: 10MB per file
- ✅ Compress image sebelum upload
- ✅ Atau gunakan input URL sebagai alternatif

#### Error: "Quota exceeded"

- ✅ Cloudinary free tier: 25 credits/month
- ✅ 1 upload image = ~1 credit
- ✅ Monitor usage di Dashboard

## 📋 Checklist Setup

- [ ] Daftar/login ke Cloudinary
- [ ] Ambil Cloud Name, API Key, API Secret
- [ ] Set environment variables di `.env.local`
- [ ] Restart development server
- [ ] Test connection via `/api/test-cloudinary-simple`
- [ ] Test upload via admin panel
- [ ] Deploy ke Vercel dengan environment variables
- [ ] Test upload di production

## 🆘 Jika Masih Error

1. **Check Console Logs**: Buka Developer Tools → Console saat upload
2. **Check Server Logs**: Lihat terminal saat jalankan `npm run dev`
3. **Test API Endpoints**: Gunakan curl commands di atas
4. **Verify Credentials**: Login ulang ke Cloudinary dan check credentials

## 💡 Tips

- Gunakan folder `bajramedia/blog` untuk organize uploads
- Image otomatis dioptimasi ke WebP format
- Maksimal file size: 10MB
- Support format: JPEG, PNG, GIF, WebP
- Jika Cloudinary tidak work, masih bisa pakai URL input sebagai fallback
