# Bajramedia - Deployment Guide

## Vercel Deployment

### Prerequisites
1. GitHub repository with your code
2. MySQL database (can use PlanetScale, Railway, or other MySQL hosting)
3. Vercel account

### Environment Variables
Add these environment variables in Vercel dashboard:

```
DATABASE_URL=mysql://username:password@host:port/database_name
```

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Add environment variables
   - Deploy

3. **Database Setup**
   - Make sure your MySQL database is accessible from the internet
   - Run migrations: `npx prisma db push`
   - Seed the database: `npm run db:seed`

### Build Commands
- Build Command: `npm run build`
- Install Command: `npm install`
- Output Directory: `.next`

### Environment Variables Required
- `DATABASE_URL`: Your MySQL connection string

### Post-Deployment
1. Check that the site loads correctly
2. Test blog functionality
3. Verify admin panel access
4. Test view tracking and social sharing

## Local Development

### Database Setup (First Time)

1. **Install MySQL or MariaDB** (see INSTALL-DATABASE.md for detailed instructions)
   - MySQL: <https://dev.mysql.com/downloads/installer/>
   - MariaDB: <https://mariadb.org/download/>
   - Or use XAMPP: <https://www.apachefriends.org/>

2. **Create Database**

   ```bash
   # Run the setup script
   .\setup-mysql.bat
   
   # Or manually create database
   mysql -u root -e "CREATE DATABASE IF NOT EXISTS db_bajramedia;"
   ```

3. **Setup Project**

   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npm run db:seed
   npm run dev
   ```

### Regular Development

```bash
npm install
npm run dev
```

### Database Configuration

Your `.env` file should contain:

```
DATABASE_URL="mysql://root@localhost:3306/db_bajramedia"
```

## Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```
