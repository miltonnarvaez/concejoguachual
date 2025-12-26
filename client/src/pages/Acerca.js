import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Escudo from '../components/Escudo';
import Bandera from '../components/Bandera';
import Timeline from '../components/Timeline';
import api from '../services/api';
import { getFileUrl } from '../utils/fileUtils';
import { OrganizationSchema } from '../components/SchemaMarkup';
import {
  FaBullseye, FaEye, FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope,
  FaClock, FaFileAlt, FaDownload, FaSitemap, FaGavel, FaUserTie,
  FaUserSecret, FaUsers, FaClipboardList, FaTasks, FaUserCog
} from 'react-icons/fa';
import './Acerca.css';

const Acerca = () => {
  const { t } = useLanguage();
  const location = useLocation();

  // Scroll a la sección cuando hay un hash en la URL
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.hash]);

  const { data: autoridades = [] } = useQuery({
    queryKey: ['autoridades'],
    queryFn: async () => {
      const response = await api.get('/autoridades');
      return response.data;
    }
  });

  const { data: configuracion = {} } = useQuery({
    queryKey: ['configuracion'],
    queryFn: async () => {
      const response = await api.get('/configuracion');
      return response.data;
    }
  });

  const { data: historia = [] } = useQuery({
    queryKey: ['historia'],
    queryFn: async () => {
      const response = await api.get('/historia');
      return response.data;
    }
  });

  return (
    <div className="acerca">
      <OrganizationSchema 
        name="Concejo Municipal de Guachucal"
        url={window.location.origin}
        email={configuracion.email}
        telephone={configuracion.telefono}
        address={{
          addressLocality: "Guachucal",
          addressRegion: "Nariño",
          addressCountry: "CO",
          streetAddress: configuracion.direccion || "Calle Principal, Guachucal, Nariño"
        }}
      />
      <OrganizationSchema 
        name="Concejo Municipal de Guachucal"
        url={window.location.origin}
        email={configuracion.email}
        telephone={configuracion.telefono}
        address={{
          addressLocality: "Guachucal",
          addressRegion: "Nariño",
          addressCountry: "CO",
          streetAddress: configuracion.direccion || "Calle Principal, Guachucal, Nariño"
        }}
      />
      <section className="section">
        <div className="container">
          <div className="acerca-header">
            <Escudo />
            <div>
              <h1>Concejo Municipal de Guachucal</h1>
              <p>Nariño, Colombia</p>
            </div>
          </div>

          <div className="acerca-content">
            <div id="mision" className="acerca-section mision-section">
              <div className="section-icon">
                <FaBullseye />
              </div>
              <h2>Misión</h2>
              <div className="section-content-with-image">
                <div className="section-text">
                  <p>
                    El Concejo Municipal de Guachucal es una Corporación Administrativa Pública de elección popular y de carácter deliberante, 
                    encargada de ejercer el control político, facilitar y consolidar la democracia local, decidir lo conveniente para el buen vivir, 
                    el desarrollo humano sostenible y el crecimiento de municipio, fortaleciendo la participación comunitaria y con ello velar por 
                    el buen uso de los recursos y bienes, como patrimonio que nos pertenece a todos los habitantes del municipio de Guachucal.
                  </p>
                </div>
                <div className="section-image-placeholder">
                  <div className="image-placeholder">
                    <span className="placeholder-icon"><FaBuilding /></span>
                    <p>Gobierno Local</p>
                  </div>
                </div>
              </div>
            </div>

            <div id="vision" className="acerca-section vision-section">
              <div className="section-icon">
                <FaEye />
              </div>
              <h2>Visión</h2>
              <div className="section-content-with-image">
                <div className="section-image-placeholder">
                  <div className="image-placeholder">
                    <span className="placeholder-icon"><FaEye /></span>
                    <p>Futuro Promisorio</p>
                  </div>
                </div>
                <div className="section-text">
                  <p>
                    Como corporación político-administrativa del municipio de Guachucal proyecta consolidarse como el órgano colegiado representante 
                    de la voluntad popular, que busca en forma permanente desarrollar una administración regida bajo claros principios éticos, que 
                    permitan orientar su gestión en beneficio de las comunidades, permitiéndole ser voceros e intérpretes de los diferentes sectores 
                    ciudadanos, orientando su trabajo hacia un control político efectivo, con el objeto de desarrollar una administración de calidad.
                  </p>
                </div>
              </div>
            </div>

            <div id="estructura" className="acerca-section estructura-section">
              <h2><FaSitemap /> Estructura Jerárquica</h2>
              <p className="section-description">
                Organización y jerarquía institucional del Concejo Municipal de Guachucal
              </p>
              <div className="estructura-organigrama">
                {/* Nivel 1: Presidencia */}
                <div className="estructura-nivel nivel-1">
                  <div className="estructura-card presidencia">
                    <FaGavel className="estructura-icon" />
                    <h3>PRESIDENCIA</h3>
                    <p>Mesa Directiva 2025</p>
                    <span className="estructura-cargo">Máxima Autoridad</span>
                  </div>
                </div>

                {/* Nivel 2: Vicepresidencias y Secretaría */}
                <div className="estructura-nivel nivel-2">
                  <div className="estructura-card vicepresidencia">
                    <FaUserTie className="estructura-icon" />
                    <h4>VICEPRESIDENTES</h4>
                    <p>Primer y Segundo Vicepresidente</p>
                  </div>
                  <div className="estructura-card secretaria">
                    <FaUserSecret className="estructura-icon" />
                    <h4>SECRETARÍA GENERAL</h4>
                    <p>Gestión administrativa y documental</p>
                  </div>
                </div>

                {/* Nivel 3: Concejales */}
                <div className="estructura-nivel nivel-3">
                  <div className="estructura-card concejales">
                    <FaUsers className="estructura-icon" />
                    <h4>CONCEJALES</h4>
                    <p>Honorables Concejales del Municipio</p>
                    <div className="estructura-funciones">
                      <p><strong>Funciones principales:</strong></p>
                      <ul>
                        <li>Ejercer control político</li>
                        <li>Participar en debates</li>
                        <li>Presentar proyectos de acuerdo</li>
                        <li>Integrar comisiones</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Nivel 4: Comisiones y Apoyo */}
                <div className="estructura-nivel nivel-4">
                  <div className="estructura-card comisiones">
                    <FaClipboardList className="estructura-icon" />
                    <h4>COMISIONES PERMANENTES</h4>
                    <p>Comisiones establecidas según reglamento</p>
                  </div>
                  <div className="estructura-card comisiones">
                    <FaTasks className="estructura-icon" />
                    <h4>COMISIONES ACCIDENTALES</h4>
                    <p>Comisiones para temas específicos</p>
                  </div>
                  <div className="estructura-card apoyo">
                    <FaUserCog className="estructura-icon" />
                    <h4>UNIDAD DE APOYO NORMATIVO</h4>
                    <p>Asesoría jurídica y normativa</p>
                  </div>
                </div>

                {/* Nivel 5: Personal Administrativo */}
                <div className="estructura-nivel nivel-5">
                  <div className="estructura-card administrativo">
                    <FaUsers className="estructura-icon" />
                    <h4>PERSONAL ADMINISTRATIVO</h4>
                    <p>Personal de apoyo administrativo y técnico</p>
                  </div>
                </div>
              </div>
            </div>

            <div id="autoridades" className="acerca-section">
              <h2>Autoridades</h2>
              {autoridades.length === 0 ? (
                <p>Cargando información de autoridades...</p>
              ) : (
                <div className="autoridades-grid">
                  {autoridades.map((autoridad) => (
                    <div key={autoridad.id} className="autoridad-card">
                      {autoridad.foto_url && (
                        <img 
                          src={autoridad.foto_url} 
                          alt={autoridad.nombre}
                          className="autoridad-foto"
                        />
                      )}
                      <h3>{autoridad.cargo}</h3>
                      <p className="autoridad-nombre">{autoridad.nombre}</p>
                      {autoridad.email && (
                        <p className="autoridad-contacto"><FaEnvelope /> {autoridad.email}</p>
                      )}
                      {autoridad.telefono && (
                        <p className="autoridad-contacto"><FaPhone /> {autoridad.telefono}</p>
                      )}
                      {autoridad.biografia && (
                        <p className="autoridad-biografia">{autoridad.biografia}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div id="contacto" className="acerca-section">
              <h2>Información de Contacto</h2>
              <div className="contacto-info">
                <p><FaMapMarkerAlt /> Calle Principal, Guachucal, Nariño</p>
                <p><FaPhone /> +57 (2) XXX-XXXX</p>
                <p><FaEnvelope /> contacto@concejo.guachucal.gov.co</p>
                <p><FaClock /> Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM</p>
              </div>
            </div>

            {/* Documento PDF Institucional Destacado */}
            {(configuracion.documento_institucional_url || configuracion.documento_institucional_titulo) && (
              <div className="acerca-section documento-institucional-section">
                <h2><FaFileAlt /> Documento Institucional</h2>
                <div className="documento-institucional-card">
                  <div className="documento-institucional-icon">
                    <FaFileAlt />
                  </div>
                  <div className="documento-institucional-content">
                    <h3>
                      {configuracion.documento_institucional_titulo || 
                       'Estatuto del Concejo Municipal de Guachucal'}
                    </h3>
                    {configuracion.documento_institucional_descripcion && (
                      <p>{configuracion.documento_institucional_descripcion}</p>
                    )}
                    {configuracion.documento_institucional_url && (
                      <a
                        href={getFileUrl(configuracion.documento_institucional_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-documento-institucional"
                      >
                        <FaDownload /> Descargar PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {historia.length > 0 && (
              <div id="historia" className="acerca-section historia-section">
                <h2>Historia del Concejo</h2>
                <Timeline eventos={historia} />
              </div>
            )}

            <div id="simbolos" className="acerca-section">
              <h2>Bandera de Guachucal</h2>
              <div className="bandera-display">
                <Bandera />
              </div>
            </div>

            {/* Documentos del Repositorio - Acerca */}
            <DocumentosRepositorioAcerca />
          </div>
        </div>
      </section>
    </div>
  );
};

// Componente para mostrar documentos del repositorio relacionados con Acerca
const DocumentosRepositorioAcerca = () => {
  const categoriasAcerca = ['acerca-de', 'miembros', 'historia', 'acerca-mision', 'acerca-vision', 
                            'acerca-estructura-jerarquica', 'acerca-autoridades', 'acerca-contacto', 'acerca-simbolos'];
  
  const { data: todosLosArchivos } = useQuery({
    queryKey: ['repositorio-acerca'],
    queryFn: async () => {
      try {
        const response = await api.get('/repositorio/listar');
        return response.data;
      } catch (error) {
        console.error('Error cargando archivos del repositorio:', error);
        return { categorias: {} };
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Filtrar solo las categorías de Acerca
  const documentosAcerca = categoriasAcerca
    .filter(cat => todosLosArchivos?.categorias?.[cat]?.archivos?.length > 0)
    .flatMap(cat => 
      todosLosArchivos.categorias[cat].archivos.map((archivo, index) => ({
        id: `repo-${cat}-${archivo.nombre}-${index}`,
        categoria: cat,
        nombreCategoria: todosLosArchivos.categorias[cat].nombre,
        titulo: archivo.nombreOriginal || archivo.nombre,
        descripcion: archivo.nota || '',
        fecha: archivo.fechaSubida,
        archivo_url: `/api/repositorio/descargar/${cat}/${encodeURIComponent(archivo.nombre)}`,
        tamaño: archivo.tamañoMB
      }))
    );

  if (documentosAcerca.length === 0) {
    return null;
  }

  return (
    <div id="documentos-acerca" className="acerca-section documentos-repositorio-section">
      <h2>
        <FaFileAlt /> Documentos del Repositorio
        <span className="seccion-count">({documentosAcerca.length})</span>
      </h2>
      <div className="documentos-grid">
        {documentosAcerca.map((documento) => (
          <div key={documento.id} className="documento-card documento-repositorio">
            <div className="documento-content">
              <span className="documento-badge-repositorio">
                <FaFileAlt /> Repositorio
              </span>
              <span className="documento-categoria-badge">{documento.nombreCategoria}</span>
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
                    className="btn btn-primary"
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
  );
};

export default Acerca;


