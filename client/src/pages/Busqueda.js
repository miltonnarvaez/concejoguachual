import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import './Busqueda.css';

const Busqueda = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [tipo, setTipo] = useState(searchParams.get('tipo') || 'todos');
  const [categoria, setCategoria] = useState(searchParams.get('categoria') || 'todas');
  const [fechaDesde, setFechaDesde] = useState(searchParams.get('fecha_desde') || '');
  const [fechaHasta, setFechaHasta] = useState(searchParams.get('fecha_hasta') || '');
  const [showFilters, setShowFilters] = useState(false);

  // Actualizar URL cuando cambien los filtros
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (tipo !== 'todos') params.set('tipo', tipo);
    if (categoria !== 'todas') params.set('categoria', categoria);
    if (fechaDesde) params.set('fecha_desde', fechaDesde);
    if (fechaHasta) params.set('fecha_hasta', fechaHasta);
    setSearchParams(params, { replace: true });
  }, [searchQuery, tipo, categoria, fechaDesde, fechaHasta, setSearchParams]);

  // Realizar búsqueda
  const { data: resultados, isLoading } = useQuery({
    queryKey: ['busqueda', searchQuery, tipo, categoria, fechaDesde, fechaHasta],
    queryFn: async () => {
      if (!searchQuery || searchQuery.trim() === '') {
        return {
          noticias: [],
          transparencia: [],
          gaceta: [],
          sesiones: [],
          convocatorias: [],
          total: 0
        };
      }

      const params = new URLSearchParams();
      params.append('q', searchQuery);
      if (tipo !== 'todos') params.append('tipo', tipo);
      if (categoria !== 'todas') params.append('categoria', categoria);
      if (fechaDesde) params.append('fecha_desde', fechaDesde);
      if (fechaHasta) params.append('fecha_hasta', fechaHasta);

      const response = await api.get(`/busqueda?${params.toString()}`);
      return response.data;
    },
    enabled: !!searchQuery && searchQuery.trim() !== ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // La búsqueda se ejecuta automáticamente por el useQuery
  };

  const clearFilters = () => {
    setSearchQuery('');
    setTipo('todos');
    setCategoria('todas');
    setFechaDesde('');
    setFechaHasta('');
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      noticia: 'Noticia',
      transparencia: 'Transparencia',
      gaceta: 'Gaceta',
      sesion: 'Sesión',
      convocatoria: 'Convocatoria'
    };
    return labels[tipo] || tipo;
  };

  const getTipoRoute = (tipo, id) => {
    const routes = {
      noticia: `/noticias/${id}`,
      transparencia: `/transparencia/${id}`,
      gaceta: `/gaceta/${id}`,
      sesion: `/sesiones/${id}`,
      convocatoria: `/convocatorias/${id}`
    };
    return routes[tipo] || '#';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const allResults = resultados ? [
    ...resultados.noticias,
    ...resultados.transparencia,
    ...resultados.gaceta,
    ...resultados.sesiones,
    ...resultados.convocatorias
  ] : [];

  return (
    <div className="busqueda-page">
      <section className="section">
        <div className="container">
          <h1 className="page-title">Búsqueda Avanzada</h1>

          {/* Barra de búsqueda */}
          <form onSubmit={handleSearch} className="busqueda-form">
            <div className="busqueda-input-group">
              <input
                type="text"
                placeholder="Buscar en todo el sitio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="busqueda-input"
              />
              <button type="submit" className="busqueda-btn">
                🔍 Buscar
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="busqueda-filters-toggle"
            >
              {showFilters ? '▲' : '▼'} Filtros Avanzados
            </button>

            {showFilters && (
              <div className="busqueda-filters">
                <div className="filter-group">
                  <label>Tipo de Contenido</label>
                  <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option value="todos">Todos</option>
                    <option value="noticias">Noticias</option>
                    <option value="transparencia">Transparencia</option>
                    <option value="gaceta">Gaceta</option>
                    <option value="sesiones">Sesiones</option>
                    <option value="convocatorias">Convocatorias</option>
                  </select>
                </div>

                {tipo === 'transparencia' && (
                  <div className="filter-group">
                    <label>Categoría</label>
                    <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                      <option value="todas">Todas</option>
                      <option value="Presupuesto">Presupuesto</option>
                      <option value="Contratación">Contratación</option>
                      <option value="Rendición de Cuentas">Rendición de Cuentas</option>
                      <option value="Estados Financieros">Estados Financieros</option>
                      <option value="Control Interno">Control Interno</option>
                    </select>
                  </div>
                )}

                <div className="filter-group">
                  <label>Fecha Desde</label>
                  <input
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <label>Fecha Hasta</label>
                  <input
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="clear-filters-btn"
                >
                  Limpiar Filtros
                </button>
              </div>
            )}
          </form>

          {/* Resultados */}
          {isLoading ? (
            <div className="busqueda-loading">
              <p>Buscando...</p>
            </div>
          ) : searchQuery && resultados ? (
            <>
              <div className="busqueda-results-header">
                <h2>
                  {resultados.total === 0 
                    ? 'No se encontraron resultados' 
                    : `${resultados.total} resultado${resultados.total !== 1 ? 's' : ''} encontrado${resultados.total !== 1 ? 's' : ''}`}
                </h2>
                {resultados.total > 0 && (
                  <p className="busqueda-query">
                    Búsqueda: <strong>"{searchQuery}"</strong>
                  </p>
                )}
              </div>

              {resultados.total > 0 ? (
                <div className="busqueda-results">
                  {/* Resultados agrupados por tipo */}
                  {resultados.noticias.length > 0 && (
                    <div className="resultados-seccion">
                      <h3>Noticias ({resultados.noticias.length})</h3>
                      <div className="resultados-grid">
                        {resultados.noticias.map((item) => (
                          <Link
                            key={item.id}
                            to={getTipoRoute(item.tipo_resultado, item.id)}
                            className="resultado-card"
                          >
                            <h4>{item.titulo}</h4>
                            <p>{item.resumen || item.contenido?.substring(0, 150)}...</p>
                            <div className="resultado-meta">
                              <span className="resultado-tipo">{getTipoLabel(item.tipo_resultado)}</span>
                              <span className="resultado-fecha">
                                {formatDate(item.fecha_publicacion || item.creado_en)}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {resultados.transparencia.length > 0 && (
                    <div className="resultados-seccion">
                      <h3>Transparencia ({resultados.transparencia.length})</h3>
                      <div className="resultados-grid">
                        {resultados.transparencia.map((item) => (
                          <Link
                            key={item.id}
                            to={getTipoRoute(item.tipo_resultado, item.id)}
                            className="resultado-card"
                          >
                            <h4>{item.titulo}</h4>
                            <p>{item.descripcion?.substring(0, 150)}...</p>
                            <div className="resultado-meta">
                              <span className="resultado-tipo">{getTipoLabel(item.tipo_resultado)}</span>
                              <span className="resultado-categoria">{item.categoria}</span>
                              <span className="resultado-fecha">
                                {formatDate(item.fecha_publicacion || item.creado_en)}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {resultados.gaceta.length > 0 && (
                    <div className="resultados-seccion">
                      <h3>Gaceta Municipal ({resultados.gaceta.length})</h3>
                      <div className="resultados-grid">
                        {resultados.gaceta.map((item) => (
                          <Link
                            key={item.id}
                            to={getTipoRoute(item.tipo_resultado, item.id)}
                            className="resultado-card"
                          >
                            <h4>{item.numero ? `${item.numero} - ${item.titulo}` : item.titulo}</h4>
                            <p>{item.descripcion?.substring(0, 150)}...</p>
                            <div className="resultado-meta">
                              <span className="resultado-tipo">{getTipoLabel(item.tipo_resultado)}</span>
                              <span className="resultado-categoria">{item.tipo}</span>
                              <span className="resultado-fecha">
                                {formatDate(item.fecha_publicacion || item.creado_en)}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {resultados.sesiones.length > 0 && (
                    <div className="resultados-seccion">
                      <h3>Sesiones ({resultados.sesiones.length})</h3>
                      <div className="resultados-grid">
                        {resultados.sesiones.map((item) => (
                          <Link
                            key={item.id}
                            to={getTipoRoute(item.tipo_resultado, item.id)}
                            className="resultado-card"
                          >
                            <h4>Sesión {item.numero_sesion} - {item.tipo_sesion}</h4>
                            <p>{item.resumen?.substring(0, 150)}...</p>
                            <div className="resultado-meta">
                              <span className="resultado-tipo">{getTipoLabel(item.tipo_resultado)}</span>
                              <span className="resultado-fecha">
                                {formatDate(item.fecha_sesion || item.creado_en)}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {resultados.convocatorias.length > 0 && (
                    <div className="resultados-seccion">
                      <h3>Convocatorias ({resultados.convocatorias.length})</h3>
                      <div className="resultados-grid">
                        {resultados.convocatorias.map((item) => (
                          <Link
                            key={item.id}
                            to={getTipoRoute(item.tipo_resultado, item.id)}
                            className="resultado-card"
                          >
                            <h4>{item.titulo}</h4>
                            <p>{item.descripcion?.substring(0, 150)}...</p>
                            <div className="resultado-meta">
                              <span className="resultado-tipo">{getTipoLabel(item.tipo_resultado)}</span>
                              <span className="resultado-fecha">
                                {formatDate(item.fecha_inicio || item.creado_en)}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="busqueda-no-results">
                  <p>No se encontraron resultados para su búsqueda.</p>
                  <p>Intente con otros términos o ajuste los filtros.</p>
                </div>
              )}
            </>
          ) : (
            <div className="busqueda-inicial">
              <p>Ingrese un término de búsqueda para comenzar.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Busqueda;





