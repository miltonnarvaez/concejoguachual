import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { 
  FaFolder, 
  FaFileAlt, 
  FaDownload, 
  FaSpinner,
  FaInfoCircle,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaImage,
  FaFile
} from 'react-icons/fa';
import './Repositorio.css';

const Repositorio = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  // Obtener categorías
  const { data: categoriasData, isLoading: loadingCategorias } = useQuery({
    queryKey: ['repositorio-categorias-publico'],
    queryFn: async () => {
      const response = await api.get('/repositorio/listar');
      return response.data;
    }
  });

  // Obtener archivos de la categoría seleccionada
  const { data: datosArchivos, isLoading: loadingArchivos } = useQuery({
    queryKey: ['repositorio-archivos-publico', categoriaSeleccionada],
    queryFn: async () => {
      if (!categoriaSeleccionada) return null;
      const response = await api.get(`/repositorio/listar/${categoriaSeleccionada}`);
      return response.data;
    },
    enabled: !!categoriaSeleccionada
  });

  const obtenerIconoArchivo = (extension) => {
    switch (extension.toLowerCase()) {
      case '.pdf':
        return <FaFilePdf className="icono-pdf" />;
      case '.doc':
      case '.docx':
        return <FaFileWord className="icono-word" />;
      case '.xls':
      case '.xlsx':
        return <FaFileExcel className="icono-excel" />;
      case '.ppt':
      case '.pptx':
        return <FaFilePowerpoint className="icono-powerpoint" />;
      case '.jpg':
      case '.jpeg':
      case '.png':
      case '.gif':
      case '.webp':
        return <FaImage className="icono-imagen" />;
      default:
        return <FaFile className="icono-archivo" />;
    }
  };

  const formatearTamaño = (mb) => {
    if (!mb) return '0 MB';
    const num = parseFloat(mb);
    if (num < 1) {
      return `${(num * 1024).toFixed(0)} KB`;
    }
    return `${num.toFixed(2)} MB`;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    try {
      return new Date(fecha).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  const handleDescargar = (categoria, nombreArchivo) => {
    window.open(`/api/repositorio/descargar/${categoria}/${encodeURIComponent(nombreArchivo)}`, '_blank');
  };

  const categorias = categoriasData?.categorias || {};
  const archivos = datosArchivos?.archivos || [];

  return (
    <div className="repositorio-publico">
      <div className="repositorio-header">
        <h1>Repositorio de Documentos</h1>
        <p>Accede a todos los documentos organizados por categoría</p>
      </div>

      <div className="repositorio-container">
        {loadingCategorias ? (
          <div className="loading">
            <FaSpinner className="spinner" />
            <p>Cargando categorías...</p>
          </div>
        ) : (
          <>
            {/* Lista de categorías */}
            <div className="categorias-sidebar">
              <h2>
                <FaFolder /> Categorías
              </h2>
              <div className="categorias-list">
                <button
                  className={`categoria-item ${!categoriaSeleccionada ? 'active' : ''}`}
                  onClick={() => setCategoriaSeleccionada(null)}
                >
                  <FaFolder /> Todas las categorías
                  <span className="categoria-count">
                    {categoriasData?.totalArchivos || 0}
                  </span>
                </button>
                {Object.entries(categorias).map(([id, datos]) => (
                  <button
                    key={id}
                    className={`categoria-item ${categoriaSeleccionada === id ? 'active' : ''}`}
                    onClick={() => setCategoriaSeleccionada(id)}
                  >
                    <FaFolder /> {datos.nombre}
                    <span className="categoria-count">{datos.total}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Archivos de la categoría seleccionada */}
            <div className="archivos-content">
              {!categoriaSeleccionada ? (
                <div className="seleccionar-categoria">
                  <FaInfoCircle />
                  <h2>Selecciona una categoría</h2>
                  <p>Elige una categoría del menú lateral para ver los archivos disponibles</p>
                </div>
              ) : loadingArchivos ? (
                <div className="loading">
                  <FaSpinner className="spinner" />
                  <p>Cargando archivos...</p>
                </div>
              ) : archivos.length === 0 ? (
                <div className="sin-archivos">
                  <FaInfoCircle />
                  <h2>No hay archivos en esta categoría</h2>
                  <p>Esta categoría aún no contiene archivos</p>
                </div>
              ) : (
                <>
                  <div className="categoria-header">
                    <h2>{datosArchivos.nombreCategoria}</h2>
                    <p>{datosArchivos.total} archivo(s)</p>
                  </div>
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
                              {formatearTamaño(archivo.tamañoMB)} • {formatearFecha(archivo.fechaSubida)}
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
                            onClick={() => handleDescargar(categoriaSeleccionada, archivo.nombre)}
                            title="Descargar archivo"
                          >
                            <FaDownload /> Descargar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Repositorio;

