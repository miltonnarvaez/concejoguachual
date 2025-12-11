import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getFileUrl } from '../utils/fileUtils';
import './Galeria.css';

const Galeria = () => {
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroTipo, setFiltroTipo] = useState('todas');
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

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
    { id: 'todas', nombre: 'Todas', icono: '📸' },
    { id: 'sesiones', nombre: 'Sesiones', icono: '📋' },
    { id: 'eventos', nombre: 'Eventos', icono: '🎉' },
    { id: 'autoridades', nombre: 'Autoridades', icono: '👥' },
    { id: 'actividades', nombre: 'Actividades', icono: '🏛️' },
    { id: 'otros', nombre: 'Otros', icono: '📸' }
  ];

  const tipos = [
    { id: 'todas', nombre: 'Todos' },
    { id: 'foto', nombre: 'Fotografías' },
    { id: 'video', nombre: 'Videos' }
  ];

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
                    <span>{cat.icono}</span> {cat.nombre}
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
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`galeria-item ${item.tipo}`}
                  onClick={() => item.tipo === 'foto' && setImagenSeleccionada(item)}
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

      {/* Lightbox para imágenes */}
      {imagenSeleccionada && (
        <div className="lightbox" onClick={() => setImagenSeleccionada(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setImagenSeleccionada(null)}>
              ×
            </button>
            <img
              src={getFileUrl(imagenSeleccionada.archivo_url)}
              alt={imagenSeleccionada.titulo}
              className="lightbox-image"
            />
            <div className="lightbox-info">
              <h2>{imagenSeleccionada.titulo}</h2>
              {imagenSeleccionada.descripcion && (
                <p>{imagenSeleccionada.descripcion}</p>
              )}
              {imagenSeleccionada.fecha_evento && (
                <p className="lightbox-fecha">
                  Fecha del evento: {new Date(imagenSeleccionada.fecha_evento).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Galeria;






