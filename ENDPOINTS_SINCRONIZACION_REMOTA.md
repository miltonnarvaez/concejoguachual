# Endpoints de Sincronización Remota

Este documento describe los endpoints que deben estar implementados en el servidor remoto para permitir la sincronización de archivos.

## Endpoints Requeridos

### 1. GET `/api/repositorio/sincronizacion/listar`

**Descripción:** Lista todos los archivos del repositorio con sus hashes MD5 para comparación.

**Respuesta:**
```json
{
  "categorias": {
    "documentos-actas-sesion": {
      "nombre": "Documentos - Actas de Sesión",
      "archivos": [
        {
          "nombre": "archivo.pdf",
          "hash": "abc123...",
          "tamaño": 1024000,
          "fechaSubida": "2025-01-01T00:00:00.000Z",
          "extension": ".pdf"
        }
      ],
      "total": 1
    }
  },
  "fechaConsulta": "2025-01-01T00:00:00.000Z"
}
```

**Código a agregar en `server/routes/repositorio.js`:**

```javascript
// Endpoint para sincronización remota - Listar todos los archivos con hashes
router.get('/sincronizacion/listar', (req, res) => {
  try {
    carpetas = cargarCarpetas();
    const todasLasCategorias = {};
    
    Object.keys(carpetas).forEach(cat => {
      const archivos = listarArchivosCarpeta(cat);
      todasLasCategorias[cat] = {
        nombre: carpetas[cat],
        archivos: archivos.map(archivo => ({
          nombre: archivo.nombre,
          hash: archivo.hash,
          tamaño: archivo.tamaño,
          fechaSubida: archivo.fechaSubida,
          extension: archivo.extension
        })),
        total: archivos.length
      };
    });
    
    res.json({
      categorias: todasLasCategorias,
      fechaConsulta: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error listando archivos para sincronización:', error);
    res.status(500).json({ error: 'Error listando archivos' });
  }
});
```

### 2. GET `/api/repositorio/descargar/:categoria/:nombreArchivo`

**Descripción:** Descarga un archivo específico del repositorio. Este endpoint ya debería existir.

**Parámetros:**
- `categoria`: ID de la categoría (ej: `documentos-actas-sesion`)
- `nombreArchivo`: Nombre del archivo a descargar

**Respuesta:** Archivo binario (download)

**Código (ya debería existir):**

```javascript
router.get('/descargar/:categoria/:nombreArchivo', (req, res) => {
  try {
    const { categoria, nombreArchivo } = req.params;
    const archivoPath = path.join(repositorioBaseDir, categoria, nombreArchivo);
    
    if (!fs.existsSync(archivoPath)) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    res.download(archivoPath);
  } catch (error) {
    console.error('Error descargando archivo:', error);
    res.status(500).json({ error: 'Error descargando archivo' });
  }
});
```

## Funciones Auxiliares Requeridas

Asegúrate de que estas funciones existan en `server/routes/repositorio.js`:

1. `cargarCarpetas()` - Carga las carpetas/categorías disponibles
2. `listarArchivosCarpeta(categoria)` - Lista archivos de una categoría
3. `calcularHash(filePath)` - Calcula hash MD5 de un archivo
4. `getFileInfo(filePath, categoria)` - Obtiene información de un archivo

## Pasos para Implementar

1. **Abrir el archivo** `server/routes/repositorio.js` en el servidor remoto

2. **Verificar que existan las funciones auxiliares:**
   - `cargarCarpetas()`
   - `listarArchivosCarpeta()`
   - `calcularHash()`
   - `getFileInfo()`

3. **Agregar el endpoint** `/sincronizacion/listar` (código arriba)

4. **Verificar que el endpoint** `/descargar/:categoria/:nombreArchivo` exista y sea público (sin autenticación)

5. **Reiniciar el servidor** para aplicar los cambios

## Verificación

Para verificar que los endpoints funcionan:

1. **Probar listar:**
   ```bash
   curl https://camsoft.com.co/concejoguachucal/api/repositorio/sincronizacion/listar
   ```

2. **Probar descargar:**
   ```bash
   curl https://camsoft.com.co/concejoguachucal/api/repositorio/descargar/documentos-actas-sesion/archivo.pdf
   ```

## Notas Importantes

- El endpoint `/sincronizacion/listar` debe ser **público** (sin autenticación) para permitir la sincronización
- El endpoint `/descargar` también debe ser **público** para permitir la descarga de archivos
- Los hashes MD5 son esenciales para detectar archivos modificados
- Asegúrate de que `calcularHash()` retorne el hash MD5 correcto

