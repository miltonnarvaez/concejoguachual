import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { getFileUrl } from '../utils/fileUtils';
import '../styles/PageLayout.css';
import './Transparencia.css';

const Transparencia = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaParam = searchParams.get('categoria');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categoriaParam || 'todas');

  // Actualizar categoría cuando cambia el parámetro de la URL
  useEffect(() => {
    if (categoriaParam) {
      setCategoriaSeleccionada(categoriaParam);
    }
  }, [categoriaParam]);
  
  const { data: documentos = [], isLoading } = useQuery({
    queryKey: ['transparencia'],
    queryFn: async () => {
      const response = await api.get('/transparencia');
      return response.data;
    }
  });

  if (isLoading) {
    return <div className="loading">Cargando documentos...</div>;
  }

  // Categorías según Ley 1712 de 2014 e ITA
  const categorias = [
    { id: 'todas', nombre: 'Todas las Categorías', icono: '📋' },
    { id: 'presupuesto', nombre: 'Presupuesto', icono: '💰', descripcion: 'Presupuesto general, ejecución presupuestal y modificaciones' },
    { id: 'contratacion', nombre: 'Contratación Pública', icono: '📋', descripcion: 'Procesos de contratación, licitaciones y adjudicaciones' },
    { id: 'plan_compras', nombre: 'Plan Anual de Compras', icono: '📊', descripcion: 'Plan anual de adquisiciones y compras' },
    { id: 'rendicion_cuentas', nombre: 'Rendición de Cuentas', icono: '📈', descripcion: 'Informes de gestión y rendición de cuentas' },
    { id: 'estados_financieros', nombre: 'Estados Financieros', icono: '💵', descripcion: 'Estados financieros, balances y reportes contables' },
    { id: 'control_interno', nombre: 'Control Interno', icono: '🔍', descripcion: 'Informes de control interno y auditorías' },
    { id: 'declaracion_renta', nombre: 'Declaración de Renta', icono: '📑', descripcion: 'Declaraciones de renta y bienes' },
    { id: 'estructura_organizacional', nombre: 'Estructura Organizacional', icono: '🏢', descripcion: 'Organigrama, manual de funciones y estructura' },
    { id: 'plan_desarrollo', nombre: 'Plan de Desarrollo', icono: '📐', descripcion: 'Plan de desarrollo municipal y seguimiento' },
    { id: 'normatividad', nombre: 'Normatividad', icono: '⚖️', descripcion: 'Normas, reglamentos y disposiciones aplicables' },
    { id: 'servicios_ciudadanos', nombre: 'Servicios Ciudadanos', icono: '👥', descripcion: 'Información sobre servicios y trámites' },
    { id: 'auditorias', nombre: 'Auditorías', icono: '🔎', descripcion: 'Informes de auditoría externa e interna' },
    { id: 'bienes_inmuebles', nombre: 'Bienes Inmuebles', icono: '🏛️', descripcion: 'Inventario de bienes inmuebles y patrimonio' },
    { id: 'personal', nombre: 'Personal', icono: '👤', descripcion: 'Planta de personal, nómina y convocatorias de empleo' }
  ];

  const documentosFiltrados = categoriaSeleccionada === 'todas' 
    ? documentos 
    : documentos.filter(doc => doc.categoria === categoriaSeleccionada);

  const documentosPorCategoria = categorias.reduce((acc, cat) => {
    if (cat.id !== 'todas') {
      acc[cat.id] = documentos.filter(doc => doc.categoria === cat.id);
    }
    return acc;
  }, {});

  return (
    <div className="transparencia-page page-container">
      <section className="section">
        <div className="container">
          <div className="transparencia-header page-header">
            <div className="page-header-icon">🔍</div>
            <div>
              <h1 className="page-title">Transparencia y Acceso a la Información Pública</h1>
              <p className="transparencia-intro">
                En cumplimiento de la <strong>Ley 1712 de 2014</strong> (Ley de Transparencia y del Derecho de Acceso a la Información Pública Nacional) 
                y el <strong>Índice de Transparencia y Acceso a la Información (ITA)</strong>, el Concejo Municipal de Guachucal pone a disposición 
                de la ciudadanía la siguiente información pública.
              </p>
              <div className="datos-abiertos-link">
                <a href="/datos-abiertos" className="btn btn-datos-abiertos">
                  📊 Ver Datos Abiertos (CSV, JSON, XML)
                </a>
              </div>
            </div>
          </div>

          {/* Filtro de categorías */}
          <div className="categorias-filtro">
            <h2>Seleccione una categoría:</h2>
            <div className="categorias-grid">
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  className={`categoria-btn ${categoriaSeleccionada === categoria.id ? 'active' : ''}`}
                  onClick={() => {
                    setCategoriaSeleccionada(categoria.id);
                    // Actualizar URL sin recargar la página
                    const newSearchParams = new URLSearchParams(searchParams);
                    if (categoria.id === 'todas') {
                      newSearchParams.delete('categoria');
                    } else {
                      newSearchParams.set('categoria', categoria.id);
                    }
                    setSearchParams(newSearchParams);
                  }}
                >
                  <span className="categoria-icon">{categoria.icono}</span>
                  <span className="categoria-nombre">{categoria.nombre}</span>
                  {categoria.descripcion && (
                    <span className="categoria-desc">{categoria.descripcion}</span>
                  )}
                  {documentosPorCategoria[categoria.id] && (
                    <span className="categoria-count">
                      {documentosPorCategoria[categoria.id].length} documento(s)
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Documentos filtrados */}
          {documentosFiltrados.length === 0 ? (
            <div className="no-results">
              <p>
                {categoriaSeleccionada === 'todas' 
                  ? 'No hay documentos disponibles en este momento.'
                  : `No hay documentos disponibles en la categoría "${categorias.find(c => c.id === categoriaSeleccionada)?.nombre}".`
                }
              </p>
              <p className="no-results-note">
                <strong>Nota:</strong> Esta información se actualiza periódicamente según la normativa vigente.
              </p>
            </div>
          ) : (
            <div className="transparencia-content">
              <div className="documentos-header">
                <h2>
                  {categoriaSeleccionada === 'todas' 
                    ? 'Todos los Documentos'
                    : categorias.find(c => c.id === categoriaSeleccionada)?.nombre
                  }
                </h2>
                <p className="documentos-count">
                  {documentosFiltrados.length} documento(s) encontrado(s)
                </p>
              </div>

              <div className="documentos-grid">
                {documentosFiltrados.map((documento) => (
                  <div key={documento.id} className="documento-card">
                    <div className="documento-header">
                      <span className="documento-categoria">{documento.categoria}</span>
                      {documento.fecha && (
                        <span className="documento-fecha">
                          {new Date(documento.fecha).toLocaleDateString('es-CO', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                    <div className="documento-content">
                      <h3>{documento.titulo}</h3>
                      {documento.descripcion && <p>{documento.descripcion}</p>}
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
                      {documento.archivo_url && (
                        <a
                          href={getFileUrl(documento.archivo_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-documento"
                        >
                          <span>📄</span> Ver documento →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información adicional sobre transparencia */}
          <div className="transparencia-info">
            <h2>Información Adicional</h2>
            <div className="info-grid">
              <div className="info-card">
                <h3>📋 Solicitud de Información</h3>
                <p>
                  Si necesita información que no se encuentra publicada, puede presentar una solicitud 
                  a través del <a href="/pqrsd">sistema de PQRSD</a>.
                </p>
              </div>
              <div className="info-card">
                <h3>⏱️ Plazos de Respuesta</h3>
                <p>
                  De acuerdo con la Ley 1712 de 2014, las solicitudes de información pública serán 
                  respondidas en un plazo máximo de <strong>15 días hábiles</strong>.
                </p>
              </div>
              <div className="info-card">
                <h3>📞 Contacto</h3>
                <p>
                  <strong>Correo:</strong> contacto@concejo.guachucal.gov.co<br />
                  <strong>Teléfono:</strong> +57 (2) XXX-XXXX<br />
                  <strong>Horario:</strong> Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Transparencia;
