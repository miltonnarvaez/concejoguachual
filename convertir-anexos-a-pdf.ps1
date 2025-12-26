# Script para convertir todos los anexos a PDF
# Requiere Pandoc o herramientas de conversión

$anexos = @(
    "ANEXO_A_MODULOS_IMPLEMENTADOS.md",
    "ANEXO_B_RUTAS_FUNCIONALIDADES.md",
    "ANEXO_C_DOCUMENTACION_TECNICA.md",
    "ANEXO_D_SCRIPTS_BASE_DATOS.md",
    "ANEXO_E_CONFIGURACIONES_SERVIDOR.md"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CONVERSIÓN DE ANEXOS A PDF" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si Pandoc está instalado
$pandocPath = Get-Command pandoc -ErrorAction SilentlyContinue

if ($pandocPath) {
    Write-Host "✅ Pandoc encontrado. Convirtiendo anexos..." -ForegroundColor Green
    Write-Host ""
    
    foreach ($anexo in $anexos) {
        if (Test-Path $anexo) {
            $pdfName = $anexo -replace '\.md$', '.pdf'
            Write-Host "Convirtiendo: $anexo -> $pdfName" -ForegroundColor Yellow
            
            try {
                pandoc $anexo -o $pdfName --pdf-engine=wkhtmltopdf 2>$null
                if (Test-Path $pdfName) {
                    Write-Host "  ✅ Convertido exitosamente: $pdfName" -ForegroundColor Green
                } else {
                    # Intentar sin especificar engine
                    pandoc $anexo -o $pdfName
                    if (Test-Path $pdfName) {
                        Write-Host "  ✅ Convertido exitosamente: $pdfName" -ForegroundColor Green
                    } else {
                        Write-Host "  ⚠️  No se pudo convertir: $anexo" -ForegroundColor Yellow
                    }
                }
            } catch {
                Write-Host "  ❌ Error al convertir: $anexo" -ForegroundColor Red
                Write-Host "     Error: $_" -ForegroundColor Red
            }
        } else {
            Write-Host "  ⚠️  Archivo no encontrado: $anexo" -ForegroundColor Yellow
        }
        Write-Host ""
    }
    
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Conversión completada" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    
} else {
    Write-Host "⚠️  Pandoc no está instalado." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opciones para convertir a PDF:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. INSTALAR PANDOC:" -ForegroundColor Yellow
    Write-Host "   Descarga desde: https://pandoc.org/installing.html" -ForegroundColor White
    Write-Host "   O instala con Chocolatey: choco install pandoc" -ForegroundColor White
    Write-Host ""
    Write-Host "2. USAR HERRAMIENTAS ONLINE:" -ForegroundColor Yellow
    Write-Host "   - Dillinger.io: https://dillinger.io/" -ForegroundColor White
    Write-Host "   - StackEdit.io: https://stackedit.io/" -ForegroundColor White
    Write-Host "   - Markdown to PDF: https://www.markdowntopdf.com/" -ForegroundColor White
    Write-Host ""
    Write-Host "3. USAR WORD:" -ForegroundColor Yellow
    Write-Host "   - Abre Word" -ForegroundColor White
    Write-Host "   - Archivo > Abrir > Selecciona el archivo .md" -ForegroundColor White
    Write-Host "   - Guardar como > PDF" -ForegroundColor White
    Write-Host ""
    Write-Host "4. USAR VISUAL STUDIO CODE:" -ForegroundColor Yellow
    Write-Host "   - Instala extensión 'Markdown PDF'" -ForegroundColor White
    Write-Host "   - Abre el archivo .md" -ForegroundColor White
    Write-Host "   - Clic derecho > Markdown PDF: Export (pdf)" -ForegroundColor White
    Write-Host ""
    Write-Host "Archivos a convertir:" -ForegroundColor Cyan
    foreach ($anexo in $anexos) {
        if (Test-Path $anexo) {
            Write-Host "  ✅ $anexo" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $anexo (no encontrado)" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

