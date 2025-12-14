@echo off
echo Iniciando servicios del Concejo Municipal de Guachucal...
echo.
echo Iniciando servidor backend...
start "Servidor Backend" cmd /k "cd server && npm start"
timeout /t 3 /nobreak >nul
echo.
echo Iniciando cliente frontend...
start "Cliente Frontend" cmd /k "cd client && npm start"
echo.
echo Servicios iniciados. Verifique las ventanas que se abrieron.
pause








