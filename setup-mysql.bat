@echo off
echo Setting up MySQL/MariaDB database for Bajramedia...

echo Testing MySQL connection...
mysql -u root -e "SELECT VERSION();"
if %errorlevel% neq 0 (
    echo ERROR: MySQL/MariaDB is not accessible
    echo Please make sure MySQL/MariaDB is installed and running
    echo To install:
    echo 1. Download from https://dev.mysql.com/downloads/installer/ ^(MySQL^)
    echo 2. Or download from https://mariadb.org/download/ ^(MariaDB^)
    echo 3. Install and start the service
    pause
    exit /b 1
)

echo Creating database 'db_bajramedia'...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS db_bajramedia;"
if %errorlevel% neq 0 (
    echo ERROR: Failed to create database
    pause
    exit /b 1
)

echo Testing database connection...
mysql -u root -D db_bajramedia -e "SELECT 'Connection successful!' as message;"
if %errorlevel% neq 0 (
    echo ERROR: Database connection test failed
    pause
    exit /b 1
)

echo.
echo SUCCESS: Database setup completed!
echo.
echo Now run these commands:
echo 1. npx prisma generate
echo 2. npx prisma db push  
echo 3. npm run db:seed
echo.
echo Your DATABASE_URL is: mysql://root@localhost:3306/db_bajramedia
echo.
pause
