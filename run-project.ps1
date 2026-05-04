# LocalKart Unified Runner Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   LocalKart Full-Stack Platform        " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Kill potentially hanging processes on ports 8080 and 3000
Write-Host "[0/4] Cleaning up existing processes..." -ForegroundColor Yellow
$ports = @(8080, 3000)
foreach ($port in $ports) {
    $procId = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1
    if ($procId) {
        Write-Host "Killing process on port $port (PID: $procId)..." -ForegroundColor Gray
        Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    }
}

# 2. Setup paths and dependencies
$PROJECT_ROOT = $PSScriptRoot
$MAVEN_PATH = Join-Path $PROJECT_ROOT "temp_maven\apache-maven-3.9.6\bin\mvn.cmd"
$FRONTEND_DIR = Join-Path $PROJECT_ROOT "frontend"
$BACKEND_DIR = Join-Path $PROJECT_ROOT "backend"

# 2.1 Check Frontend Dependencies
if (!(Test-Path (Join-Path $FRONTEND_DIR "node_modules"))) {
    Write-Host "[1/4] Installing Frontend Dependencies (takes a moment)..." -ForegroundColor Yellow
    Set-Location $FRONTEND_DIR
    Start-Process -FilePath "npm.cmd" -ArgumentList "install" -Wait -NoNewWindow
    Set-Location $PROJECT_ROOT
}

# 3. Check Database Status
Write-Host "[1/4] Checking Database..." -ForegroundColor Yellow
# Try to reach MySQL - using the provided password
$dbCheck = mysql -u root -pCHANGE_ME_IN_PRODUCTION -e "USE localkart_db; SELECT count(*) FROM products;" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Database check failed. Attempting to run anyway (Spring Boot may handle DB initialization)." -ForegroundColor Gray
}

# 4. Start Backend
Write-Host "[2/4] Starting Backend (Port 8080)..." -ForegroundColor Yellow
Set-Location $BACKEND_DIR
$BackendProcess = Start-Process -FilePath $MAVEN_PATH -ArgumentList "spring-boot:run" -PassThru -NoNewWindow
Set-Location $PROJECT_ROOT

# 5. Wait for Backend Health
Write-Host "Waiting for backend to be healthy..." -ForegroundColor DarkGray
$ready = $false
$maxRetries = 60
for ($i=0; $i -lt $maxRetries; $i++) {
    try {
        $health = Invoke-RestMethod -Uri "http://localhost:8080/api/health/ping" -ErrorAction SilentlyContinue
        if ($health.status -eq "success" -or $health -match "Pong") {
            $ready = $true
            break
        }
    } catch {
        # Silent retry
    }
    Write-Host "." -NoNewline -ForegroundColor DarkGray
    Start-Sleep -Seconds 2
}

if (-not $ready) {
    Write-Host "`nERROR: Backend failed to start in time. Check backend/logs or terminal output." -ForegroundColor Red
    exit 1
}
Write-Host "`nBackend is UP!" -ForegroundColor Green

# 6. Start Frontend
Write-Host "[3/4] Starting Frontend (Port 3000)..." -ForegroundColor Yellow
Set-Location $FRONTEND_DIR
# Using npm.cmd for Windows compatibility
$FrontendProcess = Start-Process -FilePath "npm.cmd" -ArgumentList "run dev -- --port 3000" -PassThru -NoNewWindow
Set-Location $PROJECT_ROOT

# 7. Final Launch
Write-Host "[4/4] Project is ready!" -ForegroundColor Green
Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   LocalKart is LIVE at http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Login: user@localkart.com / password123" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Keep script running and handle cleanup on exit
Write-Host "Press Ctrl+C to stop the project..."
try {
    while($true) { Start-Sleep -Seconds 1 }
} finally {
    Write-Host "`nCleaning up processes..." -ForegroundColor Yellow
    if ($BackendProcess) { Stop-Process -Id $BackendProcess.Id -Force -ErrorAction SilentlyContinue }
    if ($FrontendProcess) { Stop-Process -Id $FrontendProcess.Id -Force -ErrorAction SilentlyContinue }
}
