# 🚀 Setup Vercel dengan API Bridge di Hosting cPanel

## 📋 Arsitektur Hybrid Deployment

- **Frontend Next.js**: Deploy ke Vercel ⚡
- **Database + API Bridge**: Tetap di hosting cPanel 🗄️
- **Connection**: Vercel call API ke hosting kamu

## 1. 🔧 Environment Variables di Vercel

Saat deploy ke Vercel, tambahkan environment variables ini:

| Variable                   | Value                                   | Description               |
| -------------------------- | --------------------------------------- | ------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | `https://bajramedia.com/api_bridge.php` | URL API bridge di hosting |
| `ADMIN_EMAIL`              | `admin@bajramedia.com`                  | Email admin untuk demo    |
| `ADMIN_PASSWORD`           | `admin123`                              | Password admin untuk demo |

## 2. 📝 Cara Setting di Vercel Dashboard

1. Buka project di [vercel.com](https://vercel.com)
2. Go to **Settings** → **Environment Variables**
3. Add variables di atas
4. **Redeploy** project

## 3. 🌐 Update CORS di API Bridge

API bridge di hosting harus allow request dari Vercel domain:

```php
header('Access-Control-Allow-Origin: https://your-vercel-app.vercel.app');
// atau untuk development juga:
header('Access-Control-Allow-Origin: *');
```

## 4. 🔄 API Service Configuration

Next.js akan call ke hosting API bridge instead of local database.

## 5. ✅ Testing Checklist

- [ ] Environment variables set di Vercel
- [ ] API bridge accessible dari internet
- [ ] CORS configured properly
- [ ] Frontend dapat load data dari API
- [ ] Admin panel berfungsi
- [ ] Blog posts tampil
- [ ] Portfolio items tampil

## 6. 🚀 Deploy Commands

```bash
# Push ke GitHub
git add .
git commit -m "Setup for Vercel hybrid deployment"
git push origin main

# Vercel akan auto-deploy dari GitHub
```

## 7. 🎯 Benefits Hybrid Setup

✅ **Database tetap di hosting** - Nggak perlu migrate  
✅ **Frontend di Vercel** - Super cepat dan auto-scale  
✅ **Cost effective** - Cuma bayar hosting biasa  
✅ **Easy maintenance** - Database management tetap familiar

## 8. 📞 Domain Setup

Setelah deploy:

1. Vercel kasih domain `.vercel.app`
2. Bisa add custom domain kalau mau
3. API tetap pakai domain hosting kamu

---

**🎉 Ready to deploy!** Frontend modern di Vercel, database tetap di hosting!
