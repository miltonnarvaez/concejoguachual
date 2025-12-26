import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import { getFileUrl } from '../utils/fileUtils';
import {
  FaGavel, FaClipboardList, FaFileContract, FaProjectDiagram, FaBook,
  FaBalanceScale, FaClipboardCheck, FaFileAlt, FaDownload
} from 'react-icons/fa';
import './Gaceta.css';

const Gaceta = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tipoFiltro = searchParams.get('tipo') || '';

  // Mapeo entre tipos de Gaceta y categorías del repositorio
  const mapeoRepositorio = {
    'acuerdo': 'documentos-acuerdos',
    'acta': 'documentos-actas-sesion',
    'decreto': 'documentos-decretos',
    'proyecto': 'documentos-proyectos',
    'manual': 'documentos-manuales',
    'plan': 'documentos-planes',
    'reglamento-interno': 'reglamento-interno',
    'ley': 'documentos-leyes',
    'politica': 'documentos-politicas',
    '': 'documentos-gaceta-municipal' // Todos -> Gaceta Municipal
  };

  // Obtener documentos de la base de datos
  const { data: documentos = [], isLoading: loadingBD } = useQuery({
    queryKey: ['gaceta', tipoFiltro],
    queryFn: async () => {
      const url = tipoFiltro ? `/gaceta?tipo=${tipoFiltro}` : '/gaceta';
      const response = await api.get(url);
      return response.data;
    }
  });

  // Obtener archivos del repositorio
  const categoriaRepositorio = mapeoRepositorio[tipoFiltro] || mapeoRepositorio[''];
  const { data: datosRepositorio, isLoading: loadingRepositorio } = useQuery({
    queryKey: ['repositorio-gaceta', categoriaRepositorio],
    queryFn: async () => {
      try {
        const response = await api.get(`/repositorio/listar/${categoriaRepositorio}`);
        return response.data;
      } catch (error) {
        console.error('Error cargando archivos del repositorio:', error);
        return { archivos: [], total: 0 };
      }
    },
    enabled: !!categoriaRepositorio
  });

  const isLoading = loadingBD || loadingRepositorio;
  
  // Combinar documentos de BD y repositorio
  const archivosRepositorio = datosRepositorio?.archivos || [];
  
  // Convertir archivos del repositorio al formato de documentos
  const documentosRepositorio = archivosRepositorio.map((archivo, index) => ({
    id: `repo-${archivo.nombre}-${index}`,
    tipo: tipoFiltro || 'documento',
    titulo: archivo.nombreOriginal || archivo.nombre,
    descripcion: archivo.nota || '',
    fecha: archivo.fechaSubida,
    archivo_url: `/api/repositorio/descargar/${categoriaRepositorio}/${encodeURIComponent(archivo.nombre)}`,
    esRepositorio: true,
    tamaño: archivo.tamañoMB
  }));

  // Combinar ambos arrays
  const todosLosDocumentos = [...documentos, ...documentosRepositorio];

  const tipos = [
    { value: 'acuerdo', label: 'ACUERDOS', icono: FaGavel },
    { value: 'acta', label: 'ACTAS DE SESIÓN', icono: FaClipboardList },
    { value: 'decreto', label: 'DECRETOS', icono: FaFileContract },
    { value: 'proyecto', label: 'PROYECTOS', icono: FaProjectDiagram },
    { value: 'manual', label: 'MANUALES', icono: FaBook },
    { value: 'plan', label: 'PLANES', icono: FaProjectDiagram },
    { value: 'reglamento-interno', label: 'REGLAMENTO INTERNO', icono: FaBook },
    { value: 'ley', label: 'LEYES', icono: FaBalanceScale },
    { value: 'politica', label: 'POLÍTICAS', icono: FaClipboardCheck }
  ];

  if (isLoading) {
    return <div className="loading">Cargando documentos...</div>;
  }

  return (
    <div className="gaceta-page">
      <section className="section">
        <div className="container">
          <h1 className="page-title">Gaceta</h1>

          <div className="gaceta-filters">
            <Link to="/gaceta" className={`filter-btn ${!tipoFiltro ? 'active' : ''}`}>
              Todos
            </Link>
            {tipos.map((tipo) => (
              <Link
                key={tipo.value}
                to={`/gaceta?tipo=${tipo.value}`}
                className={`filter-btn ${tipoFiltro === tipo.value ? 'active' : ''}`}
              >
                <span className="filter-icon">{React.createElement(tipo.icono)}</span>
                {tipo.label}
              </Link>
            ))}
          </div>

          {todosLosDocumentos.length === 0 ? (
            <div className="no-results">
              <p>No hay documentos disponibles en este momento.</p>
            </div>
          ) : (
            <>
              {/* Documentos de la Base de Datos */}
              {documentos.length > 0 && (
                <div className="documentos-seccion">
                  <h2 className="seccion-titulo">Documentos Registrados</h2>
                  <div className="documentos-grid">
                    {documentos.map((documento) => (
                      <div key={documento.id} className="documento-card">
                        <div className="documento-content">
                          <span className="documento-tipo">{documento.tipo.toUpperCase()}</span>
                          {documento.numero && (
                            <span className="documento-numero">N° {documento.numero}</span>
                          )}
                          <h2>{documento.titulo}</h2>
                          {documento.descripcion && <p>{documento.descripcion}</p>}
                          {documento.fecha && (
                            <p className="documento-fecha">
                              Fecha: {new Date(documento.fecha).toLocaleDateString('es-CO')}
                            </p>
                          )}
                          {(documento.actualizado_en || documento.fecha_actualizacion) && (
                            <p className="documento-actualizacion">
                              <strong>Última actualización:</strong>{' '}
                              {new Date(documento.actualizado_en || documento.fecha_actualizacion).toLocaleDateString('es-CO', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          )}
                          <div className="documento-actions">
                            {documento.archivo_url && (
                              <a
                                href={getFileUrl(documento.archivo_url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn"
                              >
                                Ver documento →
                              </a>
                            )}
                            <Link to={`/gaceta/${documento.id}`} className="btn btn-secondary">
                              Ver detalles →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Archivos del Repositorio */}
              {archivosRepositorio.length > 0 && (
                <div className="documentos-seccion documentos-repositorio-seccion">
                  <h2 className="seccion-titulo">
                    <FaFileAlt /> Archivos del Repositorio
                    <span className="seccion-count">({archivosRepositorio.length})</span>
                  </h2>
                  <div className="documentos-grid">
                    {documentosRepositorio.map((documento) => (
                      <div key={documento.id} className="documento-card documento-repositorio">
                        <div className="documento-content">
                          <span className="documento-badge-repositorio">
                            <FaFileAlt /> Repositorio
                          </span>
                          <h2>{documento.titulo}</h2>
                          {documento.descripcion && <p>{documento.descripcion}</p>}
                          {documento.fecha && (
                            <p className="documento-fecha">
                              Fecha: {new Date(documento.fecha).toLocaleDateString('es-CO')}
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
                                className="btn"
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
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Gaceta;

