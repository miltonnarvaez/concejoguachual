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
              <div className="section-icon">🎯</div>
              <h2>Misión</h2>
              <div className="section-content-with-image">
                <div className="section-text">
                  <p>
                    El Concejo Municipal de Guachucal tiene como misión ejercer el control político
                    sobre la administración municipal, aprobar los planes y programas de desarrollo
                    económico y social, y ejercer las demás funciones que le asigna la Constitución
                    y la ley, en beneficio de la comunidad guachucaleña.
                  </p>
                </div>
                <div className="section-image-placeholder">
                  <div className="image-placeholder">
                    <span className="placeholder-icon">🏛️</span>
                    <p>Gobierno Local</p>
                  </div>
                </div>
              </div>
            </div>

            <div id="vision" className="acerca-section vision-section">
              <div className="section-icon">🌟</div>
              <h2>Visión</h2>
              <div className="section-content-with-image">
                <div className="section-image-placeholder">
                  <div className="image-placeholder">
                    <span className="placeholder-icon">🌟</span>
                    <p>Futuro Promisorio</p>
                  </div>
                </div>
                <div className="section-text">
                  <p>
                    Ser reconocido como un concejo transparente, eficiente y comprometido con el
                    desarrollo integral del municipio de Guachucal, promoviendo la participación
                    ciudadana y el bienestar de todos sus habitantes.
                  </p>
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
                        <p className="autoridad-contacto">✉️ {autoridad.email}</p>
                      )}
                      {autoridad.telefono && (
                        <p className="autoridad-contacto">📞 {autoridad.telefono}</p>
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
                <p>📍 Calle Principal, Guachucal, Nariño</p>
                <p>📞 +57 (2) XXX-XXXX</p>
                <p>✉️ contacto@concejo.guachucal.gov.co</p>
                <p>🕐 Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM</p>
              </div>
            </div>

            {/* Documento PDF Institucional Destacado */}
            {(configuracion.documento_institucional_url || configuracion.documento_institucional_titulo) && (
              <div className="acerca-section documento-institucional-section">
                <h2>📄 Documento Institucional</h2>
                <div className="documento-institucional-card">
                  <div className="documento-institucional-icon">
                    📋
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
                        📥 Descargar PDF
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default Acerca;


