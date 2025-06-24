# Database Installation Guide for Bajramedia

Since MySQL/MariaDB is not currently installed, you need to install one of them first.

## Option 1: Install MySQL (Recommended)

### Download and Install
1. Go to https://dev.mysql.com/downloads/installer/
2. Download "MySQL Installer for Windows"
3. Run the installer and choose "Custom" installation
4. Select:
   - MySQL Server
   - MySQL Workbench (optional, for GUI management)
5. During installation:
   - **Root Password**: Leave blank (press Enter when asked for password)
   - **Authentication Method**: Use Legacy Authentication Method
   - **Windows Service**: Enable "Start the MySQL Server at System Startup"

### Alternative: Using Chocolatey (if you have it)
```powershell
choco install mysql
```

## Option 2: Install MariaDB

### Download and Install
1. Go to https://mariadb.org/download/
2. Download the Windows MSI installer
3. Run the installer
4. During installation:
   - **Root Password**: Leave blank
   - **Enable access from remote machines**: Check this option
   - **Install as Windows service**: Check this option

### Alternative: Using Chocolatey (if you have it)
```powershell
choco install mariadb
```

## After Installation

1. **Restart your computer** or at least restart PowerShell
2. **Test the installation**:
   ```powershell
   mysql -u root
   ```
3. **Run the database setup**:
   ```powershell
   cd d:\LandingPage\bajramedia
   .\setup-mysql.bat
   ```

## Quick Setup with XAMPP (Alternative)

If you prefer an all-in-one solution:
1. Download XAMPP from https://www.apachefriends.org/
2. Install XAMPP
3. Start MySQL from XAMPP Control Panel
4. MySQL will be available at localhost:3306 with root user and no password

After XAMPP installation, run:
```powershell
cd d:\LandingPage\bajramedia
.\setup-mysql.bat
```

## Manual Database Creation (if needed)

If the automatic script doesn't work, you can create the database manually:

1. Open MySQL Command Line or MySQL Workbench
2. Connect as root user
3. Run this command:
   ```sql
   CREATE DATABASE IF NOT EXISTS db_bajramedia;
   ```

## Verify Setup

After installation and database creation, run these commands in your project directory:

```powershell
# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Seed the database with initial data
npm run db:seed

# Start the development server
npm run dev
```

Your database connection string is already configured in `.env`:
```
DATABASE_URL="mysql://root@localhost:3306/db_bajramedia"
```
