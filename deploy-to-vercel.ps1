# 🚀 Deploy Bajramedia to Vercel (Hybrid Architecture)
# Frontend: Vercel | Backend: cPanel Hosting

Write-Host "🚀 Bajramedia Vercel Deployment" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check git status
Write-Host "📋 Checking git status..." -ForegroundColor Blue
$gitStatus = git status --porcelain 2>$null
if ($gitStatus) {
    Write-Host "⚠️  You have uncommitted changes:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    $continue = Read-Host "Continue deployment? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "❌ Deployment cancelled" -ForegroundColor Red
        exit 1
    }
}

# Check if API bridge is accessible
Write-Host "🔍 Testing API bridge connection..." -ForegroundColor Blue
try {
    $apiUrl = "https://bajramedia.com/api_bridge.php?endpoint=categories"
    $response = Invoke-WebRequest -Uri $apiUrl -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ API bridge accessible" -ForegroundColor Green
    } else {
        Write-Host "⚠️  API bridge returned status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Cannot access API bridge at bajramedia.com" -ForegroundColor Red
    Write-Host "   Make sure api_bridge.php is uploaded to your hosting" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

# Build test
Write-Host "🔨 Testing build..." -ForegroundColor Blue
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please fix errors first." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful!" -ForegroundColor Green

# Commit and push changes
Write-Host "📤 Committing and pushing changes..." -ForegroundColor Blue
git add .
$commitMessage = "Deploy: Hybrid architecture setup for Vercel + cPanel"
git commit -m $commitMessage
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Changes pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to push changes" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎯 Next Steps for Vercel:" -ForegroundColor Yellow
Write-Host "1. Go to https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host "2. Import your GitHub repository" -ForegroundColor Cyan
Write-Host "3. Add these Environment Variables:" -ForegroundColor Cyan
Write-Host "   NEXT_PUBLIC_API_BASE_URL = https://bajramedia.com/api_bridge.php" -ForegroundColor White
Write-Host "   ADMIN_EMAIL = admin@bajramedia.com" -ForegroundColor White
Write-Host "   ADMIN_PASSWORD = admin123" -ForegroundColor White
Write-Host "4. Deploy!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 See VERCEL-SETUP.md for detailed instructions" -ForegroundColor Magenta
Write-Host ""
Write-Host "🎉 Ready for hybrid deployment!" -ForegroundColor Green
Write-Host "   Frontend: Vercel ⚡" -ForegroundColor Green
Write-Host "   Backend:  Your cPanel hosting 🗄️" -ForegroundColor Green 