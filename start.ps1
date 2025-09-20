# GenEngine Startup Script
Write-Host "Starting GenEngine..." -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "Starting Backend Server (Cloudflare Worker)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host 'Backend Server Starting on http://localhost:8787' -ForegroundColor Yellow; npm run dev"

# Wait a moment for backend to initialize
Start-Sleep -Seconds 2

# Start Frontend
Write-Host "Starting Frontend Server (React + Vite)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host 'Frontend Server Starting on http://localhost:5173' -ForegroundColor Yellow; npm run dev"

Write-Host ""
Write-Host "GenEngine is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "Backend will be available at: http://localhost:8787" -ForegroundColor White
Write-Host "Frontend will be available at: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Once both servers are running, open your browser to http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to close this window (servers will continue running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")