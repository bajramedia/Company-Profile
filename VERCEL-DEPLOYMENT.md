# 🚀 Panduan Deploy ke Vercel - Bajramedia

## 📋 Langkah-langkah Deployment

### 1. Setup GitHub Repository

✅ **SUDAH SELESAI** - Repository sudah di-push ke GitHub:
- Repository: https://github.com/AnggaPuspa/bajramedia
- Branch: `main`
- Status: Ready for deployment

### 2. Setup Database (MySQL)

Anda memerlukan database MySQL yang dapat diakses dari internet. Pilihan yang direkomendasikan:

**Option A: PlanetScale (Gratis)**
1. Daftar di https://planetscale.com
2. Buat database baru
3. Dapatkan connection string

**Option B: Railway (Gratis dengan limit)**
1. Daftar di https://railway.app
2. Deploy MySQL database
3. Dapatkan connection string

**Option C: DigitalOcean/AWS/GCP**
1. Setup MySQL instance
2. Konfigurasi firewall untuk akses public
3. Dapatkan connection string

### 3. Deploy ke Vercel

1. **Login ke Vercel**
   - Buka https://vercel.com
   - Login dengan GitHub account

2. **Import Repository**
   - Klik "New Project"
   - Pilih GitHub repository Anda
   - Klik "Import"

3. **Konfigurasi Environment Variables**
   Tambahkan environment variable berikut:
   ```
   Name: DATABASE_URL
   Value: mysql://username:password@host:port/database_name
   ```
   
   Contoh:
   ```
   DATABASE_URL=mysql://user123:pass456@db.planetscale.com:3306/bajramedia_db
   ```

4. **Deploy**
   - Klik "Deploy"
   - Tunggu proses build selesai

### 4. Setup Database Schema

Setelah deployment berhasil, jalankan perintah berikut untuk setup database:

1. **Via Vercel CLI** (Recommended)
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login ke Vercel
   vercel login
   
   # Link project
   vercel link
   
   # Run database migration
   vercel env pull .env.local
   npx prisma db push
   npx prisma db seed
   ```

2. **Via Database Console** (Alternative)
   - Connect ke database MySQL Anda
   - Import schema dari file `prisma/schema.prisma`
   - Run seed data manually

### 5. Verifikasi Deployment

Cek hal-hal berikut setelah deployment:

- ✅ Website dapat diakses
- ✅ Homepage loading dengan benar
- ✅ Blog page menampilkan posts
- ✅ Admin panel dapat diakses di `/admin`
- ✅ View counter berfungsi
- ✅ Social sharing buttons berfungsi

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@host:3306/db` |

## 🛠 Build Configuration

Vercel sudah dikonfigurasi dengan:
- **Build Command**: `npm run build` (includes Prisma generate)
- **Install Command**: `npm install`
- **Output Directory**: `.next`
- **Node.js Version**: 18.x (default)

## 📱 Domain Configuration

Setelah deployment berhasil:
1. Vercel akan memberikan domain `.vercel.app`
2. Anda dapat menambahkan custom domain di dashboard Vercel
3. Untuk custom domain, konfigurasi DNS records sesuai instruksi Vercel

## 🐛 Troubleshooting

### Build Errors
```bash
# Jika ada error prisma
npx prisma generate
npm run build

# Jika ada error dependencies
npm ci
npm run build
```

### Database Connection Error
1. Pastikan DATABASE_URL benar
2. Pastikan database dapat diakses dari internet
3. Cek firewall settings
4. Pastikan credentials benar

### Runtime Errors
1. Check Vercel function logs
2. Pastikan environment variables sudah diset
3. Cek console browser untuk client-side errors

## 📞 Support

Jika ada masalah, cek:
1. Vercel deployment logs
2. Browser console untuk errors
3. Database connection status
4. Environment variables configuration

---

**🎉 Selamat! Website Bajramedia siap di production!**
