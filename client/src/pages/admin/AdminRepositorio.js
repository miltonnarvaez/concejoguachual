import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { 
  FaFolder, 
  FaFileAlt, 
  FaDownload, 
  FaTrash, 
  FaExchangeAlt,
  FaChartBar,
  FaSpinner,
  FaCheckCircle,
  FaTimes,
  FaInfoCircle,
  FaArrowLeft,
  FaArrowRight,
  FaSync,
  FaServer,
  FaMagic
} from 'react-icons/fa';
import AdminNavbar from '../../components/admin/AdminNavbar';
import './AdminRepositorio.css';

const AdminRepositorio = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [mostrarMover, setMostrarMover] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [mostrarSincronizar, setMostrarSincronizar] = useState(false);
  const [modoSincronizacion, setModoSincronizacion] = useState('api'); // 'api' o 'local'
  const [servidorUrl, setServidorUrl] = useState('https://camsoft.com.co/concejoguachucal');
  const [servidorPath, setServidorPath] = useState('C:\\Users\\Milton Narvaez\\Documents\\cursor\\concejo\\server\\uploads\\repositorio-temporal');
  const [sincronizando, setSincronizando] = useState(false);
  const [resultadoSincronizacion, setResultadoSincronizacion] = useState(null);
  const [organizando, setOrganizando] = useState(false);
  const [resultadoOrganizacion, setResultadoOrganizacion] = useState(null);
  const [mostrarOrganizar, setMostrarOrganizar] = useState(false);

  // Obtener estadísticas (sin autenticación temporalmente)
  const { data: estadisticas, isLoading: loadingStats } = useQuery({
    queryKey: ['repositorio-estadisticas'],
    queryFn: async () => {
      try {
        // Intentar obtener estadísticas, si falla calcularlas manualmente
        const response = await api.get('/repositorio/listar');
        const datos = response.data;
        
        let totalArchivos = 0;
        let totalTamaño = 0;
        const categoriasStats = {};
        
        Object.keys(datos.categorias || {}).forEach(cat => {
          const catData = datos.categorias[cat];
          const tamañoCategoria = catData.archivos.reduce((sum, archivo) => sum + archivo.tamaño, 0);
          categoriasStats[cat] = {
            nombre: catData.nombre,
            cantidad: catData.total,
            tamañoMB: (tamañoCategoria / (1024 * 1024)).toFixed(2)
          };
          totalArchivos += catData.total;
          totalTamaño += tamañoCategoria;
        });
        
        return {
          categorias: categoriasStats,
          totalArchivos: totalArchivos,
          totalTamañoMB: (totalTamaño / (1024 * 1024)).toFixed(2)
        };
      } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        return { categorias: {}, totalArchivos: 0, totalTamañoMB: '0' };
      }
    }
  });

  // Obtener archivos (sin autenticación temporalmente)
  const { data: datosArchivos, isLoading: loadingArchivos, refetch } = useQuery({
    queryKey: ['repositorio-archivos', categoriaSeleccionada],
    queryFn: async () => {
      const url = categoriaSeleccionada 
        ? `/repositorio/listar/${categoriaSeleccionada}`
        : '/repositorio/listar';
      const response = await api.get(url);
      return response.data;
    }
  });

  const categorias = [
    { id: 'acerca-de', nombre: 'Acerca del Concejo' },
    { id: 'miembros', nombre: 'Miembros del Concejo' },
    { id: 'historia', nombre: 'Historia' },
    { id: 'gaceta', nombre: 'Gaceta' },
    { id: 'sesiones', nombre: 'Sesiones' },
    { id: 'transparencia', nombre: 'Transparencia' },
    { id: 'documentos-oficiales', nombre: 'Documentos Oficiales' },
    { id: 'documentos-generales', nombre: 'Documentos Generales' }
  ];

  const handleDescargar = async (categoria, nombreArchivo) => {
    try {
      // Usar endpoint público temporalmente
      const response = await api.get(
        `/repositorio/descargar/${categoria}/${nombreArchivo}`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', nombreArchivo);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error descargando archivo:', error);
      setMensaje({ tipo: 'error', texto: 'Error descargando archivo' });
    }
  };

  const handleEliminar = async (categoria, nombreArchivo) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${nombreArchivo}"?`)) {
      return;
    }

    try {
      await api.delete(`/repositorio/eliminar/${categoria}/${nombreArchivo}`);
      setMensaje({ tipo: 'exito', texto: 'Archivo eliminado exitosamente' });
      refetch();
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
    } catch (error) {
      console.error('Error eliminando archivo:', error);
      setMensaje({ tipo: 'error', texto: 'Error eliminando archivo' });
    }
  };

  const handleMover = async () => {
    if (!archivoSeleccionado || !nuevaCategoria) {
      setMensaje({ tipo: 'error', texto: 'Selecciona una categoría de destino' });
      return;
    }

    try {
      // Usar endpoint público temporalmente
      await api.put('/repositorio/mover', {
        categoriaOrigen: archivoSeleccionado.categoria,
        categoriaDestino: nuevaCategoria,
        nombreArchivo: archivoSeleccionado.nombre
      });
      
      setMensaje({ tipo: 'exito', texto: 'Archivo movido exitosamente' });
      setMostrarMover(false);
      setArchivoSeleccionado(null);
      setNuevaCategoria('');
      refetch();
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
    } catch (error) {
      console.error('Error moviendo archivo:', error);
      setMensaje({ tipo: 'error', texto: 'Error moviendo archivo' });
    }
  };

  const handleSincronizar = async () => {
    if (modoSincronizacion === 'api' && !servidorUrl.trim()) {
      setMensaje({ tipo: 'error', texto: 'Ingresa la URL del servidor' });
      return;
    }
    
    if (modoSincronizacion === 'local' && !servidorPath.trim()) {
      setMensaje({ tipo: 'error', texto: 'Ingresa la ruta del servidor local' });
      return;
    }

    setSincronizando(true);
    setResultadoSincronizacion(null);
    setMensaje({ tipo: '', texto: '' });

    try {
      const requestBody = {
        modo: modoSincronizacion
      };
      
      if (modoSincronizacion === 'api') {
        requestBody.servidorUrl = servidorUrl.trim();
      } else {
        requestBody.servidorPath = servidorPath.trim();
      }
      
      const response = await api.post('/repositorio/sincronizar', requestBody);

      setResultadoSincronizacion(response.data);
      setMensaje({ 
        tipo: 'exito', 
        texto: `Sincronización completada: ${response.data.resumen.totalSincronizados} archivo(s) procesado(s)` 
      });
      
      // Recargar datos después de sincronizar
      refetch();
      
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000);
    } catch (error) {
      console.error('Error sincronizando:', error);
      setMensaje({ 
        tipo: 'error', 
        texto: error.response?.data?.error || 'Error sincronizando archivos' 
      });
      setResultadoSincronizacion(null);
    } finally {
      setSincronizando(false);
    }
  };

  const handleOrganizar = async () => {
    if (!window.confirm('¿Estás seguro de que deseas organizar automáticamente todos los documentos? Esta acción moverá los archivos a sus carpetas correspondientes.')) {
      return;
    }

    setOrganizando(true);
    setResultadoOrganizacion(null);
    setMensaje({ tipo: '', texto: '' });

    try {
      const response = await api.post('/repositorio/admin/organizar');

      setResultadoOrganizacion(response.data);
      setMensaje({ 
        tipo: 'exito', 
        texto: `Organización completada: ${response.data.resumen.movidos} archivo(s) movido(s)` 
      });
      
      // Recargar datos después de organizar
      refetch();
      
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000);
    } catch (error) {
      console.error('Error organizando:', error);
      setMensaje({ 
        tipo: 'error', 
        texto: error.response?.data?.error || 'Error organizando archivos' 
      });
      setResultadoOrganizacion(null);
    } finally {
      setOrganizando(false);
    }
  };

  const formatearTamaño = (mb) => {
    return `${mb} MB`;
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obtenerIconoArchivo = (extension) => {
    const iconos = {
      '.pdf': '📄',
      '.doc': '📝',
      '.docx': '📝',
      '.xls': '📊',
      '.xlsx': '📊',
      '.ppt': '📽️',
      '.pptx': '📽️',
      '.jpg': '🖼️',
      '.jpeg': '🖼️',
      '.png': '🖼️',
      '.gif': '🖼️',
      '.txt': '📄',
      '.csv': '📊',
      '.json': '📋',
      '.xml': '📋',
      '.zip': '📦',
      '.rar': '📦'
    };
    return iconos[extension.toLowerCase()] || '📎';
  };

  if (loadingStats || loadingArchivos) {
    return (
      <div className="admin-repositorio">
        <AdminNavbar />
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Cargando repositorio...</p>
        </div>
      </div>
    );
  }

  const archivos = categoriaSeleccionada && datosArchivos?.archivos
    ? datosArchivos.archivos
    : datosArchivos?.categorias
    ? Object.values(datosArchivos.categorias).flatMap(cat => cat.archivos)
    : [];

  return (
    <div className="admin-repositorio">
      <div className="admin-container">
        <div className="repositorio-public-header">
          <h1>📁 Repositorio Temporal - Vista de Administrador</h1>
          <p>Revisa y organiza los archivos subidos al repositorio</p>
        </div>
        <div className="admin-header">
          <h1>Repositorio Temporal</h1>
          <p>Revisa y procesa los archivos subidos por el concejo</p>
        </div>

        {mensaje.texto && (
          <div className={`mensaje mensaje-${mensaje.tipo}`}>
            {mensaje.tipo === 'exito' ? <FaCheckCircle /> : <FaTimes />}
            <span>{mensaje.texto}</span>
          </div>
        )}

        {/* Estadísticas */}
        {estadisticas && (
          <div className="repositorio-stats">
            <div className="stat-card">
              <FaChartBar className="stat-icon" />
              <div>
                <h3>{estadisticas.totalArchivos}</h3>
                <p>Total Archivos</p>
              </div>
            </div>
            <div className="stat-card">
              <FaFolder className="stat-icon" />
              <div>
                <h3>{estadisticas.totalTamañoMB} MB</h3>
                <p>Espacio Total</p>
              </div>
            </div>
          </div>
        )}

        {/* Sección de Sincronización */}
        <div className="sincronizacion-section">
          <div className="sincronizacion-header">
            <div>
              <h2>
                <FaSync /> Sincronización con Servidor
              </h2>
              <p>Sincroniza archivos desde el servidor de producción</p>
            </div>
            <button
              className="btn-sincronizar-toggle"
              onClick={() => {
                setMostrarSincronizar(!mostrarSincronizar);
                setResultadoSincronizacion(null);
              }}
            >
              {mostrarSincronizar ? <FaTimes /> : <FaServer />}
              {mostrarSincronizar ? 'Ocultar' : 'Sincronizar'}
            </button>
          </div>

          {mostrarSincronizar && (
            <div className="sincronizacion-form">
              <div className="form-group">
                <label>
                  <FaServer /> Modo de sincronización:
                </label>
                <select
                  value={modoSincronizacion}
                  onChange={(e) => setModoSincronizacion(e.target.value)}
                  disabled={sincronizando}
                >
                  <option value="api">Remoto (API)</option>
                  <option value="local">Local (Ruta del servidor)</option>
                </select>
                <small>
                  {modoSincronizacion === 'api' 
                    ? 'Sincroniza desde un servidor remoto vía API'
                    : 'Sincroniza desde una ruta local del servidor'}
                </small>
              </div>

              {modoSincronizacion === 'api' ? (
                <div className="form-group">
                  <label>
                    <FaServer /> URL del servidor:
                  </label>
                  <input
                    type="text"
                    value={servidorUrl}
                    onChange={(e) => setServidorUrl(e.target.value)}
                    placeholder="Ej: https://camsoft.com.co/concejoguachucal"
                    disabled={sincronizando}
                  />
                  <small>
                    Ingresa la URL base del servidor de producción (sin /api al final)
                  </small>
                </div>
              ) : (
                <div className="form-group">
                  <label>
                    <FaFolder /> Ruta del servidor:
                  </label>
                  <input
                    type="text"
                    value={servidorPath}
                    onChange={(e) => setServidorPath(e.target.value)}
                    placeholder="Ej: C:\\ruta\\al\\servidor\\uploads\\repositorio-temporal"
                    disabled={sincronizando}
                  />
                  <small>
                    Ingresa la ruta completa del directorio del servidor en el sistema de archivos
                  </small>
                </div>
              )}

              <button
                className="btn btn-sincronizar"
                onClick={handleSincronizar}
                disabled={sincronizando || (modoSincronizacion === 'api' ? !servidorUrl.trim() : !servidorPath.trim())}
              >
                {sincronizando ? (
                  <>
                    <FaSpinner className="spinner" /> Sincronizando...
                  </>
                ) : (
                  <>
                    <FaSync /> Iniciar Sincronización
                  </>
                )}
              </button>

              {resultadoSincronizacion && (
                <div className="resultado-sincronizacion">
                  <h3>
                    <FaCheckCircle /> Resultado de la Sincronización
                  </h3>
                  <div className="resumen-stats">
                    <div className="resumen-item resumen-nuevos">
                      <strong>{resultadoSincronizacion.resumen.nuevos}</strong>
                      <span>Nuevos</span>
                    </div>
                    <div className="resumen-item resumen-modificados">
                      <strong>{resultadoSincronizacion.resumen.modificados}</strong>
                      <span>Modificados</span>
                    </div>
                    <div className="resumen-item resumen-omitidos">
                      <strong>{resultadoSincronizacion.resumen.omitidos}</strong>
                      <span>Omitidos</span>
                    </div>
                    <div className="resumen-item resumen-total">
                      <strong>{resultadoSincronizacion.resumen.totalSincronizados}</strong>
                      <span>Total Procesados</span>
                    </div>
                  </div>
                  {resultadoSincronizacion.errores && resultadoSincronizacion.errores.length > 0 && (
                    <div className="errores-sincronizacion">
                      <h4>Errores ({resultadoSincronizacion.errores.length}):</h4>
                      <ul>
                        {resultadoSincronizacion.errores.map((error, index) => (
                          <li key={index}>
                            <strong>{error.archivo}:</strong> {error.error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sección de Organización Automática */}
        <div className="organizacion-section">
          <div className="organizacion-header">
            <div>
              <h2>
                <FaMagic /> Organización Automática
              </h2>
              <p>Organiza automáticamente los documentos en sus carpetas correspondientes según su nombre</p>
            </div>
            <button
              className="btn-organizar-toggle"
              onClick={() => {
                setMostrarOrganizar(!mostrarOrganizar);
                setResultadoOrganizacion(null);
              }}
            >
              {mostrarOrganizar ? <FaTimes /> : <FaMagic />}
              {mostrarOrganizar ? 'Ocultar' : 'Organizar'}
            </button>
          </div>

          {mostrarOrganizar && (
            <div className="organizacion-form">
              <div className="organizacion-info">
                <FaInfoCircle />
                <p>
                  Esta función analizará todos los archivos del repositorio y los moverá automáticamente 
                  a las carpetas correctas basándose en palabras clave en sus nombres. Por ejemplo:
                </p>
                <ul>
                  <li>Archivos con "ACTA" o "SESION" → Documentos - Actas de Sesión</li>
                  <li>Archivos con "ACUERDO" → Documentos - Acuerdos</li>
                  <li>Archivos con "DECRETO" → Documentos - Decretos</li>
                  <li>Archivos con "PLAN" → Documentos - Planes</li>
                  <li>Archivos con "REGLAMENTO" → Reglamento Interno</li>
                  <li>Y muchos más...</li>
                </ul>
              </div>

              <button
                onClick={handleOrganizar}
                className="btn btn-organizar"
                disabled={organizando}
              >
                {organizando ? (
                  <>
                    <FaSpinner className="spinner" />
                    Organizando...
                  </>
                ) : (
                  <>
                    <FaMagic /> Iniciar Organización
                  </>
                )}
              </button>

              {resultadoOrganizacion && (
                <div className="resultado-organizacion">
                  <h3>
                    <FaCheckCircle /> Resultado de la Organización
                  </h3>
                  <div className="resumen-stats">
                    <div className="resumen-item resumen-movidos">
                      <strong>{resultadoOrganizacion.resumen.movidos}</strong>
                      <span>Movidos</span>
                    </div>
                    <div className="resumen-item resumen-sin-cambios">
                      <strong>{resultadoOrganizacion.resumen.sinCambios}</strong>
                      <span>Sin Cambios</span>
                    </div>
                    <div className="resumen-item resumen-total">
                      <strong>{resultadoOrganizacion.resumen.totalProcesados}</strong>
                      <span>Total Procesados</span>
                    </div>
                    {resultadoOrganizacion.resumen.errores > 0 && (
                      <div className="resumen-item resumen-errores">
                        <strong>{resultadoOrganizacion.resumen.errores}</strong>
                        <span>Errores</span>
                      </div>
                    )}
                  </div>
                  
                  {resultadoOrganizacion.detalles?.movidos && resultadoOrganizacion.detalles.movidos.length > 0 && (
                    <div className="archivos-movidos">
                      <h4>Archivos Movidos ({resultadoOrganizacion.detalles.movidos.length}):</h4>
                      <div className="lista-movimientos">
                        {resultadoOrganizacion.detalles.movidos.slice(0, 20).map((movimiento, index) => (
                          <div key={index} className="movimiento-item">
                            <strong>{movimiento.archivo}</strong>
                            <span className="movimiento-flecha">→</span>
                            <span>{movimiento.nombreCategoriaDestino}</span>
                          </div>
                        ))}
                        {resultadoOrganizacion.detalles.movidos.length > 20 && (
                          <p className="mas-archivos">
                            ... y {resultadoOrganizacion.detalles.movidos.length - 20} archivo(s) más
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {resultadoOrganizacion.detalles?.errores && resultadoOrganizacion.detalles.errores.length > 0 && (
                    <div className="errores-organizacion">
                      <h4>Errores ({resultadoOrganizacion.detalles.errores.length}):</h4>
                      <ul>
                        {resultadoOrganizacion.detalles.errores.map((error, index) => (
                          <li key={index}>
                            <strong>{error.archivo}:</strong> {error.error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filtro por categoría */}
        <div className="filtro-categoria">
          <label>
            <FaFolder /> Filtrar por categoría:
          </label>
          <select
            value={categoriaSeleccionada || ''}
            onChange={(e) => setCategoriaSeleccionada(e.target.value || null)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre} 
                {estadisticas?.categorias[cat.id] && 
                  ` (${estadisticas.categorias[cat.id].cantidad} archivos)`
                }
              </option>
            ))}
          </select>
        </div>

        {/* Lista de archivos */}
        {categoriaSeleccionada && datosArchivos?.nombreCategoria && (
          <div className="categoria-header">
            <h2>{datosArchivos.nombreCategoria}</h2>
            <p>{datosArchivos.total} archivo(s)</p>
          </div>
        )}

        {archivos.length === 0 ? (
          <div className="sin-archivos">
            <FaInfoCircle />
            <p>No hay archivos en esta categoría</p>
          </div>
        ) : (
          <div className="archivos-grid">
            {archivos.map((archivo, index) => (
              <div key={index} className="archivo-card">
                <div className="archivo-header">
                  <span className="archivo-icon">
                    {obtenerIconoArchivo(archivo.extension)}
                  </span>
                  <div className="archivo-info">
                    <h3 title={archivo.nombreOriginal || archivo.nombre}>
                      {archivo.nombreOriginal || archivo.nombre}
                    </h3>
                    <p className="archivo-meta">
                      {formatearTamaño(archivo.tamañoMB)} • {archivo.categoria}
                    </p>
                    <p className="archivo-fecha">
                      Subido: {formatearFecha(archivo.fechaSubida)}
                    </p>
                    {archivo.nota && (
                      <p className="archivo-nota">
                        <FaInfoCircle className="nota-icon" />
                        <strong>Nota:</strong> {archivo.nota}
                      </p>
                    )}
                  </div>
                </div>
                <div className="archivo-acciones">
                  <button
                    className="btn-accion btn-descargar"
                    onClick={() => handleDescargar(archivo.categoria, archivo.nombre)}
                    title="Descargar archivo"
                  >
                    <FaDownload /> Descargar
                  </button>
                  <button
                    className="btn-accion btn-mover"
                    onClick={() => {
                      setArchivoSeleccionado(archivo);
                      setMostrarMover(true);
                    }}
                    title="Mover a otra categoría"
                  >
                    <FaExchangeAlt /> Mover
                  </button>
                  <button
                    className="btn-accion btn-eliminar"
                    onClick={() => handleEliminar(archivo.categoria, archivo.nombre)}
                    title="Eliminar archivo"
                  >
                    <FaTrash /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal para mover archivo */}
        {mostrarMover && archivoSeleccionado && (
          <div className="modal-overlay" onClick={() => setMostrarMover(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Mover Archivo</h3>
                <button 
                  className="modal-close"
                  onClick={() => {
                    setMostrarMover(false);
                    setArchivoSeleccionado(null);
                    setNuevaCategoria('');
                  }}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Archivo:</strong> {archivoSeleccionado.nombreOriginal || archivoSeleccionado.nombre}
                </p>
                <p>
                  <strong>Categoría actual:</strong> {categorias.find(c => c.id === archivoSeleccionado.categoria)?.nombre}
                </p>
                <div className="form-group">
                  <label>Nueva categoría:</label>
                  <select
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias
                      .filter(c => c.id !== archivoSeleccionado.categoria)
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setMostrarMover(false);
                    setArchivoSeleccionado(null);
                    setNuevaCategoria('');
                  }}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleMover}
                  disabled={!nuevaCategoria}
                >
                  <FaExchangeAlt /> Mover
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Información de uso */}
        <div className="repositorio-info-admin">
          <FaInfoCircle />
          <div>
            <p><strong>Instrucciones:</strong></p>
            <ul>
              <li>Los archivos están organizados por categorías</li>
              <li>Puedes descargar, mover o eliminar archivos</li>
              <li>Después de revisar, puedes procesar los archivos desde sus respectivas secciones del admin</li>
              <li>Los archivos están disponibles en: <code>server/uploads/repositorio-temporal/</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRepositorio;







