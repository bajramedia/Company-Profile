# 🧪 Test API Bridge Connection
Write-Host "🧪 Testing API Bridge Connection" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

$baseUrl = "https://bajramedia.com/api_bridge.php"

# Test endpoints
$endpoints = @(
    @{ name = "Categories"; url = "$baseUrl?endpoint=categories" },
    @{ name = "Posts"; url = "$baseUrl?endpoint=posts&limit=5" },
    @{ name = "Portfolio"; url = "$baseUrl?endpoint=portfolio" },
    @{ name = "Authors"; url = "$baseUrl?endpoint=authors" },
    @{ name = "Tags"; url = "$baseUrl?endpoint=tags" },
    @{ name = "Stats"; url = "$baseUrl?endpoint=stats" }
)

$successCount = 0
$totalCount = $endpoints.Count

foreach ($endpoint in $endpoints) {
    Write-Host "🔍 Testing $($endpoint.name)..." -ForegroundColor Blue
    
    try {
        $response = Invoke-WebRequest -Uri $endpoint.url -TimeoutSec 10 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            $data = $response.Content | ConvertFrom-Json
            
            if ($data -is [array]) {
                Write-Host "   ✅ Success - $($data.Count) items returned" -ForegroundColor Green
            } elseif ($data -is [object]) {
                Write-Host "   ✅ Success - Object returned" -ForegroundColor Green
            } else {
                Write-Host "   ✅ Success - Data returned" -ForegroundColor Green
            }
            
            $successCount++
        } else {
            Write-Host "   ❌ Failed - Status: $($response.StatusCode)" -ForegroundColor Red
        }
    } catch {
        Write-Host "   ❌ Failed - Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📊 Test Results:" -ForegroundColor Yellow
Write-Host "   Success: $successCount/$totalCount endpoints" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })

if ($successCount -eq $totalCount) {
    Write-Host ""
    Write-Host "🎉 All API endpoints working!" -ForegroundColor Green
    Write-Host "   Ready for Vercel deployment!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️  Some endpoints failed" -ForegroundColor Yellow
    Write-Host "   Check your API bridge configuration" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Next step: Run deploy-to-vercel.ps1" -ForegroundColor Cyan 