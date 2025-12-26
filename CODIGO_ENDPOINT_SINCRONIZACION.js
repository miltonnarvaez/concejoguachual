// ============================================
// CÓDIGO PARA AGREGAR AL SERVIDOR REMOTO
// Archivo: server/routes/repositorio.js
// ============================================

// 1. VERIFICAR QUE EXISTA LA FUNCIÓN calcularHash (debe estar al inicio del archivo)
// Si no existe, agregar esta función:

const calcularHash = (filePath) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('md5');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } catch (error) {
    console.error('Error calculando hash:', error);
    return null;
  }
};

// 2. VERIFICAR QUE EXISTA LA FUNCIÓN getFileInfo
// Debe incluir el campo 'hash' en el objeto retornado:

const getFileInfo = (filePath, categoria, nota = null) => {
  const stats = fs.statSync(filePath);
  const fileName = path.basename(filePath);
  const fileSize = stats.size;
  const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
  const fechaSubida = stats.birthtime;
  
  // Cargar metadatos si existen
  const metadata = cargarMetadatos(categoria);
  const notaArchivo = nota || metadata[fileName]?.nota || null;
  const fileHash = calcularHash(filePath); // IMPORTANTE: calcular hash
  
  return {
    nombre: fileName,
    nombreOriginal: fileName.replace(/^\d+-/, ''),
    ruta: filePath,
    rutaRelativa: path.relative(repositorioBaseDir, filePath),
    categoria: categoria,
    tamaño: fileSize,
    tamañoMB: fileSizeMB,
    fechaSubida: fechaSubida,
    extension: path.extname(fileName).toLowerCase(),
    nota: notaArchivo,
    hash: fileHash, // IMPORTANTE: incluir hash
    sincronizado: metadata[fileName]?.sincronizado || false,
    fechaSincronizacion: metadata[fileName]?.fechaSincronizacion || null,
    origen: metadata[fileName]?.origen || 'local'
  };
};

// 3. VERIFICAR QUE EXISTA LA FUNCIÓN listarArchivosCarpeta
// Debe usar getFileInfo que incluye el hash:

const listarArchivosCarpeta = (carpeta) => {
  const carpetaPath = path.join(repositorioBaseDir, carpeta);
  
  if (!fs.existsSync(carpetaPath)) {
    return [];
  }
  
  const archivos = fs.readdirSync(carpetaPath);
  return archivos
    .filter(archivo => {
      const archivoPath = path.join(carpetaPath, archivo);
      return fs.statSync(archivoPath).isFile() && archivo !== 'metadata.json';
    })
    .map(archivo => {
      const archivoPath = path.join(carpetaPath, archivo);
      return getFileInfo(archivoPath, carpeta); // Esto incluirá el hash
    })
    .sort((a, b) => new Date(b.fechaSubida) - new Date(a.fechaSubida));
};

// 4. AGREGAR ESTE ENDPOINT (debe ser PÚBLICO, sin autenticación)
// Agregar después de los otros endpoints GET:

// Endpoint para sincronización remota - Listar todos los archivos con hashes
router.get('/sincronizacion/listar', (req, res) => {
  try {
    // Recargar carpetas para obtener las más recientes
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

// 5. VERIFICAR QUE EL ENDPOINT DE DESCARGA SEA PÚBLICO
// Debe existir y NO tener autenticación:

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

// ============================================
// NOTAS IMPORTANTES:
// ============================================
// 1. Asegúrate de que 'crypto' esté importado al inicio del archivo:
//    const crypto = require('crypto');
//
// 2. Asegúrate de que 'carpetas' sea una variable que se pueda recargar:
//    let carpetas = cargarCarpetas();
//
// 3. El endpoint /sincronizacion/listar debe ser PÚBLICO (sin authenticateToken)
//
// 4. El endpoint /descargar también debe ser PÚBLICO
//
// 5. Después de agregar el código, reinicia el servidor
// ============================================

