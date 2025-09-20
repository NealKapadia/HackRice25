$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    currentCode = ""
    promptHistory = @()
    newPrompt = "Create a red ball in the center of the canvas"
} | ConvertTo-Json

Write-Host "Testing GenEngine API..." -ForegroundColor Yellow
Write-Host "Endpoint: http://localhost:8787/api/generate" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8787/api/generate" -Method POST -Headers $headers -Body $body
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Explanation:" -ForegroundColor Yellow
    Write-Host $response.explanation
    Write-Host ""
    Write-Host "Generated Code Preview (first 500 chars):" -ForegroundColor Yellow
    $preview = if ($response.newCode.Length -gt 500) { $response.newCode.Substring(0, 500) + "..." } else { $response.newCode }
    Write-Host $preview
} catch {
    Write-Host "ERROR!" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Response:" $errorBody
    }
}