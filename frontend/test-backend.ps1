$body = @{ username = "testuser"; password = "12345" } | ConvertTo-Json

Write-Host "=== Бекенд /api/events тексеру ===" -ForegroundColor Cyan
Write-Host "Port 8080 тексеру..."

# 1. Events endpoint — AUTH жоқ сынау
try {
    $r1 = Invoke-WebRequest -Uri "http://localhost:8080/api/events" -Method GET -UseBasicParsing -ErrorAction Stop
    Write-Host "GET /api/events => $($r1.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "GET /api/events => $($_.Exception.Response.StatusCode.value__) (JWT қажет — OK)" -ForegroundColor Yellow
}

# 2. Register
Write-Host ""
Write-Host "=== Register тексеру ===" -ForegroundColor Cyan
$regBody = @{ firstname="Test"; lastname="User"; email="test@tusa.kz"; username="testuser"; password="12345" } | ConvertTo-Json
try {
    $r2 = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/register" -Method POST -ContentType "application/json" -Body $regBody -ErrorAction Stop
    Write-Host "Register => SUCCESS: token=$($r2.token.Substring(0, [Math]::Min(30, $r2.token.Length)))..." -ForegroundColor Green
    $token = $r2.token
} catch {
    Write-Host "Register => $($_.Exception.Message)" -ForegroundColor Yellow
    $token = $null
}

# 3. Login
Write-Host ""
Write-Host "=== Login тексеру ===" -ForegroundColor Cyan
$loginBody = @{ username="testuser"; password="12345" } | ConvertTo-Json
try {
    $r3 = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/authenticate" -Method POST -ContentType "application/json" -Body $loginBody -ErrorAction Stop
    Write-Host "Login => SUCCESS: token=$($r3.token.Substring(0, [Math]::Min(40, $r3.token.Length)))..." -ForegroundColor Green
    $token = $r3.token
} catch {
    Write-Host "Login => $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Events with JWT
if ($token) {
    Write-Host ""
    Write-Host "=== Events JWT-мен тексеру ===" -ForegroundColor Cyan
    try {
        $headers = @{ Authorization = "Bearer $token" }
        $r4 = Invoke-RestMethod -Uri "http://localhost:8080/api/events" -Method GET -Headers $headers -ErrorAction Stop
        Write-Host "GET /api/events (JWT) => $($r4.Count) ивент" -ForegroundColor Green
        $r4 | Select-Object id, title, location | Format-Table
    } catch {
        Write-Host "Events JWT => $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Фронтенд порты ===" -ForegroundColor Cyan
try {
    $ports = netstat -ano | Select-String "LISTENING" | Select-String ":517"
    Write-Host $ports
} catch {}
