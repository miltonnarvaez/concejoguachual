const express = require('express');
const pool = require('../config/database');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Función auxiliar para buscar en el repositorio
const buscarEnRepositorio = (searchTerm) => {
  try {
    const repositorioBaseDir = path.join(__dirname, '../uploads/repositorio-temporal');
    const carpetasFilePath = path.join(repositorioBaseDir, 'carpetas.json');
    
    // Verificar que el directorio existe
    if (!fs.existsSync(repositorioBaseDir)) {
      console.error(`❌ Directorio del repositorio no existe: ${repositorioBaseDir}`);
      return [];
    }
    
    // Carpetas predeterminadas
    const carpetasDefault = {
      'acerca-de': 'Acerca del Concejo',
      'miembros': 'Miembros del Concejo',
      'historia': 'Historia',
      'gaceta': 'Gaceta',
      'sesiones': 'Sesiones',
      'transparencia': 'Transparencia',
      'documentos-oficiales': 'Documentos Oficiales',
      'documentos-generales': 'Documentos Generales',
      'acerca-mision': 'Acerca - Misión',
      'acerca-vision': 'Acerca - Visión',
      'acerca-estructura-jerarquica': 'Acerca - Estructura Jerárquica',
      'acerca-autoridades': 'Acerca - Autoridades',
      'acerca-contacto': 'Acerca - Contacto',
      'acerca-simbolos': 'Acerca - Símbolos',
      'plan-accion': 'Plan de Acción 2025',
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
    
    // Cargar carpetas
    let carpetas = carpetasDefault;
    if (fs.existsSync(carpetasFilePath)) {
      try {
        const carpetasGuardadas = JSON.parse(fs.readFileSync(carpetasFilePath, 'utf8'));
        carpetas = { ...carpetasDefault, ...carpetasGuardadas };
      } catch (error) {
        console.error('Error cargando carpetas:', error);
        // Usar carpetas predeterminadas si hay error
      }
    }
    
    const resultados = [];
    const searchLower = searchTerm.toLowerCase().replace(/%/g, '').trim();
    
    console.log(`🔍 Buscando en repositorio: "${searchLower}"`);
    console.log(`📁 Directorio base: ${repositorioBaseDir}`);
    console.log(`📂 Total categorías: ${Object.keys(carpetas).length}`);
    
    // Buscar en todas las categorías
    Object.keys(carpetas).forEach(categoria => {
      const carpetaPath = path.join(repositorioBaseDir, categoria);
      if (!fs.existsSync(carpetaPath)) {
        console.log(`⏭️ Carpeta no existe: ${categoria}`);
        return;
      }
      
      const todosArchivos = fs.readdirSync(carpetaPath)
        .filter(archivo => {
          const archivoPath = path.join(carpetaPath, archivo);
          return fs.statSync(archivoPath).isFile() && archivo !== 'metadata.json';
        });
      
      console.log(`📂 Carpeta "${categoria}": ${todosArchivos.length} archivos`);
      
      const archivos = todosArchivos
        .filter(archivo => {
          const nombreArchivo = archivo.toLowerCase();
          // Buscar tanto en el nombre del archivo como en el nombre original (si existe en metadata)
          let nombreOriginalLower = nombreArchivo;
          const metadataPath = path.join(carpetaPath, 'metadata.json');
          if (fs.existsSync(metadataPath)) {
            try {
              const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
              if (metadata[archivo] && metadata[archivo].nombreOriginal) {
                nombreOriginalLower = metadata[archivo].nombreOriginal.toLowerCase();
              }
            } catch (error) {
              // Ignorar errores de metadata
            }
          }
          const coincide = nombreArchivo.includes(searchLower) || nombreOriginalLower.includes(searchLower);
          if (coincide) {
            console.log(`✅ Coincidencia encontrada: ${archivo} (${nombreArchivo} contiene "${searchLower}")`);
          }
          return coincide;
        })
        .map(archivo => {
          const archivoPath = path.join(carpetaPath, archivo);
          const stats = fs.statSync(archivoPath);
          const extension = path.extname(archivo);
          
          // Leer metadata si existe
          let nombreOriginal = archivo;
          let nota = '';
          const metadataPath = path.join(carpetaPath, 'metadata.json');
          if (fs.existsSync(metadataPath)) {
            try {
              const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
              if (metadata[archivo]) {
                nombreOriginal = metadata[archivo].nombreOriginal || archivo;
                nota = metadata[archivo].nota || '';
              }
            } catch (error) {
              console.error('Error leyendo metadata:', error);
            }
          }
          
          return {
            id: `repo-${categoria}-${archivo}`,
            titulo: nombreOriginal,
            descripcion: nota || `Documento de ${carpetas[categoria]}`,
            categoria: carpetas[categoria],
            categoria_id: categoria,
            fecha_publicacion: stats.mtime,
            creado_en: stats.birthtime,
            archivo_url: `/api/repositorio/descargar/${categoria}/${encodeURIComponent(archivo)}`,
            tipo_resultado: 'repositorio',
            tamaño: (stats.size / (1024 * 1024)).toFixed(2),
            extension: extension
          };
        });
      
      resultados.push(...archivos);
    });
    
    console.log(`✅ Resultados encontrados en repositorio: ${resultados.length}`);
    if (resultados.length > 0) {
      console.log('📄 Primeros resultados:', resultados.slice(0, 3).map(r => r.titulo));
    }
    
    return resultados;
  } catch (error) {
    console.error('Error buscando en repositorio:', error);
    return [];
  }
};

// Búsqueda global avanzada
router.get('/', async (req, res) => {
  try {
    const { q, tipo, categoria, fecha_desde, fecha_hasta } = req.query;
    
    console.log('Búsqueda recibida:', { q, tipo, categoria, fecha_desde, fecha_hasta });
    
    if (!q || q.trim() === '') {
      return res.json({
        noticias: [],
        transparencia: [],
        gaceta: [],
        sesiones: [],
        convocatorias: [],
        total: 0
      });
    }

    const searchTerm = `%${q.trim()}%`;
    const results = {
      noticias: [],
      transparencia: [],
      gaceta: [],
      sesiones: [],
      convocatorias: [],
      repositorio: [],
      total: 0
    };

    // Búsqueda en Noticias
    if (!tipo || tipo === 'noticias' || tipo === 'todos') {
      try {
        let noticiasQuery = `
          SELECT 
            id, titulo, resumen, contenido, categoria, 
            fecha_publicacion, creado_en, imagen_url,
            'noticia' as tipo_resultado
          FROM noticias
          WHERE publicada = TRUE
          AND (
            titulo LIKE ? OR 
            resumen LIKE ? OR 
            contenido LIKE ? OR
            categoria LIKE ?
          )
        `;
        const noticiasParams = [searchTerm, searchTerm, searchTerm, searchTerm];

        if (fecha_desde) {
          noticiasQuery += ' AND DATE(fecha_publicacion) >= ?';
          noticiasParams.push(fecha_desde);
        }

        if (fecha_hasta) {
          noticiasQuery += ' AND DATE(fecha_publicacion) <= ?';
          noticiasParams.push(fecha_hasta);
        }

        noticiasQuery += ' ORDER BY COALESCE(fecha_publicacion, creado_en) DESC LIMIT 20';

        const [noticias] = await pool.execute(noticiasQuery, noticiasParams);
        results.noticias = noticias;
      } catch (error) {
        console.error('Error buscando en noticias:', error.message);
        results.noticias = [];
      }
    }

    // Búsqueda en Transparencia
    if (!tipo || tipo === 'transparencia' || tipo === 'todos') {
      try {
        let transparenciaQuery = `
          SELECT 
            id, titulo, descripcion, categoria, 
            fecha as fecha_publicacion, creado_en, archivo_url,
            'transparencia' as tipo_resultado
          FROM documentos_transparencia
          WHERE publicada = TRUE
          AND (
            titulo LIKE ? OR 
            descripcion LIKE ? OR
            categoria LIKE ?
          )
        `;
        const transparenciaParams = [searchTerm, searchTerm, searchTerm];

        if (categoria && categoria !== 'todas') {
          transparenciaQuery += ' AND categoria = ?';
          transparenciaParams.push(categoria);
        }

        if (fecha_desde) {
          transparenciaQuery += ' AND DATE(COALESCE(fecha, creado_en)) >= ?';
          transparenciaParams.push(fecha_desde);
        }

        if (fecha_hasta) {
          transparenciaQuery += ' AND DATE(COALESCE(fecha, creado_en)) <= ?';
          transparenciaParams.push(fecha_hasta);
        }

        transparenciaQuery += ' ORDER BY COALESCE(fecha, creado_en) DESC LIMIT 20';

        const [transparencia] = await pool.execute(transparenciaQuery, transparenciaParams);
        results.transparencia = transparencia;
      } catch (error) {
        console.error('Error buscando en transparencia:', error.message);
        results.transparencia = [];
      }
    }

    // Búsqueda en Gaceta
    if (!tipo || tipo === 'gaceta' || tipo === 'todos') {
      try {
        let gacetaQuery = `
          SELECT 
            id, numero, titulo, descripcion, tipo, 
            fecha as fecha_publicacion, creado_en, archivo_url,
            'gaceta' as tipo_resultado
          FROM documentos_gaceta
          WHERE publicada = TRUE
          AND (
            numero LIKE ? OR
            titulo LIKE ? OR 
            descripcion LIKE ? OR
            tipo LIKE ?
          )
        `;
        const gacetaParams = [searchTerm, searchTerm, searchTerm, searchTerm];

        if (fecha_desde) {
          gacetaQuery += ' AND DATE(COALESCE(fecha, creado_en)) >= ?';
          gacetaParams.push(fecha_desde);
        }

        if (fecha_hasta) {
          gacetaQuery += ' AND DATE(COALESCE(fecha, creado_en)) <= ?';
          gacetaParams.push(fecha_hasta);
        }

        gacetaQuery += ' ORDER BY COALESCE(fecha, creado_en) DESC LIMIT 20';

        const [gaceta] = await pool.execute(gacetaQuery, gacetaParams);
        results.gaceta = gaceta;
      } catch (error) {
        console.error('Error buscando en gaceta:', error.message);
        results.gaceta = [];
      }
    }

    // Búsqueda en Sesiones
    if (!tipo || tipo === 'sesiones' || tipo === 'todos') {
      try {
        let sesionesQuery = `
          SELECT 
            id, numero_sesion, tipo_sesion, resumen, orden_dia, 
            fecha as fecha_sesion, creado_en,
            'sesion' as tipo_resultado
          FROM sesiones_concejo
          WHERE publicada = TRUE
          AND (
            CAST(numero_sesion AS CHAR) LIKE ? OR
            resumen LIKE ? OR 
            orden_dia LIKE ? OR
            tipo_sesion LIKE ?
          )
        `;
        const sesionesParams = [searchTerm, searchTerm, searchTerm, searchTerm];

        if (fecha_desde) {
          sesionesQuery += ' AND DATE(COALESCE(fecha, creado_en)) >= ?';
          sesionesParams.push(fecha_desde);
        }

        if (fecha_hasta) {
          sesionesQuery += ' AND DATE(COALESCE(fecha, creado_en)) <= ?';
          sesionesParams.push(fecha_hasta);
        }

        sesionesQuery += ' ORDER BY COALESCE(fecha, creado_en) DESC LIMIT 20';

        const [sesiones] = await pool.execute(sesionesQuery, sesionesParams);
        results.sesiones = sesiones;
      } catch (error) {
        console.error('Error buscando en sesiones:', error.message);
        results.sesiones = [];
      }
    }

    // Búsqueda en Convocatorias
    if (!tipo || tipo === 'convocatorias' || tipo === 'todos') {
      try {
        let convocatoriasQuery = `
          SELECT 
            id, titulo, descripcion, tipo, 
            fecha_inicio, fecha_fin, creado_en, imagen_url,
            'convocatoria' as tipo_resultado
          FROM convocatorias
          WHERE activa = TRUE
          AND (
            titulo LIKE ? OR 
            descripcion LIKE ? OR
            tipo LIKE ?
          )
        `;
        const convocatoriasParams = [searchTerm, searchTerm, searchTerm];

        if (fecha_desde) {
          convocatoriasQuery += ' AND DATE(fecha_inicio) >= ?';
          convocatoriasParams.push(fecha_desde);
        }

        if (fecha_hasta) {
          convocatoriasQuery += ' AND DATE(fecha_fin) <= ?';
          convocatoriasParams.push(fecha_hasta);
        }

        convocatoriasQuery += ' ORDER BY fecha_inicio DESC LIMIT 20';

        const [convocatorias] = await pool.execute(convocatoriasQuery, convocatoriasParams);
        results.convocatorias = convocatorias;
      } catch (error) {
        console.error('Error buscando en convocatorias:', error.message);
        results.convocatorias = [];
      }
    }

    // Búsqueda en Repositorio
    console.log('🔍 Verificando búsqueda en repositorio. Tipo:', tipo, 'SearchTerm:', searchTerm);
    if (!tipo || tipo === 'repositorio' || tipo === 'todos') {
      try {
        // Limpiar el término de búsqueda (remover wildcards de SQL)
        const searchTermClean = searchTerm.replace(/%/g, '').trim();
        console.log('🔍 Iniciando búsqueda en repositorio con término limpio:', searchTermClean);
        const repositorioResults = buscarEnRepositorio(searchTermClean);
        console.log(`✅ Búsqueda en repositorio completada. Encontrados: ${repositorioResults ? repositorioResults.length : 0} archivos`);
        results.repositorio = repositorioResults || [];
      } catch (error) {
        console.error('❌ Error buscando en repositorio:', error.message);
        console.error('Stack:', error.stack);
        results.repositorio = [];
      }
    } else {
      console.log('⏭️ Búsqueda en repositorio omitida (tipo:', tipo, ')');
      results.repositorio = [];
    }

    // Calcular total
    results.total = 
      results.noticias.length +
      results.transparencia.length +
      results.gaceta.length +
      results.sesiones.length +
      results.convocatorias.length +
      results.repositorio.length;

    res.json(results);
  } catch (error) {
    console.error('Error en búsqueda:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Error al realizar la búsqueda',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Endpoint para autocompletado
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '' || q.length < 2) {
      return res.json([]);
    }

    const searchTerm = `%${q.trim()}%`;
    const suggestions = [];

    // Obtener sugerencias de títulos de diferentes tablas
    const queries = [
      {
        query: `SELECT DISTINCT titulo as texto, 'noticia' as tipo FROM noticias WHERE publicada = TRUE AND titulo LIKE ? LIMIT 5`,
        params: [searchTerm]
      },
      {
        query: `SELECT DISTINCT titulo as texto, 'transparencia' as tipo FROM documentos_transparencia WHERE publicada = TRUE AND titulo LIKE ? LIMIT 5`,
        params: [searchTerm]
      },
      {
        query: `SELECT DISTINCT titulo as texto, 'gaceta' as tipo FROM documentos_gaceta WHERE publicada = TRUE AND titulo LIKE ? LIMIT 5`,
        params: [searchTerm]
      },
      {
        query: `SELECT DISTINCT CONCAT('Sesión ', numero_sesion, ' - ', tipo_sesion) as texto, 'sesion' as tipo FROM sesiones_concejo WHERE publicada = TRUE AND (numero_sesion LIKE ? OR tipo_sesion LIKE ?) LIMIT 5`,
        params: [searchTerm, searchTerm]
      },
      {
        query: `SELECT DISTINCT titulo as texto, 'convocatoria' as tipo FROM convocatorias WHERE activa = TRUE AND titulo LIKE ? LIMIT 5`,
        params: [searchTerm]
      }
    ];

    for (const { query, params } of queries) {
      try {
        const [results] = await pool.execute(query, params);
        suggestions.push(...results);
      } catch (error) {
        console.error('Error en sugerencia:', error);
      }
    }

    // Limitar y ordenar sugerencias
    const uniqueSuggestions = suggestions
      .slice(0, 8)
      .map(s => ({ texto: s.texto, tipo: s.tipo }));

    res.json(uniqueSuggestions);
  } catch (error) {
    console.error('Error en autocompletado:', error);
    res.status(500).json({ error: 'Error al obtener sugerencias' });
  }
});

module.exports = router;

