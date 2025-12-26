import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getFileUrl } from '../utils/fileUtils';
import { FaClipboardList, FaBolt, FaStar, FaFileAlt, FaDownload } from 'react-icons/fa';
import './Sesiones.css';

const Sesiones = () => {
  const [tipoFiltro, setTipoFiltro] = useState('todas');
  const [sesionSeleccionada, setSesionSeleccionada] = useState(null);

  const { data: sesiones = [], isLoading } = useQuery({
    queryKey: ['sesiones', tipoFiltro],
    queryFn: async () => {
      const params = tipoFiltro !== 'todas' ? { tipo: tipoFiltro } : {};
      const response = await api.get('/sesiones', { params });
      return response.data;
    }
  });

  // Obtener documentos del repositorio para sesiones
  const { data: datosRepositorio } = useQuery({
    queryKey: ['repositorio-sesiones'],
    queryFn: async () => {
      try {
        const response = await api.get('/repositorio/listar/sesiones');
        return response.data;
      } catch (error) {
        console.error('Error cargando archivos del repositorio:', error);
        return { archivos: [] };
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const archivosRepositorio = datosRepositorio?.archivos || [];
  
  // Convertir archivos del repositorio al formato de documentos
  const documentosRepositorio = archivosRepositorio.map((archivo, index) => ({
    id: `repo-${archivo.nombre}-${index}`,
    titulo: archivo.nombreOriginal || archivo.nombre,
    descripcion: archivo.nota || '',
    fecha: archivo.fechaSubida,
    archivo_url: `/api/repositorio/descargar/sesiones/${encodeURIComponent(archivo.nombre)}`,
    esRepositorio: true,
    tamaño: archivo.tamañoMB
  }));

  const tiposSesion = [
    { value: 'todas', label: 'Todas las Sesiones' },
    { value: 'ordinaria', label: 'Sesiones Ordinarias' },
    { value: 'extraordinaria', label: 'Sesiones Extraordinarias' },
    { value: 'especial', label: 'Sesiones Especiales' }
  ];

  const renderVideo = (videoUrl, embedCode) => {
    if (embedCode) {
      return (
        <div 
          className="video-embed" 
          dangerouslySetInnerHTML={{ __html: embedCode }}
        />
      );
    }
    
    if (videoUrl) {
      // Detectar si es YouTube
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const videoId = videoUrl.includes('youtu.be') 
          ? videoUrl.split('/').pop().split('?')[0]
          : videoUrl.split('v=')[1]?.split('&')[0];
        
        return (
          <div className="video-embed">
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="Video de sesión"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }
      
      // Detectar si es Facebook
      if (videoUrl.includes('facebook.com')) {
        return (
          <div className="video-embed">
            <iframe
              src={videoUrl.replace('/videos/', '/videos/embed/')}
              width="100%"
              height="500"
              style={{ border: 'none', overflow: 'hidden' }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          </div>
        );
      }
      
      // Video directo
      return (
        <div className="video-embed">
          <video controls width="100%" style={{ maxHeight: '500px' }}>
            <source src={videoUrl} type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
        </div>
      );
    }
    
    return null;
  };

  if (isLoading) {
    return <div className="loading">Cargando sesiones...</div>;
  }

  return (
    <div className="sesiones-page">
      <section className="section">
        <div className="container">
          <div className="sesiones-header">
            <h1 className="page-title">Sesiones del Concejo</h1>
            <p className="sesiones-intro">
              Aquí encontrará información sobre las sesiones del Concejo Municipal de Guachucal, 
              incluyendo videos, actas y documentos relacionados.
            </p>
          </div>

          {/* Filtros */}
          <div className="sesiones-filtros">
            {tiposSesion.map(tipo => (
              <button
                key={tipo.value}
                className={`filtro-btn ${tipoFiltro === tipo.value ? 'active' : ''}`}
                onClick={() => setTipoFiltro(tipo.value)}
              >
                {tipo.label}
              </button>
            ))}
          </div>

          {/* Enlace a Facebook */}
          <div className="facebook-link-section">
            <a 
              href="https://www.facebook.com/p/Concejo-Municipal-de-Guachucal-61555825801735/?locale=es_LA" 
              target="_blank" 
              rel="noopener noreferrer"
              className="facebook-link-btn"
            >
              <span>📘</span> Ver más información en nuestra página de Facebook
            </a>
          </div>

          {/* Sesiones de la Base de Datos */}
          {sesiones.length > 0 && (
            <div className="sesiones-seccion">
              <h2 className="seccion-titulo">Sesiones Registradas</h2>
              <div className="sesiones-grid">
                {sesiones.map((sesion) => (
                <div key={sesion.id} className="sesion-card">
                  <div className="sesion-header">
                    <span className={`sesion-tipo ${sesion.tipo}`}>
                      {sesion.tipo === 'ordinaria' ? <><FaClipboardList /> Ordinaria</> :
                       sesion.tipo === 'extraordinaria' ? <><FaBolt /> Extraordinaria</> :
                       <><FaStar /> Especial</>}
                    </span>
                    {sesion.destacada && (
                      <span className="sesion-destacada"><FaStar /> Destacada</span>
                    )}
                  </div>
                  
                  <div className="sesion-content">
                    <h3>Sesión {sesion.numero_sesion}</h3>
                    <div className="sesion-info">
                      <p><strong>Fecha:</strong> {new Date(sesion.fecha).toLocaleDateString('es-CO', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                      {sesion.hora && (
                        <p><strong>Hora:</strong> {sesion.hora}</p>
                      )}
                      <p><strong>Lugar:</strong> {sesion.lugar}</p>
                    </div>
                    
                    {sesion.resumen && (
                      <p className="sesion-resumen">{sesion.resumen}</p>
                    )}

                    <div className="sesion-actions">
                      {sesion.video_url || sesion.video_embed_code ? (
                        <button
                          onClick={() => setSesionSeleccionada(sesionSeleccionada === sesion.id ? null : sesion.id)}
                          className="btn btn-primary"
                        >
                          {sesionSeleccionada === sesion.id ? 'Ocultar' : 'Ver'} Video
                        </button>
                      ) : null}
                      
                      {sesion.acta_url && (
                        <a
                          href={getFileUrl(sesion.acta_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary"
                        >
                          Ver Acta
                        </a>
                      )}
                      
                      <Link to={`/sesiones/${sesion.id}`} className="btn btn-outline">
                        Ver Detalles
                      </Link>
                    </div>

                    {sesionSeleccionada === sesion.id && (
                      <div className="sesion-video-container">
                        {renderVideo(sesion.video_url, sesion.video_embed_code)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              </div>
            </div>
          )}

          {/* Archivos del Repositorio */}
          {archivosRepositorio.length > 0 && (
            <div className="sesiones-seccion documentos-repositorio-seccion">
              <h2 className="seccion-titulo">
                <FaFileAlt /> Documentos del Repositorio
                <span className="seccion-count">({archivosRepositorio.length})</span>
              </h2>
              <div className="documentos-grid">
                {documentosRepositorio.map((documento) => (
                  <div key={documento.id} className="documento-card documento-repositorio">
                    <div className="documento-content">
                      <span className="documento-badge-repositorio">
                        <FaFileAlt /> Repositorio
                      </span>
                      <h3>{documento.titulo}</h3>
                      {documento.descripcion && <p>{documento.descripcion}</p>}
                      {documento.fecha && (
                        <p className="documento-fecha">
                          Fecha: {new Date(documento.fecha).toLocaleDateString('es-CO', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                      {documento.tamaño && (
                        <p className="documento-tamaño">
                          Tamaño: {parseFloat(documento.tamaño).toFixed(2)} MB
                        </p>
                      )}
                      <div className="documento-actions">
                        {documento.archivo_url && (
                          <a
                            href={getFileUrl(documento.archivo_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                          >
                            <FaDownload /> Descargar documento →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mensaje si no hay nada */}
          {sesiones.length === 0 && archivosRepositorio.length === 0 && (
            <div className="no-results">
              <p>No hay sesiones disponibles en este momento.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Sesiones;






















