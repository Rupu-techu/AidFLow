$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $root "frontend\\aidflow-ui"
$backendExe = Join-Path $root "clean_env\\Scripts\\python.exe"
$npmExe = "C:\\Program Files\\nodejs\\npm.cmd"

function Test-PortListening {
  param([int]$Port)

  return $null -ne (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
}

if (-not (Test-Path -LiteralPath $backendExe)) {
  throw "Backend executable not found at $backendExe"
}

if (-not (Test-Path -LiteralPath $frontendDir)) {
  throw "Frontend directory not found at $frontendDir"
}

if (-not (Test-Path -LiteralPath $npmExe)) {
  throw "npm was not found at $npmExe"
}

if (-not (Test-PortListening -Port 8001)) {
  $backendCommand = "cd /d `"$root`" && clean_env\\Scripts\\python.exe api.py"
  Start-Process -FilePath "cmd.exe" `
    -ArgumentList @("/k", $backendCommand) `
    -WorkingDirectory $root
}

if (-not (Test-PortListening -Port 5173)) {
  $frontendCommand = "cd /d `"$frontendDir`" && `"$npmExe`" run dev -- --host 127.0.0.1 --port 5173"
  Start-Process -FilePath "cmd.exe" `
    -ArgumentList @("/k", $frontendCommand) `
    -WorkingDirectory $frontendDir
}

Write-Host "Backend:  http://127.0.0.1:8001"
Write-Host "Frontend: http://127.0.0.1:5173"
