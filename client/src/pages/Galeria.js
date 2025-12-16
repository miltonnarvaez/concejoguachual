import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getFileUrl } from '../utils/fileUtils';
import { FaImages, FaClipboardList, FaCalendarAlt, FaUserFriends, FaBuilding, FaStar, FaChevronLeft, FaChevronRight, FaTimes, FaExpand } from 'react-icons/fa';
import './Galeria.css';

const Galeria = () => {
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroTipo, setFiltroTipo] = useState('todas');
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [indiceImagenActual, setIndiceImagenActual] = useState(0);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['galeria', filtroCategoria, filtroTipo],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filtroCategoria !== 'todas') params.append('categoria', filtroCategoria);
      if (filtroTipo !== 'todas') params.append('tipo', filtroTipo);
      
      const url = `/galeria${params.toString() ? '?' + params.toString() : ''}`;
      const response = await api.get(url);
      return response.data;
    }
  });

  const categorias = [
    { id: 'todas', nombre: 'Todas', icono: FaImages },
    { id: 'sesiones', nombre: 'Sesiones', icono: FaClipboardList },
    { id: 'eventos', nombre: 'Eventos', icono: FaCalendarAlt },
    { id: 'autoridades', nombre: 'Autoridades', icono: FaUserFriends },
    { id: 'actividades', nombre: 'Actividades', icono: FaBuilding },
    { id: 'otros', nombre: 'Otros', icono: FaImages }
  ];

  const tipos = [
    { id: 'todas', nombre: 'Todos' },
    { id: 'foto', nombre: 'Fotografías' },
    { id: 'video', nombre: 'Videos' }
  ];

  // Filtrar solo imágenes para el lightbox
  const imagenesFiltradas = items.filter(item => item.tipo === 'foto');

  const abrirLightbox = (item, index) => {
    if (item.tipo === 'foto') {
      const indiceEnFiltradas = imagenesFiltradas.findIndex(img => img.id === item.id);
      setIndiceImagenActual(indiceEnFiltradas >= 0 ? indiceEnFiltradas : 0);
      setImagenSeleccionada(item);
    }
  };

  const cerrarLightbox = () => {
    setImagenSeleccionada(null);
  };

  const navegarImagen = (direccion) => {
    if (imagenesFiltradas.length === 0) return;
    const nuevoIndice = direccion === 'next'
      ? (indiceImagenActual + 1) % imagenesFiltradas.length
      : (indiceImagenActual - 1 + imagenesFiltradas.length) % imagenesFiltradas.length;
    setIndiceImagenActual(nuevoIndice);
    setImagenSeleccionada(imagenesFiltradas[nuevoIndice]);
  };

  // Navegación con teclado
  useEffect(() => {
    if (!imagenSeleccionada) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        navegarImagen('next');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navegarImagen('prev');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cerrarLightbox();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagenSeleccionada, indiceImagenActual]);

  if (isLoading) {
    return <div className="loading">Cargando galería...</div>;
  }

  return (
    <div className="galeria-page">
      <section className="section">
        <div className="container">
          <div className="galeria-header">
            <h1 className="page-title">Galería Multimedia</h1>
            <p className="galeria-intro">
              Explora nuestra colección de fotografías y videos de las actividades, sesiones y eventos del Concejo Municipal de Guachucal.
            </p>
          </div>

          {/* Filtros */}
          <div className="galeria-filtros">
            <div className="filtro-group">
              <label>Categoría:</label>
              <div className="filtro-buttons">
                {categorias.map(cat => (
                  <button
                    key={cat.id}
                    className={`filtro-btn ${filtroCategoria === cat.id ? 'active' : ''}`}
                    onClick={() => setFiltroCategoria(cat.id)}
                  >
                    <span className="filtro-icon">{React.createElement(cat.icono)}</span> {cat.nombre}
                  </button>
                ))}
              </div>
            </div>

            <div className="filtro-group">
              <label>Tipo:</label>
              <div className="filtro-buttons">
                {tipos.map(tipo => (
                  <button
                    key={tipo.id}
                    className={`filtro-btn ${filtroTipo === tipo.id ? 'active' : ''}`}
                    onClick={() => setFiltroTipo(tipo.id)}
                  >
                    {tipo.nombre}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid de items */}
          {items.length === 0 ? (
            <div className="no-results">
              <p>No hay elementos disponibles en la galería con los filtros seleccionados.</p>
            </div>
          ) : (
            <div className="galeria-grid">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`galeria-item ${item.tipo}`}
                  onClick={() => item.tipo === 'foto' && abrirLightbox(item, index)}
                >
                  {item.destacada && (
                    <span className="destacada-badge">⭐ Destacada</span>
                  )}
                  
                  {item.tipo === 'foto' ? (
                    <div className="galeria-image-wrapper">
                      <img
                        src={getFileUrl(item.thumbnail_url || item.archivo_url)}
                        alt={item.titulo}
                        className="galeria-image"
                      />
                      <div className="galeria-overlay">
                        <h3>{item.titulo}</h3>
                        {item.descripcion && (
                          <p>{item.descripcion.substring(0, 100)}...</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="galeria-video-wrapper">
                      <video
                        src={getFileUrl(item.archivo_url)}
                        className="galeria-video"
                        controls
                        preload="metadata"
                        poster={item.thumbnail_url ? getFileUrl(item.thumbnail_url) : undefined}
                      >
                        Tu navegador no soporta el elemento de video.
                      </video>
                      <div className="galeria-video-info">
                        <h3>{item.titulo}</h3>
                        {item.descripcion && (
                          <p>{item.descripcion.substring(0, 100)}...</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="galeria-item-footer">
                    <span className="galeria-categoria">{item.categoria}</span>
                    {item.fecha_evento && (
                      <span className="galeria-fecha">
                        {new Date(item.fecha_evento).toLocaleDateString('es-CO')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox mejorado para imágenes */}
      {imagenSeleccionada && (
        <div className="lightbox" onClick={cerrarLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={cerrarLightbox} aria-label="Cerrar">
              <FaTimes />
            </button>
            {imagenesFiltradas.length > 1 && (
              <>
                <button 
                  className="lightbox-nav lightbox-prev" 
                  onClick={() => navegarImagen('prev')}
                  aria-label="Imagen anterior"
                >
                  <FaChevronLeft />
                </button>
                <button 
                  className="lightbox-nav lightbox-next" 
                  onClick={() => navegarImagen('next')}
                  aria-label="Siguiente imagen"
                >
                  <FaChevronRight />
                </button>
              </>
            )}
            <div className="lightbox-image-container">
              <img
                src={getFileUrl(imagenSeleccionada.archivo_url)}
                alt={imagenSeleccionada.titulo}
                className="lightbox-image"
              />
            </div>
            <div className="lightbox-info">
              <h2>{imagenSeleccionada.titulo}</h2>
              {imagenSeleccionada.descripcion && (
                <p>{imagenSeleccionada.descripcion}</p>
              )}
              {imagenSeleccionada.fecha_evento && (
                <p className="lightbox-fecha">
                  <FaCalendarAlt /> {new Date(imagenSeleccionada.fecha_evento).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
              {imagenSeleccionada.categoria && (
                <p className="lightbox-categoria">
                  Categoría: {imagenSeleccionada.categoria}
                </p>
              )}
            </div>
            {imagenesFiltradas.length > 1 && (
              <div className="lightbox-counter">
                {indiceImagenActual + 1} / {imagenesFiltradas.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Galeria;













