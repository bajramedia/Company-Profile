# PowerShell script to set up MySQL/MariaDB for Bajramedia project
# Make sure MySQL or MariaDB is installed and running

Write-Host "Setting up MySQL/MariaDB database for Bajramedia..." -ForegroundColor Green

# Check if MySQL is accessible
try {
    Write-Host "Testing MySQL connection..." -ForegroundColor Yellow
    mysql -u root -e "SELECT VERSION();"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ MySQL/MariaDB is accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ MySQL/MariaDB is not accessible. Please make sure it's installed and running." -ForegroundColor Red
    Write-Host "To install MySQL/MariaDB on Windows:" -ForegroundColor Yellow
    Write-Host "1. Download from https://dev.mysql.com/downloads/installer/ (MySQL)" -ForegroundColor Yellow
    Write-Host "2. Or download from https://mariadb.org/download/ (MariaDB)" -ForegroundColor Yellow
    Write-Host "3. Install and start the service" -ForegroundColor Yellow
    exit 1
}

# Create the database
Write-Host "Creating database 'db_bajramedia'..." -ForegroundColor Yellow
mysql -u root -e "CREATE DATABASE IF NOT EXISTS db_bajramedia;"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database 'db_bajramedia' created successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to create database" -ForegroundColor Red
    exit 1
}

# Test database connection with the full connection string
Write-Host "Testing database connection..." -ForegroundColor Yellow
mysql -u root -D db_bajramedia -e "SELECT 'Connection successful!' as message;"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database connection test successful" -ForegroundColor Green
} else {
    Write-Host "✗ Database connection test failed" -ForegroundColor Red
    exit 1
}

Write-Host "" -ForegroundColor White
Write-Host "Database setup completed! Now run:" -ForegroundColor Green
Write-Host "1. npx prisma generate" -ForegroundColor Cyan
Write-Host "2. npx prisma db push" -ForegroundColor Cyan
Write-Host "3. npm run db:seed" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "Your DATABASE_URL is: mysql://root@localhost:3306/db_bajramedia" -ForegroundColor Yellow
