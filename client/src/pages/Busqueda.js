import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { getFileUrl } from '../utils/fileUtils';
import { 
  FaSearch, 
  FaTimes,
  FaNewspaper,
  FaFileAlt,
  FaEye,
  FaCalendarAlt,
  FaComments,
  FaMicrophone,
  FaMicrophoneSlash
} from 'react-icons/fa';
import './Busqueda.css';

const Busqueda = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [tipo, setTipo] = useState(searchParams.get('tipo') || 'todos');
  const [categoria, setCategoria] = useState(searchParams.get('categoria') || 'todas');
  const [fechaDesde, setFechaDesde] = useState(searchParams.get('fecha_desde') || '');
  const [fechaHasta, setFechaHasta] = useState(searchParams.get('fecha_hasta') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);

  // Obtener sugerencias de autocompletado
  const { data: suggestions = [] } = useQuery({
    queryKey: ['suggestions', inputValue],
    queryFn: async () => {
      if (!inputValue || inputValue.trim().length < 2) {
        return [];
      }
      const response = await api.get(`/busqueda/suggestions?q=${encodeURIComponent(inputValue)}`);
      return response.data;
    },
    enabled: inputValue.trim().length >= 2 && showSuggestions
  });

  // Inicializar reconocimiento de voz
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'es-ES';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setSearchQuery(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Error en reconocimiento de voz:', event.error);
        setIsListening(false);
        if (event.error === 'no-speech') {
          alert('No se detectó voz. Por favor, intenta nuevamente.');
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  // Función para iniciar/detener reconocimiento de voz
  const toggleVoiceSearch = () => {
    if (!recognition) {
      alert('Tu navegador no soporta búsqueda por voz. Por favor, usa Chrome o Edge.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error iniciando reconocimiento:', error);
        setIsListening(false);
      }
    }
  };

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Actualizar URL cuando cambien los filtros
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery && searchQuery.trim()) params.set('q', searchQuery.trim());
    if (tipo !== 'todos') params.set('tipo', tipo);
    if (categoria !== 'todas') params.set('categoria', categoria);
    if (fechaDesde) params.set('fecha_desde', fechaDesde);
    if (fechaHasta) params.set('fecha_hasta', fechaHasta);
    setSearchParams(params, { replace: true });
  }, [searchQuery, tipo, categoria, fechaDesde, fechaHasta, setSearchParams]);

  // Debug: Log cuando cambia searchQuery
  useEffect(() => {
    console.log('searchQuery actualizado:', searchQuery);
  }, [searchQuery]);

  // Realizar búsqueda
  const { data: resultados, isLoading, error } = useQuery({
    queryKey: ['busqueda', searchQuery, tipo, categoria, fechaDesde, fechaHasta],
    queryFn: async () => {
      console.log('🔍 Iniciando queryFn con searchQuery:', searchQuery);
      if (!searchQuery || searchQuery.trim() === '') {
        return {
          noticias: [],
          transparencia: [],
          gaceta: [],
          sesiones: [],
          convocatorias: [],
          repositorio: [],
          total: 0
        };
      }

      const params = new URLSearchParams();
      params.append('q', searchQuery.trim());
      if (tipo !== 'todos') params.append('tipo', tipo);
      if (categoria !== 'todas') params.append('categoria', categoria);
      if (fechaDesde) params.append('fecha_desde', fechaDesde);
      if (fechaHasta) params.append('fecha_hasta', fechaHasta);

      try {
        const response = await api.get(`/busqueda?${params.toString()}`);
        console.log('Resultados de búsqueda completos:', JSON.stringify(response.data, null, 2));
        console.log('Repositorio resultados:', response.data.repositorio);
        console.log('Total resultados:', response.data.total);
        if (response.data.repositorio && response.data.repositorio.length > 0) {
          console.log('✅ Archivos del repositorio encontrados:', response.data.repositorio.map(r => r.titulo));
        } else {
          console.log('⚠️ No se encontraron archivos en el repositorio');
        }
        return response.data;
      } catch (error) {
        console.error('Error en búsqueda:', error);
        throw error;
      }
    },
    enabled: !!searchQuery && searchQuery.trim() !== '',
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 0 // Forzar que siempre busque datos frescos
  });

  // Debug: Log del estado de la query
  useEffect(() => {
    console.log('Estado de búsqueda:', {
      searchQuery,
      enabled: !!searchQuery && searchQuery.trim() !== '',
      isLoading,
      hasResults: !!resultados,
      error: error?.message
    });
  }, [searchQuery, isLoading, resultados, error]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    console.log('handleSearch llamado con:', trimmedValue);
    if (trimmedValue) {
      console.log('Actualizando searchQuery a:', trimmedValue);
      setSearchQuery(trimmedValue);
      setShowSuggestions(false);
      // La búsqueda se ejecuta automáticamente por el useQuery
    } else {
      console.log('Limpiando searchQuery');
      setSearchQuery('');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.trim().length >= 2);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.texto);
    setSearchQuery(suggestion.texto);
    setShowSuggestions(false);
    if (suggestion.tipo !== 'todos') {
      setTipo(suggestion.tipo);
    }
  };

  const getTipoIcon = (tipo) => {
    const icons = {
      noticia: FaNewspaper,
      transparencia: FaEye,
      gaceta: FaFileAlt,
      sesion: FaCalendarAlt,
      convocatoria: FaCalendarAlt,
      repositorio: FaFileAlt
    };
    return icons[tipo] || FaSearch;
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
      convocatoria: 'Convocatoria',
      repositorio: 'Repositorio'
    };
    return labels[tipo] || tipo;
  };

  const getTipoRoute = (tipo, id, archivo_url) => {
    const routes = {
      noticia: `/noticias/${id}`,
      transparencia: `/transparencia/${id}`,
      gaceta: `/gaceta/${id}`,
      sesion: `/sesiones/${id}`,
      convocatoria: `/convocatorias/${id}`,
      repositorio: archivo_url || '#'
    };
    return routes[tipo] || '#';
  };

  // Función para destacar el término buscado
  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : (
        part
      )
    );
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
            <div className="busqueda-input-group" style={{ position: 'relative' }}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar en todo el sitio..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch(e);
                  }
                }}
                onFocus={() => inputValue.trim().length >= 2 && setShowSuggestions(true)}
                className="busqueda-input"
              />
              <button
                type="button"
                onClick={toggleVoiceSearch}
                className={`busqueda-voice-btn ${isListening ? 'listening' : ''}`}
                title={isListening ? 'Detener grabación' : 'Búsqueda por voz'}
                disabled={!recognition}
              >
                {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
              </button>
              <button 
                type="submit" 
                className="busqueda-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleSearch(e);
                }}
              >
                <FaSearch /> Buscar
              </button>
              
              {/* Sugerencias de autocompletado */}
              {showSuggestions && suggestions && suggestions.length > 0 && (
                <div ref={suggestionsRef} className="busqueda-suggestions">
                  {suggestions.map((suggestion, index) => {
                    const Icon = getTipoIcon(suggestion.tipo);
                    return (
                      <button
                        key={index}
                        type="button"
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <Icon className="suggestion-icon" />
                        <span className="suggestion-text">{suggestion.texto}</span>
                        <span className="suggestion-type">{getTipoLabel(suggestion.tipo)}</span>
                      </button>
                    );
                  })}
                </div>
              )}
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
                    <option value="repositorio">Repositorio</option>
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
          ) : error ? (
            <div className="busqueda-error">
              <p>Error al realizar la búsqueda. Por favor, intenta nuevamente.</p>
              <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>{error.message}</p>
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
                  <div className="busqueda-query">
                    <p>Búsqueda: <strong>"{searchQuery}"</strong></p>
                    <div className="filtros-activos">
                      {tipo !== 'todos' && (
                        <span className="filtro-chip">
                          Tipo: {getTipoLabel(tipo)}
                          <button onClick={() => setTipo('todos')} aria-label="Remover filtro">
                            <FaTimes />
                          </button>
                        </span>
                      )}
                      {categoria !== 'todas' && (
                        <span className="filtro-chip">
                          Categoría: {categoria}
                          <button onClick={() => setCategoria('todas')} aria-label="Remover filtro">
                            <FaTimes />
                          </button>
                        </span>
                      )}
                      {fechaDesde && (
                        <span className="filtro-chip">
                          Desde: {fechaDesde}
                          <button onClick={() => setFechaDesde('')} aria-label="Remover filtro">
                            <FaTimes />
                          </button>
                        </span>
                      )}
                      {fechaHasta && (
                        <span className="filtro-chip">
                          Hasta: {fechaHasta}
                          <button onClick={() => setFechaHasta('')} aria-label="Remover filtro">
                            <FaTimes />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
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
                            <h4>{highlightText(item.titulo, searchQuery)}</h4>
                            <p>{highlightText((item.descripcion?.substring(0, 150)) + '...', searchQuery)}</p>
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
                            <h4>Sesión {item.numero_sesion} - {highlightText(item.tipo_sesion, searchQuery)}</h4>
                            <p>{highlightText((item.resumen?.substring(0, 150)) + '...', searchQuery)}</p>
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
                            <h4>{highlightText(item.titulo, searchQuery)}</h4>
                            <p>{highlightText((item.descripcion?.substring(0, 150)) + '...', searchQuery)}</p>
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

                  {resultados.repositorio && resultados.repositorio.length > 0 && (
                    <div className="resultados-seccion">
                      <h3>Repositorio ({resultados.repositorio.length})</h3>
                      <div className="resultados-grid">
                        {resultados.repositorio.map((item) => (
                          <a
                            key={item.id}
                            href={getFileUrl(item.archivo_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resultado-card"
                          >
                            <h4>{highlightText(item.titulo, searchQuery)}</h4>
                            <p>{highlightText((item.descripcion?.substring(0, 150)) + '...', searchQuery)}</p>
                            <div className="resultado-meta">
                              <span className="resultado-tipo">{getTipoLabel(item.tipo_resultado)}</span>
                              {item.categoria && (
                                <span className="resultado-categoria">{item.categoria}</span>
                              )}
                              {item.tamaño && (
                                <span className="resultado-tamaño">{item.tamaño} MB</span>
                              )}
                              <span className="resultado-fecha">
                                {formatDate(item.fecha_publicacion || item.creado_en)}
                              </span>
                            </div>
                          </a>
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



















