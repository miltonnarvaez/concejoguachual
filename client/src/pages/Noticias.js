import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import NoticiaImage from '../components/NoticiaImage';
import { getImageByIndex } from '../utils/exampleImages';
import { FaNewspaper } from 'react-icons/fa';
import Breadcrumbs from '../components/Breadcrumbs';
import '../styles/PageLayout.css';
import './Noticias.css';

const Noticias = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaParam = searchParams.get('categoria');

  const { data: noticias = [], isLoading } = useQuery({
    queryKey: ['noticias'],
    queryFn: async () => {
      const response = await api.get('/noticias');
      return response.data;
    }
  });

  // Filtrar noticias por búsqueda y categoría
  const filteredNoticias = noticias.filter(noticia => {
    const matchSearch = noticia.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      noticia.contenido.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchCategoria = !categoriaParam || noticia.categoria === categoriaParam;
    
    return matchSearch && matchCategoria;
  });

  if (isLoading) {
    return <div className="loading">Cargando noticias...</div>;
  }

  return (
    <div className="noticias-page page-container">
      <Breadcrumbs />
      <section className="section">
        <div className="container">
          <div className="page-header">
            <div className="page-header-icon"><FaNewspaper /></div>
            <div>
              <h1 className="page-title">Noticias</h1>
              <p>Mantente informado sobre las últimas noticias del Concejo Municipal</p>
            </div>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar noticias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {filteredNoticias.length === 0 ? (
            <div className="no-results">
              <p>No se encontraron noticias.</p>
            </div>
          ) : (
            <div className="noticias-grid">
              {filteredNoticias.map((noticia, index) => (
                <article key={noticia.id} className="noticia-card">
                  <NoticiaImage 
                    src={noticia.imagen_url || getImageByIndex(index, 'gobierno')} 
                    alt={noticia.titulo}
                    className="noticia-card-image"
                  />
                  <div className="noticia-content">
                    <div className="noticia-fechas">
                      <span className="noticia-fecha">
                        {new Date(noticia.fecha_publicacion || noticia.creado_en).toLocaleDateString('es-CO')}
                      </span>
                      {(noticia.actualizado_en || noticia.fecha_actualizacion) && 
                       new Date(noticia.actualizado_en || noticia.fecha_actualizacion).getTime() !== 
                       new Date(noticia.fecha_publicacion || noticia.creado_en).getTime() && (
                        <span className="noticia-actualizacion">
                          Actualizado: {new Date(noticia.actualizado_en || noticia.fecha_actualizacion).toLocaleDateString('es-CO')}
                        </span>
                      )}
                    </div>
                    <h2>{noticia.titulo}</h2>
                    <p>{noticia.resumen || noticia.contenido.substring(0, 200)}...</p>
                    <Link to={`/noticias/${noticia.id}`} className="btn">
                      Leer más →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Noticias;


