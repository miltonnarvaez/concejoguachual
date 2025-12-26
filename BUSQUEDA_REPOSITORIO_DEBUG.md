# Debug: Búsqueda en Repositorio

## Problema
La búsqueda no está devolviendo resultados del repositorio, aunque el archivo existe.

## Archivo de prueba
- **Nombre en sistema**: `1766679765561-ACUERDO_No_002_FEBRERO_28.pdf`
- **Ubicación**: `server/uploads/repositorio-temporal/documentos-acuerdos/`
- **Búsqueda**: `ACUERDO_No_002_FEBRERO_28.pdf`

## Cambios implementados

### Backend (`server/routes/busqueda.js`)
1. ✅ Función `buscarEnRepositorio()` agregada
2. ✅ Integrada en el endpoint `/api/busqueda`
3. ✅ Logging detallado agregado
4. ✅ Limpieza de wildcards SQL (`%`) del término de búsqueda

### Frontend (`client/src/pages/Busqueda.js`)
1. ✅ Sección de resultados del repositorio agregada
2. ✅ Filtro "Repositorio" agregado
3. ✅ Logging detallado agregado

## Estado actual
- La búsqueda se ejecuta pero devuelve 0 resultados del repositorio
- El archivo existe y es accesible
- Los logs deberían mostrar dónde está el problema

## Próximos pasos para debug

1. **Verificar logs del servidor** cuando se ejecuta la búsqueda:
   - Buscar: `🔍 Verificando búsqueda en repositorio`
   - Buscar: `🔍 Iniciando búsqueda en repositorio con término limpio`
   - Buscar: `📁 Directorio base`
   - Buscar: `✅ Coincidencia encontrada`

2. **Verificar logs del navegador** (F12):
   - Buscar: `Resultados de búsqueda completos`
   - Verificar si `repositorio` está en la respuesta

3. **Probar directamente la función**:
   ```javascript
   // En el servidor, probar:
   const buscarEnRepositorio = require('./routes/busqueda').buscarEnRepositorio;
   buscarEnRepositorio('ACUERDO_No_002_FEBRERO_28.pdf');
   ```

4. **Verificar rutas**:
   - Confirmar que `__dirname` apunta correctamente
   - Verificar que `repositorioBaseDir` existe

5. **Verificar búsqueda**:
   - El término de búsqueda debe coincidir con parte del nombre del archivo
   - El archivo tiene prefijo de timestamp: `1766679765561-ACUERDO_No_002_FEBRERO_28.pdf`
   - La búsqueda debería encontrar "ACUERDO_No_002_FEBRERO_28" dentro del nombre

## Posibles problemas

1. **Ruta incorrecta**: `__dirname` podría no apuntar donde esperamos
2. **Función no se ejecuta**: El código podría no estar llegando a la función
3. **Error silencioso**: Podría haber un try-catch que está ocultando el error
4. **Comparación de strings**: La búsqueda case-insensitive podría tener problemas

## Archivos modificados
- `server/routes/busqueda.js` - Función de búsqueda en repositorio
- `client/src/pages/Busqueda.js` - UI para mostrar resultados del repositorio

