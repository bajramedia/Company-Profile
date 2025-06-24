# ✅ Bajramedia MySQL Setup - Next Steps

## What I've Done

✅ **Updated Prisma Schema**: Changed from SQLite to MySQL  
✅ **Environment Configuration**: Your `.env` is already configured for MySQL  
✅ **Created Setup Scripts**: `setup-mysql.bat` and `setup-mysql.ps1`  
✅ **Database Configuration**: Username `root`, no password, database `db_bajramedia`  

## What You Need to Do Next

### Step 1: Install MySQL or MariaDB

**Option A: MySQL (Recommended)**
1. Download from: https://dev.mysql.com/downloads/installer/
2. Choose "Custom" installation
3. Install MySQL Server
4. **Important**: When asked for root password, leave it BLANK
5. Choose "Legacy Authentication Method"

**Option B: MariaDB**
1. Download from: https://mariadb.org/download/
2. Install with default settings
3. **Important**: When asked for root password, leave it BLANK

**Option C: XAMPP (Easiest)**
1. Download from: https://www.apachefriends.org/
2. Install and start MySQL from XAMPP Control Panel

### Step 2: Create Database and Setup

After installation, open PowerShell in your project directory and run:

```powershell
# Navigate to project
cd d:\LandingPage\bajramedia

# Create database (run the script I created)
.\setup-mysql.bat

# Generate Prisma client for MySQL
npx prisma generate

# Create tables in database
npx prisma db push

# Seed with initial data
npm run db:seed

# Start development server
npm run dev
```

## Database Connection Details

- **Host**: localhost:3306
- **Username**: root
- **Password**: (none/blank)
- **Database**: db_bajramedia
- **Connection String**: `mysql://root@localhost:3306/db_bajramedia`

## Troubleshooting

**If MySQL command not found:**
- Restart PowerShell after installation
- Or restart your computer
- Check if MySQL service is running in Windows Services

**If database creation fails:**
- Open MySQL Workbench or MySQL Command Line
- Run manually: `CREATE DATABASE IF NOT EXISTS db_bajramedia;`

**If you prefer a different root password:**
- Update your `.env` file: `DATABASE_URL="mysql://root:yourpassword@localhost:3306/db_bajramedia"`

## Files Created/Modified

- ✅ `prisma/schema.prisma` - Updated to use MySQL
- ✅ `setup-mysql.bat` - Windows batch script for database setup
- ✅ `setup-mysql.ps1` - PowerShell script for database setup  
- ✅ `setup-mysql.sql` - SQL commands for manual setup
- ✅ `INSTALL-DATABASE.md` - Detailed installation guide
- ✅ `DEPLOYMENT.md` - Updated with local development setup

Your project is now ready for MySQL/MariaDB! 🚀
