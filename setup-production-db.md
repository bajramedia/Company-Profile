# Setup Database untuk Production

# Setelah deployment berhasil, jalankan perintah ini untuk setup database:

# 1. Install Vercel CLI (jika belum ada)
npm install -g vercel

# 2. Login ke Vercel
vercel login

# 3. Link dengan project
vercel link

# 4. Pull environment variables
vercel env pull .env.local

# 5. Push schema ke database production
npx prisma db push

# 6. Seed database dengan data awal
npx prisma db seed
