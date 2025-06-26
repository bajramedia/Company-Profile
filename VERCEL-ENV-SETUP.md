# 🚀 Vercel Production Environment Variables Setup

## Environment Variables yang Harus Ditambahkan di Vercel

Masuk ke **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

### 1. Database Configuration

```
Name: NEXT_PUBLIC_API_BASE_URL
Value: https://bajramedia.com/api_bridge.php
Environment: Production, Preview, Development
```

### 2. Admin Configuration

```
Name: ADMIN_EMAIL
Value: admin@bajramedia.com
Environment: Production, Preview, Development
```

```
Name: ADMIN_PASSWORD
Value: admin123
Environment: Production, Preview, Development
```

### 3. Cloudinary Configuration (PALING PENTING!)

```
Name: CLOUDINARY_CLOUD_NAME
Value: dsv1rsopo
Environment: Production, Preview, Development
```

```
Name: CLOUDINARY_API_KEY
Value: 733327569616499
Environment: Production, Preview, Development
```

```
Name: CLOUDINARY_API_SECRET
Value: 1fa9MKt3mx5fuWjdmr-xo4RMXms
Environment: Production, Preview, Development
```

### 4. Optional Settings

```
Name: NEXT_PUBLIC_MAX_FILE_SIZE
Value: 10485760
Environment: Production, Preview, Development
```

## 📝 Checklist Setup Vercel

- [ ] Semua 6 environment variables sudah ditambahkan
- [ ] Pilih semua environment (Production, Preview, Development)
- [ ] No typos di values (especially cloud name: dsv1rsopo dengan angka 1)
- [ ] Save dan redeploy project

## 🔄 Redeploy Project

Setelah environment variables ditambahkan:

1. **Redeploy** project di Vercel
2. **Wait** sampai deployment selesai
3. **Test** functionality di production URL

## 🧪 Test Production

Test URLs berikut di production:

1. `https://your-vercel-url.vercel.app/api/debug`
2. `https://your-vercel-url.vercel.app/api/debug/cloudinary-setup`
3. `https://your-vercel-url.vercel.app/admin/login`

## Expected Results

✅ **Kalau berhasil:**

- Debug endpoint return Cloudinary configured: true
- Admin login berjalan normal
- Image upload ke Cloudinary working
- All admin features (posts, authors, categories, tags) working

❌ **Kalau gagal:**

- Check environment variables spelling
- Check if all 6 variables are added
- Check deployment logs di Vercel
