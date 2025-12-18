# Script para iniciar los servicios del Concejo Municipal de Guachucal
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Servicios del Concejo" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "server") -or -not (Test-Path "client")) {
    Write-Host "Error: Este script debe ejecutarse desde la raíz del proyecto" -ForegroundColor Red
    exit 1
}

# Iniciar servidor backend
Write-Host "Iniciando servidor backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; Write-Host 'Servidor Backend - Concejo Municipal' -ForegroundColor Green; Write-Host '========================================' -ForegroundColor Green; npm start"

# Esperar un momento
Start-Sleep -Seconds 3

# Iniciar cliente frontend
Write-Host "Iniciando cliente frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\client'; Write-Host 'Cliente Frontend - Concejo Municipal' -ForegroundColor Green; Write-Host '========================================' -ForegroundColor Green; npm start"

Write-Host ""
Write-Host "Servicios iniciados!" -ForegroundColor Green
Write-Host "- Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presione cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")












