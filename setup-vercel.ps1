# PowerShell script for Vercel deployment setup
Write-Host "🚀 Bajramedia Vercel Deployment Setup" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Check if git remote exists
try {
    $remote = git remote get-url origin 2>$null
    if (-not $remote) {
        throw "No remote found"
    }
    Write-Host "✅ Git remote found: $remote" -ForegroundColor Green
} catch {
    Write-Host "❌ No GitHub remote found!" -ForegroundColor Red
    Write-Host "Please add your GitHub repository:" -ForegroundColor Yellow
    Write-Host "git remote add origin https://github.com/USERNAME/REPOSITORY_NAME.git" -ForegroundColor Cyan
    Write-Host "git branch -M main" -ForegroundColor Cyan
    Write-Host "git push -u origin main" -ForegroundColor Cyan
    exit 1
}

# Check if MySQL is running
Write-Host "🔍 Checking MySQL connection..." -ForegroundColor Blue
try {
    mysql -u root -e "SELECT 1;" 2>$null
    Write-Host "✅ MySQL connection successful" -ForegroundColor Green
} catch {
    Write-Host "⚠️  MySQL not accessible, but continuing..." -ForegroundColor Yellow
}

# Generate Prisma client
Write-Host "📦 Generating Prisma client..." -ForegroundColor Blue
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma generate failed!" -ForegroundColor Red
    exit 1
}

# Test build
Write-Host "🔨 Testing build..." -ForegroundColor Blue
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Push to GitHub: git push origin main" -ForegroundColor Cyan
    Write-Host "2. Go to https://vercel.com" -ForegroundColor Cyan
    Write-Host "3. Import your GitHub repository" -ForegroundColor Cyan
    Write-Host "4. Add DATABASE_URL environment variable" -ForegroundColor Cyan
    Write-Host "5. Deploy!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📚 See VERCEL-DEPLOYMENT.md for detailed instructions" -ForegroundColor Magenta
} else {
    Write-Host "❌ Build failed! Please fix errors and try again." -ForegroundColor Red
    exit 1
}
