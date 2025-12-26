const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const https = require('https');
const http = require('http');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Directorio base del repositorio temporal
const repositorioBaseDir = path.join(__dirname, '../uploads/repositorio-temporal');

// Carpetas organizadas por categoría
// Las carpetas se cargan desde un archivo JSON para permitir agregar nuevas dinámicamente
const carpetasFilePath = path.join(__dirname, '../uploads/repositorio-temporal', 'carpetas.json');

// Función para cargar carpetas desde archivo o usar las predeterminadas
const cargarCarpetas = () => {
  const carpetasDefault = {
    'acerca-de': 'Acerca del Concejo',
    'miembros': 'Miembros del Concejo',
    'historia': 'Historia',
    'gaceta': 'Gaceta',
    'sesiones': 'Sesiones',
    'transparencia': 'Transparencia',
    'documentos-oficiales': 'Documentos Oficiales',
    'documentos-generales': 'Documentos Generales',
    // Carpetas de Acerca de
    'acerca-mision': 'Acerca - Misión',
    'acerca-vision': 'Acerca - Visión',
    'acerca-estructura-jerarquica': 'Acerca - Estructura Jerárquica',
    'acerca-autoridades': 'Acerca - Autoridades',
    'acerca-contacto': 'Acerca - Contacto',
    'acerca-simbolos': 'Acerca - Símbolos',
    'plan-accion': 'Plan de Acción 2025',
    // Carpetas de Documentos
    'documentos-gaceta-municipal': 'Documentos - Gaceta Municipal',
    'documentos-acuerdos': 'Documentos - Acuerdos',
    'documentos-actas-sesion': 'Documentos - Actas de Sesión',
    'documentos-decretos': 'Documentos - Decretos',
    'documentos-proyectos': 'Documentos - Proyectos',
    'documentos-manuales': 'Documentos - Manuales',
    'documentos-planes': 'Documentos - Planes',
    'documentos-leyes': 'Documentos - Leyes',
    'documentos-politicas': 'Documentos - Políticas',
    'reglamento-interno': 'Reglamento Interno',
    // Carpetas de Transparencia
    'transparencia-presupuesto': 'Transparencia - Presupuesto',
    'transparencia-contratacion-publica': 'Transparencia - Contratación Pública',
    'transparencia-plan-anual-compras': 'Transparencia - Plan Anual de Compras',
    'transparencia-rendicion-cuentas': 'Transparencia - Rendición de Cuentas',
    'transparencia-estados-financieros': 'Transparencia - Estados Financieros',
    'transparencia-control-interno': 'Transparencia - Control Interno',
    'transparencia-declaracion-renta': 'Transparencia - Declaración de Renta',
    'transparencia-estructura-organizacional': 'Transparencia - Estructura Organizacional',
    'transparencia-plan-desarrollo': 'Transparencia - Plan de Desarrollo',
    'transparencia-normatividad': 'Transparencia - Normatividad',
    'transparencia-servicios-ciudadanos': 'Transparencia - Servicios Ciudadanos',
    'transparencia-auditorias': 'Transparencia - Auditorías',
    'transparencia-bienes-inmuebles': 'Transparencia - Bienes Inmuebles',
    'transparencia-personal': 'Transparencia - Personal'
  };

  if (fs.existsSync(carpetasFilePath)) {
    try {
      const carpetasGuardadas = JSON.parse(fs.readFileSync(carpetasFilePath, 'utf8'));
      return { ...carpetasDefault, ...carpetasGuardadas };
    } catch (error) {
      console.error('Error cargando carpetas desde archivo:', error);
      return carpetasDefault;
    }
  }
  return carpetasDefault;
};

// Función para guardar carpetas en archivo
const guardarCarpetas = (carpetas) => {
  try {
    // Asegurar que el directorio existe
    const dir = path.dirname(carpetasFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(carpetasFilePath, JSON.stringify(carpetas, null, 2), 'utf8');
  } catch (error) {
    console.error('Error guardando carpetas:', error);
  }
};

// Cargar carpetas al iniciar
let carpetas = cargarCarpetas();

// Función para inicializar carpetas
const inicializarCarpetas = () => {
  carpetas = cargarCarpetas();
  Object.keys(carpetas).forEach(carpeta => {
    const carpetaPath = path.join(repositorioBaseDir, carpeta);
    if (!fs.existsSync(carpetaPath)) {
      fs.mkdirSync(carpetaPath, { recursive: true });
    }
  });
};

// Inicializar carpetas al cargar el módulo
inicializarCarpetas();

// Configuración de multer para el repositorio
const repositorioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const categoria = req.body.categoria || 'documentos-generales';
    const carpetaPath = path.join(repositorioBaseDir, categoria);
    
    // Asegurar que la carpeta existe
    if (!fs.existsSync(carpetaPath)) {
      fs.mkdirSync(carpetaPath, { recursive: true });
    }
    
    cb(null, carpetaPath);
  },
  filename: (req, file, cb) => {
    // Mantener el nombre original con timestamp para evitar conflictos
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}-${originalName}`);
  }
});

// Filtro de archivos - aceptar casi cualquier tipo
const repositorioFilter = (req, file, cb) => {
  // Permitir imágenes, documentos, hojas de cálculo, presentaciones, texto, etc.
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|json|xml|zip|rar/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Formatos aceptados: imágenes, documentos, hojas de cálculo, presentaciones, texto, CSV, JSON, XML, ZIP, RAR'));
  }
};

const uploadRepositorio = multer({
  storage: repositorioStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB máximo
  fileFilter: repositorioFilter
});

// Función para cargar metadatos de una carpeta
const cargarMetadatos = (categoria) => {
  const metadataPath = path.join(repositorioBaseDir, categoria, 'metadata.json');
  if (fs.existsSync(metadataPath)) {
    try {
      const metadataContent = fs.readFileSync(metadataPath, 'utf8');
      return JSON.parse(metadataContent);
    } catch (error) {
      console.error('Error cargando metadatos:', error);
      return {};
    }
  }
  return {};
};

// Función para guardar metadatos de una carpeta
const guardarMetadatos = (categoria, metadata) => {
  const metadataPath = path.join(repositorioBaseDir, categoria, 'metadata.json');
  try {
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
  } catch (error) {
    console.error('Error guardando metadatos:', error);
  }
};

// Función para marcar un archivo como sincronizado
const marcarArchivoSincronizado = (categoria, nombreArchivo, origen = 'servidor') => {
  try {
    const metadata = cargarMetadatos(categoria);
    const archivoPath = path.join(repositorioBaseDir, categoria, nombreArchivo);
    
    if (!fs.existsSync(archivoPath)) {
      console.warn(`⚠️ No se puede marcar como sincronizado: archivo no existe - ${archivoPath}`);
      return false;
    }
    
    const fileHash = calcularHash(archivoPath);
    metadata[nombreArchivo] = {
      ...metadata[nombreArchivo],
      sincronizado: true,
      fechaSincronizacion: new Date().toISOString(),
      origen: origen,
      hash: fileHash || null
    };
    guardarMetadatos(categoria, metadata);
    return true;
  } catch (error) {
    console.error(`❌ Error marcando archivo como sincronizado: ${nombreArchivo}`, error);
    return false;
  }
};

// Función auxiliar para calcular hash MD5 de un archivo
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

// Función auxiliar para obtener información de archivos
const getFileInfo = (filePath, categoria, nota = null) => {
  const stats = fs.statSync(filePath);
  const fileName = path.basename(filePath);
  const fileSize = stats.size;
  const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
  const fechaSubida = stats.birthtime;
  
  // Cargar metadatos si existen
  const metadata = cargarMetadatos(categoria);
  const notaArchivo = nota || metadata[fileName]?.nota || null;
  const fileHash = calcularHash(filePath);
  
  return {
    nombre: fileName,
    nombreOriginal: fileName.replace(/^\d+-/, ''), // Remover timestamp del inicio
    ruta: filePath,
    rutaRelativa: path.relative(repositorioBaseDir, filePath),
    categoria: categoria,
    tamaño: fileSize,
    tamañoMB: fileSizeMB,
    fechaSubida: fechaSubida,
    extension: path.extname(fileName).toLowerCase(),
    nota: notaArchivo,
    hash: fileHash,
    sincronizado: metadata[fileName]?.sincronizado || false,
    fechaSincronizacion: metadata[fileName]?.fechaSincronizacion || null,
    origen: metadata[fileName]?.origen || 'local'
  };
};

// Función para listar archivos en una carpeta
const listarArchivosCarpeta = (carpeta) => {
  const carpetaPath = path.join(repositorioBaseDir, carpeta);
  
  if (!fs.existsSync(carpetaPath)) {
    return [];
  }
  
  const archivos = fs.readdirSync(carpetaPath);
  return archivos
    .filter(archivo => {
      const archivoPath = path.join(carpetaPath, archivo);
      // Excluir el archivo metadata.json
      return fs.statSync(archivoPath).isFile() && archivo !== 'metadata.json';
    })
    .map(archivo => {
      const archivoPath = path.join(carpetaPath, archivo);
      return getFileInfo(archivoPath, carpeta);
    })
    .sort((a, b) => new Date(b.fechaSubida) - new Date(a.fechaSubida)); // Más recientes primero
};

// ============================================
// RUTAS PÚBLICAS (para que el concejo suba archivos)
// ============================================

// Listar categorías disponibles
router.get('/categorias', (req, res) => {
  try {
    // Recargar carpetas para obtener las más recientes
    carpetas = cargarCarpetas();
    const categorias = Object.keys(carpetas).map(key => ({
      id: key,
      nombre: carpetas[key],
      cantidadArchivos: listarArchivosCarpeta(key).length
    }));
    
    console.log('📁 Categorías disponibles:', categorias);
    res.json(categorias);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ error: 'Error obteniendo categorías' });
  }
});

// Crear nueva carpeta/categoría
router.post('/crear-carpeta', (req, res) => {
  console.log('📁 POST /crear-carpeta recibido');
  console.log('📁 Body recibido:', req.body);
  try {
    const { nombre } = req.body;
    
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: 'El nombre de la carpeta es requerido' });
    }

    // Generar ID único a partir del nombre
    const id = nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9]+/g, '-') // Reemplazar espacios y caracteres especiales con guiones
      .replace(/^-+|-+$/g, ''); // Remover guiones al inicio y final

    // Verificar que no exista ya
    if (carpetas[id]) {
      return res.status(400).json({ error: 'Ya existe una carpeta con un nombre similar' });
    }

    // Agregar nueva carpeta
    carpetas[id] = nombre.trim();
    
    // Guardar en archivo
    guardarCarpetas(carpetas);
    
    // Recargar carpetas desde el archivo
    carpetas = cargarCarpetas();
    
    // Crear el directorio físico
    const carpetaPath = path.join(repositorioBaseDir, id);
    if (!fs.existsSync(carpetaPath)) {
      fs.mkdirSync(carpetaPath, { recursive: true });
    }

    res.json({
      mensaje: 'Carpeta creada exitosamente',
      carpeta: {
        id: id,
        nombre: nombre.trim(),
        cantidadArchivos: 0
      }
    });
  } catch (error) {
    console.error('Error creando carpeta:', error);
    res.status(500).json({ error: 'Error creando carpeta' });
  }
});

// Eliminar carpeta/categoría
router.delete('/eliminar-carpeta/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Recargar carpetas
    carpetas = cargarCarpetas();
    
    // Verificar que la carpeta existe
    if (!carpetas[id]) {
      return res.status(404).json({ error: 'Carpeta no encontrada' });
    }
    
    // Verificar que no sea una carpeta del sistema (opcional - puedes ajustar esto)
    const carpetasSistema = ['acerca-de', 'miembros', 'historia', 'gaceta', 'sesiones', 'transparencia', 'documentos-oficiales', 'documentos-generales'];
    if (carpetasSistema.includes(id)) {
      return res.status(400).json({ error: 'No se pueden eliminar carpetas del sistema' });
    }
    
    // Eliminar el directorio físico si existe
    const carpetaPath = path.join(repositorioBaseDir, id);
    if (fs.existsSync(carpetaPath)) {
      // Eliminar todos los archivos dentro de la carpeta
      const archivos = fs.readdirSync(carpetaPath);
      archivos.forEach(archivo => {
        const archivoPath = path.join(carpetaPath, archivo);
        if (fs.statSync(archivoPath).isFile()) {
          fs.unlinkSync(archivoPath);
        }
      });
      // Eliminar la carpeta
      fs.rmdirSync(carpetaPath);
    }
    
    // Eliminar de la lista de carpetas
    delete carpetas[id];
    
    // Guardar cambios
    guardarCarpetas(carpetas);
    
    // Recargar carpetas
    carpetas = cargarCarpetas();
    
    res.json({
      mensaje: 'Carpeta eliminada exitosamente',
      id: id
    });
  } catch (error) {
    console.error('Error eliminando carpeta:', error);
    res.status(500).json({ error: 'Error eliminando carpeta' });
  }
});

// Listar archivos de una categoría (público - sin autenticación)
router.get('/listar/:categoria?', (req, res) => {
  try {
    // Recargar carpetas para obtener las más recientes
    carpetas = cargarCarpetas();
    const categoria = req.params.categoria;
    
    if (categoria && carpetas[categoria]) {
      // Listar archivos de una categoría específica
      const archivos = listarArchivosCarpeta(categoria);
      res.json({
        categoria: categoria,
        nombreCategoria: carpetas[categoria],
        archivos: archivos,
        total: archivos.length
      });
    } else {
      // Listar todas las categorías con sus archivos
      const todasLasCategorias = {};
      let totalArchivos = 0;
      
      Object.keys(carpetas).forEach(cat => {
        const archivos = listarArchivosCarpeta(cat);
        todasLasCategorias[cat] = {
          nombre: carpetas[cat],
          archivos: archivos,
          total: archivos.length
        };
        totalArchivos += archivos.length;
      });
      
      res.json({
        categorias: todasLasCategorias,
        totalArchivos: totalArchivos
      });
    }
  } catch (error) {
    console.error('Error listando archivos:', error);
    res.status(500).json({ error: 'Error listando archivos' });
  }
});

// Subir archivo (sin autenticación - acceso público con token simple)
router.post('/upload', uploadRepositorio.single('archivo'), (req, res) => {
  try {
    // Recargar carpetas para obtener las más recientes
    carpetas = cargarCarpetas();
    
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
    }

    const categoria = req.body.categoria || 'documentos-generales';
    
    if (!carpetas[categoria]) {
      return res.status(400).json({ error: 'Categoría no válida' });
    }

    const fileInfo = getFileInfo(req.file.path, categoria);

    res.json({
      mensaje: 'Archivo subido exitosamente',
      archivo: fileInfo
    });
  } catch (error) {
    console.error('Error subiendo archivo:', error);
    res.status(500).json({ error: error.message || 'Error subiendo archivo' });
  }
});

// Subir múltiples archivos
router.post('/upload-multiple', uploadRepositorio.array('archivos', 20), (req, res) => {
  try {
    // Recargar carpetas para obtener las más recientes
    carpetas = cargarCarpetas();
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron archivos' });
    }

    const categoria = req.body.categoria || 'documentos-generales';
    const nota = req.body.nota || null; // La misma nota se aplica a todos los archivos
    
    if (!carpetas[categoria]) {
      return res.status(400).json({ error: 'Categoría no válida' });
    }

    // Guardar nota en metadatos si existe (se aplica a todos los archivos)
    if (nota && nota.trim()) {
      const metadata = cargarMetadatos(categoria);
      req.files.forEach(file => {
        metadata[file.filename] = {
          nota: nota.trim(),
          fechaNota: new Date().toISOString()
        };
      });
      guardarMetadatos(categoria, metadata);
    }

    const archivos = req.files.map(file => getFileInfo(file.path, categoria, nota));

    res.json({
      mensaje: `${archivos.length} archivo(s) subido(s) exitosamente`,
      archivos: archivos
    });
  } catch (error) {
    console.error('Error subiendo archivos:', error);
    res.status(500).json({ error: error.message || 'Error subiendo archivos' });
  }
});

// ============================================
// RUTAS PÚBLICAS ADICIONALES (temporalmente sin autenticación)
// ============================================

// Descargar archivo (público temporalmente)
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

// Eliminar archivo (público temporalmente)
router.delete('/eliminar/:categoria/:nombreArchivo', async (req, res) => {
  try {
    const { categoria, nombreArchivo } = req.params;
    const archivoPath = path.join(repositorioBaseDir, categoria, nombreArchivo);
    
    if (!fs.existsSync(archivoPath)) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    fs.unlinkSync(archivoPath);
    
    res.json({ mensaje: 'Archivo eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando archivo:', error);
    res.status(500).json({ error: 'Error eliminando archivo' });
  }
});

// Mover archivo entre categorías (público temporalmente)
router.put('/mover', async (req, res) => {
  try {
    // Recargar carpetas para obtener las más recientes
    carpetas = cargarCarpetas();
    const { categoriaOrigen, categoriaDestino, nombreArchivo } = req.body;
    
    if (!carpetas[categoriaOrigen] || !carpetas[categoriaDestino]) {
      return res.status(400).json({ error: 'Categoría no válida' });
    }
    
    const archivoOrigen = path.join(repositorioBaseDir, categoriaOrigen, nombreArchivo);
    const archivoDestino = path.join(repositorioBaseDir, categoriaDestino, nombreArchivo);
    
    if (!fs.existsSync(archivoOrigen)) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    fs.renameSync(archivoOrigen, archivoDestino);
    
    res.json({ 
      mensaje: 'Archivo movido exitosamente',
      archivo: getFileInfo(archivoDestino, categoriaDestino)
    });
  } catch (error) {
    console.error('Error moviendo archivo:', error);
    res.status(500).json({ error: 'Error moviendo archivo' });
  }
});

// ============================================
// RUTAS DE ADMINISTRADOR (para revisar y procesar)
// ============================================

// Listar todos los archivos del repositorio
router.get('/admin/listar', authenticateToken, requireAdmin, (req, res) => {
  try {
    // Recargar carpetas para obtener las más recientes
    carpetas = cargarCarpetas();
    const categoria = req.query.categoria;
    
    if (categoria && carpetas[categoria]) {
      // Listar archivos de una categoría específica
      const archivos = listarArchivosCarpeta(categoria);
      res.json({
        categoria: categoria,
        nombreCategoria: carpetas[categoria],
        archivos: archivos,
        total: archivos.length
      });
    } else {
      // Listar todos los archivos de todas las categorías
      const todasLasCategorias = {};
      let totalArchivos = 0;
      
      Object.keys(carpetas).forEach(cat => {
        const archivos = listarArchivosCarpeta(cat);
        todasLasCategorias[cat] = {
          nombre: carpetas[cat],
          archivos: archivos,
          total: archivos.length
        };
        totalArchivos += archivos.length;
      });
      
      res.json({
        categorias: todasLasCategorias,
        totalArchivos: totalArchivos
      });
    }
  } catch (error) {
    console.error('Error listando archivos:', error);
    res.status(500).json({ error: 'Error listando archivos' });
  }
});

// Descargar archivo
router.get('/admin/descargar/:categoria/:nombreArchivo', authenticateToken, requireAdmin, (req, res) => {
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

// Eliminar archivo
router.delete('/admin/eliminar/:categoria/:nombreArchivo', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { categoria, nombreArchivo } = req.params;
    const archivoPath = path.join(repositorioBaseDir, categoria, nombreArchivo);
    
    if (!fs.existsSync(archivoPath)) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    fs.unlinkSync(archivoPath);
    
    res.json({ mensaje: 'Archivo eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando archivo:', error);
    res.status(500).json({ error: 'Error eliminando archivo' });
  }
});

// Mover archivo entre categorías
router.put('/admin/mover', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Recargar carpetas para obtener las más recientes
    carpetas = cargarCarpetas();
    const { categoriaOrigen, categoriaDestino, nombreArchivo } = req.body;
    
    if (!carpetas[categoriaOrigen] || !carpetas[categoriaDestino]) {
      return res.status(400).json({ error: 'Categoría no válida' });
    }
    
    const archivoOrigen = path.join(repositorioBaseDir, categoriaOrigen, nombreArchivo);
    const archivoDestino = path.join(repositorioBaseDir, categoriaDestino, nombreArchivo);
    
    if (!fs.existsSync(archivoOrigen)) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    fs.renameSync(archivoOrigen, archivoDestino);
    
    res.json({ 
      mensaje: 'Archivo movido exitosamente',
      archivo: getFileInfo(archivoDestino, categoriaDestino)
    });
  } catch (error) {
    console.error('Error moviendo archivo:', error);
    res.status(500).json({ error: 'Error moviendo archivo' });
  }
});

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

// Función auxiliar para hacer peticiones HTTP
const hacerPeticionHTTP = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(url);
      const protocol = urlObj.protocol === 'https:' ? https : http;
      
      const req = protocol.request(url, { ...options, timeout: 30000 }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve(data);
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });
      
      req.on('error', (error) => {
        console.error('Error en petición HTTP:', error);
        reject(error);
      });
      
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout al conectar con el servidor remoto'));
      });
      
      if (options.body) {
        req.write(options.body);
      }
      req.end();
    } catch (error) {
      console.error('Error construyendo petición HTTP:', error);
      reject(error);
    }
  });
};

// Función auxiliar para descargar archivo desde URL remota
const descargarArchivoRemoto = (url, destino) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const req = protocol.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(destino);
      res.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      
      fileStream.on('error', reject);
    });
    
    req.on('error', reject);
  });
};

// Sincronizar archivos desde servidor remoto o directorio local
router.post('/sincronizar', async (req, res) => {
  try {
    console.log('🔄 Iniciando sincronización...');
    console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
    
    const { servidorUrl, servidorPath, mapeoCarpetas, modo = 'api' } = req.body;
    
    // Validar que se haya enviado el modo correcto
    if (!modo || (modo !== 'api' && modo !== 'local')) {
      return res.status(400).json({ 
        error: 'Modo de sincronización inválido',
        modosSoportados: ['api', 'local']
      });
    }
    
    // Validar parámetros según el modo
    if (modo === 'api' && !servidorUrl) {
      return res.status(400).json({ 
        error: 'servidorUrl es requerido para modo api'
      });
    }
    
    if (modo === 'local' && !servidorPath) {
      return res.status(400).json({ 
        error: 'servidorPath es requerido para modo local'
      });
    }
    
    // Mapeo por defecto de carpetas del servidor a nuestras carpetas
    const mapeoDefault = {
      'Documentos - Acta de sesion': 'documentos-actas-sesion',
      'Documentos - Actas de Sesión': 'documentos-actas-sesion',
      'Documentos - Actas de sesion': 'documentos-actas-sesion',
      'Documentos - Gaceta Municipal': 'documentos-gaceta-municipal',
      'Documentos - Acuerdos': 'documentos-acuerdos',
      'Documentos - Decretos': 'documentos-decretos',
      'Documentos - Proyectos': 'documentos-proyectos',
      'Documentos - Manuales': 'documentos-manuales',
      'Documentos - Planes': 'documentos-planes',
      'Documentos - Leyes': 'documentos-leyes',
      'Documentos - Políticas': 'documentos-politicas',
      'Reglamento Interno': 'reglamento-interno',
      'Sesiones': 'sesiones',
      'Gaceta': 'gaceta',
      'Transparencia': 'transparencia',
      'Acerca del Concejo': 'acerca-de',
      'Miembros del Concejo': 'miembros',
      'Historia': 'historia'
    };

    const mapeoFinal = { ...mapeoDefault, ...mapeoCarpetas };
    
    let archivosSincronizados = 0;
    let archivosNuevos = 0;
    let archivosModificados = 0;
    let archivosOmitidos = 0;
    const errores = [];

    if (modo === 'api' && servidorUrl) {
      // Sincronización desde servidor remoto vía API
      try {
        // Normalizar URL (agregar /api/repositorio si no está)
        const baseUrl = servidorUrl.endsWith('/') ? servidorUrl.slice(0, -1) : servidorUrl;
        const listarUrl = `${baseUrl}/api/repositorio/sincronizacion/listar`;
        
        console.log(`🔄 Obteniendo lista de archivos desde: ${listarUrl}`);
        
        // Obtener lista de archivos del servidor remoto
        const datosRemotos = await hacerPeticionHTTP(listarUrl);
        
        if (!datosRemotos.categorias) {
          return res.status(400).json({ error: 'Respuesta inválida del servidor remoto' });
        }

        // Recorrer categorías del servidor remoto
        for (const [categoriaRemota, datosCategoria] of Object.entries(datosRemotos.categorias)) {
          // Buscar mapeo de la categoría remota
          const categoriaLocal = mapeoFinal[categoriaRemota] || mapeoFinal[datosCategoria.nombre];
          
          if (!categoriaLocal) {
            console.warn(`⚠️ Categoría "${categoriaRemota}" no tiene mapeo, se omite`);
            continue;
          }

          // Asegurar que la carpeta local existe
          const carpetaLocalPath = path.join(repositorioBaseDir, categoriaLocal);
          if (!fs.existsSync(carpetaLocalPath)) {
            fs.mkdirSync(carpetaLocalPath, { recursive: true });
          }

          // Cargar metadata local para comparar
          const metadataLocal = cargarMetadatos(categoriaLocal);

          // Procesar cada archivo del servidor remoto
          for (const archivoRemoto of datosCategoria.archivos || []) {
            try {
              const archivoLocalPath = path.join(carpetaLocalPath, archivoRemoto.nombre);
              const metadataArchivo = metadataLocal[archivoRemoto.nombre];
              
              // Verificar si el archivo ya existe localmente
              if (fs.existsSync(archivoLocalPath)) {
                const hashLocal = calcularHash(archivoLocalPath);
                
                // Si el hash es diferente, el archivo fue modificado
                if (hashLocal !== archivoRemoto.hash) {
                  // Descargar archivo actualizado
                  const descargarUrl = `${baseUrl}/api/repositorio/descargar/${categoriaRemota}/${encodeURIComponent(archivoRemoto.nombre)}`;
                  await descargarArchivoRemoto(descargarUrl, archivoLocalPath);
                  marcarArchivoSincronizado(categoriaLocal, archivoRemoto.nombre, 'servidor');
                  archivosModificados++;
                  archivosSincronizados++;
                } else if (metadataArchivo?.sincronizado) {
                  // Ya está sincronizado y no ha cambiado
                  archivosOmitidos++;
                } else {
                  // Existe pero no está marcado como sincronizado
                  marcarArchivoSincronizado(categoriaLocal, archivoRemoto.nombre, 'servidor');
                  archivosSincronizados++;
                }
              } else {
                // Archivo nuevo, descargar
                const descargarUrl = `${baseUrl}/api/repositorio/descargar/${categoriaRemota}/${encodeURIComponent(archivoRemoto.nombre)}`;
                await descargarArchivoRemoto(descargarUrl, archivoLocalPath);
                marcarArchivoSincronizado(categoriaLocal, archivoRemoto.nombre, 'servidor');
                archivosNuevos++;
                archivosSincronizados++;
              }
            } catch (error) {
              console.error(`❌ Error sincronizando ${archivoRemoto.nombre}:`, error);
              errores.push({ archivo: archivoRemoto.nombre, error: error.message });
            }
          }
        }
      } catch (error) {
        console.error('❌ Error conectando con servidor remoto:', error);
        console.error('❌ Stack:', error.stack);
        return res.status(500).json({ 
          error: 'Error conectando con servidor remoto', 
          detalle: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      }
    } else if (modo === 'local' && servidorPath) {
      // Sincronización desde directorio local (acceso directo al servidor)
      console.log(`📁 Modo local - Ruta del servidor: ${servidorPath}`);
      
      if (!fs.existsSync(servidorPath)) {
        console.error(`❌ Ruta del servidor no existe: ${servidorPath}`);
        return res.status(400).json({ error: 'Ruta del servidor no existe' });
      }
      
      if (!fs.statSync(servidorPath).isDirectory()) {
        console.error(`❌ La ruta no es un directorio: ${servidorPath}`);
        return res.status(400).json({ error: 'La ruta especificada no es un directorio' });
      }

      // Recorrer carpetas del servidor
      const carpetasServidor = fs.readdirSync(servidorPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const carpetaServidor of carpetasServidor) {
        const carpetaLocal = mapeoFinal[carpetaServidor];
        
        if (!carpetaLocal) {
          console.warn(`Carpeta "${carpetaServidor}" no tiene mapeo, se omite`);
          continue;
        }

        // Asegurar que la carpeta local existe
        const carpetaLocalPath = path.join(repositorioBaseDir, carpetaLocal);
        if (!fs.existsSync(carpetaLocalPath)) {
          fs.mkdirSync(carpetaLocalPath, { recursive: true });
        }

        const carpetaServidorPath = path.join(servidorPath, carpetaServidor);
        const archivosServidor = fs.readdirSync(carpetaServidorPath)
          .filter(archivo => {
            const archivoPath = path.join(carpetaServidorPath, archivo);
            return fs.statSync(archivoPath).isFile() && archivo !== 'metadata.json';
          });

        // Cargar metadata local para comparar
        const metadataLocal = cargarMetadatos(carpetaLocal);

        for (const archivoServidor of archivosServidor) {
          try {
            const archivoServidorPath = path.join(carpetaServidorPath, archivoServidor);
            const archivoLocalPath = path.join(carpetaLocalPath, archivoServidor);
            
            // Verificar que el archivo existe antes de calcular hash
            if (!fs.existsSync(archivoServidorPath)) {
              console.warn(`⚠️ Archivo no existe: ${archivoServidorPath}`);
              continue;
            }
            
            const hashServidor = calcularHash(archivoServidorPath);
            
            if (!hashServidor) {
              console.warn(`⚠️ No se pudo calcular hash para: ${archivoServidor}`);
              errores.push({ archivo: archivoServidor, error: 'No se pudo calcular hash' });
              continue;
            }
            
            // Verificar si el archivo ya existe localmente
            if (fs.existsSync(archivoLocalPath)) {
              const hashLocal = calcularHash(archivoLocalPath);
              
              if (!hashLocal) {
                console.warn(`⚠️ No se pudo calcular hash local para: ${archivoServidor}`);
                // Continuar como si fuera nuevo
                fs.copyFileSync(archivoServidorPath, archivoLocalPath);
                marcarArchivoSincronizado(carpetaLocal, archivoServidor, 'servidor');
                archivosNuevos++;
                archivosSincronizados++;
                continue;
              }
              
              const metadataArchivo = metadataLocal[archivoServidor];
              
              // Si el hash es diferente, el archivo fue modificado
              if (hashLocal !== hashServidor) {
                // Copiar archivo actualizado
                fs.copyFileSync(archivoServidorPath, archivoLocalPath);
                marcarArchivoSincronizado(carpetaLocal, archivoServidor, 'servidor');
                archivosModificados++;
                archivosSincronizados++;
              } else if (metadataArchivo?.sincronizado) {
                // Ya está sincronizado y no ha cambiado
                archivosOmitidos++;
              } else {
                // Existe pero no está marcado como sincronizado
                marcarArchivoSincronizado(carpetaLocal, archivoServidor, 'servidor');
                archivosSincronizados++;
              }
            } else {
              // Archivo nuevo, copiar
              fs.copyFileSync(archivoServidorPath, archivoLocalPath);
              marcarArchivoSincronizado(carpetaLocal, archivoServidor, 'servidor');
              archivosNuevos++;
              archivosSincronizados++;
            }
          } catch (error) {
            console.error(`Error sincronizando ${archivoServidor}:`, error);
            errores.push({ archivo: archivoServidor, error: error.message });
          }
        }
      }
    } else {
      console.error('❌ Modo de sincronización no válido o parámetros faltantes');
      console.error('   Modo recibido:', modo);
      console.error('   servidorUrl:', servidorUrl);
      console.error('   servidorPath:', servidorPath);
      return res.status(400).json({ 
        error: 'Modo de sincronización no soportado o parámetros faltantes',
        modosSoportados: ['api', 'local'],
        requerido: modo === 'api' ? 'servidorUrl' : 'servidorPath',
        recibido: { modo, servidorUrl: !!servidorUrl, servidorPath: !!servidorPath }
      });
    }
    
    res.json({
      mensaje: 'Sincronización completada',
      resumen: {
        totalSincronizados: archivosSincronizados,
        nuevos: archivosNuevos,
        modificados: archivosModificados,
        omitidos: archivosOmitidos,
        errores: errores.length
      },
      errores: errores.length > 0 ? errores : undefined
    });
  } catch (error) {
    console.error('❌ Error sincronizando:', error);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      error: 'Error sincronizando archivos', 
      detalle: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Obtener estadísticas del repositorio
router.get('/admin/estadisticas', authenticateToken, requireAdmin, (req, res) => {
  try {
    // Recargar carpetas para obtener las más recientes
    carpetas = cargarCarpetas();
    const estadisticas = {};
    let totalArchivos = 0;
    let totalTamaño = 0;
    
    Object.keys(carpetas).forEach(cat => {
      const archivos = listarArchivosCarpeta(cat);
      const tamañoCategoria = archivos.reduce((sum, archivo) => sum + archivo.tamaño, 0);
      
      estadisticas[cat] = {
        nombre: carpetas[cat],
        cantidad: archivos.length,
        tamañoMB: (tamañoCategoria / (1024 * 1024)).toFixed(2)
      };
      
      totalArchivos += archivos.length;
      totalTamaño += tamañoCategoria;
    });
    
    res.json({
      categorias: estadisticas,
      totalArchivos: totalArchivos,
      totalTamañoMB: (totalTamaño / (1024 * 1024)).toFixed(2)
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error obteniendo estadísticas' });
  }
});

module.exports = router;







