# Script para convertir el informe Markdown a Word
# Requiere Pandoc instalado

$archivoMarkdown = "INFORME_ENTREGA_PROYECTO.md"
$archivoWord = "INFORME_ENTREGA_PROYECTO.docx"

# Verificar si Pandoc está instalado
$pandocPath = Get-Command pandoc -ErrorAction SilentlyContinue

if ($pandocPath) {
    Write-Host "Convirtiendo $archivoMarkdown a Word..." -ForegroundColor Green
    
    # Convertir a Word
    pandoc $archivoMarkdown -o $archivoWord --reference-doc=reference.docx 2>$null
    
    if (Test-Path $archivoWord) {
        Write-Host "✅ Conversión exitosa: $archivoWord" -ForegroundColor Green
    } else {
        # Intentar sin referencia
        pandoc $archivoMarkdown -o $archivoWord
        if (Test-Path $archivoWord) {
            Write-Host "✅ Conversión exitosa: $archivoWord" -ForegroundColor Green
        } else {
            Write-Host "❌ Error en la conversión" -ForegroundColor Red
        }
    }
} else {
    Write-Host "Pandoc no está instalado." -ForegroundColor Yellow
    Write-Host "Opciones:" -ForegroundColor Yellow
    Write-Host "1. Instalar Pandoc desde: https://pandoc.org/installing.html" -ForegroundColor Cyan
    Write-Host "2. Usar herramientas online como Dillinger.io o StackEdit.io" -ForegroundColor Cyan
    Write-Host "3. Abrir el archivo .md en Word directamente" -ForegroundColor Cyan
}

