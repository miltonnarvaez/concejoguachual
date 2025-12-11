import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import NoticiaImage from '../components/NoticiaImage';
import { getImageByIndex } from '../utils/exampleImages';
import GovCoLogo from '../components/logos/GovCoLogo';
import AlcaldiaLogo from '../components/logos/AlcaldiaLogo';
import ContraloriaLogo from '../components/logos/ContraloriaLogo';
import ColombiaCompraLogo from '../components/logos/ColombiaCompraLogo';
import UrnaCristalLogo from '../components/logos/UrnaCristalLogo';
import SECOPLogo from '../components/logos/SECOPLogo';
import GobiernoDigitalLogo from '../components/logos/GobiernoDigitalLogo';
import PresidenciaLogo from '../components/logos/PresidenciaLogo';
import TexturePattern from '../components/TexturePattern';
import { OrganizationSchema, WebSiteSchema } from '../components/SchemaMarkup';
import AnimatedSection from '../components/AnimatedSection';
import './Home.css';

const Home = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: noticias = [] } = useQuery({
    queryKey: ['noticias'],
    queryFn: async () => {
      const response = await api.get('/noticias');
      return response.data;
    }
  });

  const { data: convocatorias = [] } = useQuery({
    queryKey: ['convocatorias'],
    queryFn: async () => {
      const response = await api.get('/convocatorias');
      return response.data;
    }
  });

  const destacadas = convocatorias.filter(c => c.destacada).slice(0, 3);
  const ultimasNoticias = noticias.slice(0, 3);

  const { data: config = {} } = useQuery({
    queryKey: ['configuracion'],
    queryFn: async () => {
      const response = await api.get('/configuracion');
      return response.data;
    }
  });

  return (
    <div className="home">
      <OrganizationSchema 
        name="Concejo Municipal de Guachucal"
        url={window.location.origin}
        email={config.email}
        telephone={config.telefono}
      />
      <WebSiteSchema 
        name="Concejo Municipal de Guachucal"
        url={window.location.origin}
        searchUrl={`${window.location.origin}/busqueda?q={search_term_string}`}
      />
      {/* Hero Section */}
      <section className="hero">
        <div 
          className="hero-background" 
          style={{
            backgroundImage: `url('/images/hero-grupo-personas.jpg'), linear-gradient(135deg, #155724 0%, #28a745 100%)`
          }}
        ></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Concejo Municipal de Guachucal</h1>
          <p>Transparencia, participación ciudadana y servicio público</p>
          <div className="hero-actions">
            <Link to="/pqrsd" className="btn btn-hero-primary">
              Enviar PQRSD
            </Link>
            <Link to="/busqueda" className="btn btn-hero-secondary">
              Buscar Información
            </Link>
          </div>
        </div>
      </section>

      {/* Anuncios Importantes */}
      {destacadas.length > 0 && (
        <AnimatedSection className="section anuncios" animationType="fadeInUp">
          <div className="container">
            <h2 className="section-title">{t('home.anuncios')}</h2>
            <div className="anuncios-grid">
              {destacadas.map((convocatoria, index) => (
                <div key={convocatoria.id} className="anuncio-card">
                  <NoticiaImage 
                    src={convocatoria.imagen_url || getImageByIndex(index, 'gobierno')} 
                    alt={convocatoria.titulo}
                    className="anuncio-card-image"
                  />
                  <div className="anuncio-content">
                    <h3>{convocatoria.titulo}</h3>
                    <p>{convocatoria.descripcion.substring(0, 150)}...</p>
                    <Link to={`/convocatorias/${convocatoria.id}`} className="btn">
                      Más Información →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Búsqueda y Acceso Rápido */}
      <AnimatedSection className="section acceso-rapido" animationType="slideUpFade">
        <div className="container">
          <h2 className="section-title">{t('home.buscar')}</h2>
          <div className="acceso-grid">
            <Link to="/gaceta" className="acceso-item">
              <span className="acceso-icon">📅</span>
              <h3>Agenda CMP</h3>
            </Link>
            <Link to="/transparencia" className="acceso-item">
              <span className="acceso-icon">📋</span>
              <h3>Contratación</h3>
            </Link>
            <Link to="/transparencia" className="acceso-item">
              <span className="acceso-icon">📊</span>
              <h3>Dec. Renta</h3>
            </Link>
            <Link to="/transparencia" className="acceso-item">
              <span className="acceso-icon">💰</span>
              <h3>Ejec. Presupuestal</h3>
            </Link>
            <Link to="/transparencia" className="acceso-item">
              <span className="acceso-icon">📈</span>
              <h3>Est. Financieros</h3>
            </Link>
            <Link to="/transparencia" className="acceso-item">
              <span className="acceso-icon">📑</span>
              <h3>Informes Control Interno</h3>
            </Link>
            <Link to="/pqrsd" className="acceso-item">
              <span className="acceso-icon">📝</span>
              <h3>PQRSD</h3>
            </Link>
            <Link to="/transparencia" className="acceso-item">
              <span className="acceso-icon">📖</span>
              <h3>Libro de registro</h3>
            </Link>
            <Link to="/transparencia" className="acceso-item">
              <span className="acceso-icon">💵</span>
              <h3>Presupuesto</h3>
            </Link>
            <Link to="/transparencia" className="acceso-item">
              <span className="acceso-icon">📊</span>
              <h3>Rendición de cuentas</h3>
            </Link>
            <Link to="/transparencia" className="acceso-item">
              <span className="acceso-icon">🏢</span>
              <h3>Entidades</h3>
            </Link>
            <Link to="/transparencia" className="acceso-item">
              <span className="acceso-icon">⚖️</span>
              <h3>Entes de control</h3>
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Contacto */}
      <AnimatedSection id="contacto" className="section contacto" animationType="fadeInUp">
        <div className="container">
          <h2 className="section-title">{t('home.contacto')}</h2>
          <div className="contacto-content">
            <div className="contacto-info">
              <p>📍 Calle Principal, Guachucal, Nariño</p>
              <p>📞 +57 (2) XXX-XXXX</p>
              <p>✉️ contacto@concejo.guachucal.gov.co</p>
              <p>🕐 Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM</p>
            </div>
            <div className="contacto-pqrs">
              <p className="contacto-pqrs-text">¿Tiene alguna petición, queja, reclamo, sugerencia o denuncia?</p>
              <Link to="/pqrsd" className="btn btn-pqrs">
                Envíe su PQRS aquí →
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Gaceta */}
      <AnimatedSection className="section gaceta" animationType="scaleIn">
        <TexturePattern />
        <div className="container">
          <h2 className="section-title">{t('home.gaceta')}</h2>
          <div className="gaceta-grid">
            <Link to="/gaceta?tipo=acuerdo" className="gaceta-item">
              <span className="gaceta-icon">📄</span>
              <span className="gaceta-text">ACUERDOS</span>
            </Link>
            <Link to="/gaceta?tipo=acta" className="gaceta-item">
              <span className="gaceta-icon">📋</span>
              <span className="gaceta-text">ACTAS DE SESIÓN</span>
            </Link>
            <Link to="/gaceta?tipo=decreto" className="gaceta-item">
              <span className="gaceta-icon">📜</span>
              <span className="gaceta-text">DECRETOS</span>
            </Link>
            <Link to="/gaceta?tipo=proyecto" className="gaceta-item">
              <span className="gaceta-icon">📝</span>
              <span className="gaceta-text">PROYECTOS</span>
            </Link>
            <Link to="/gaceta?tipo=manual" className="gaceta-item">
              <span className="gaceta-icon">📚</span>
              <span className="gaceta-text">MANUALES</span>
            </Link>
            <Link to="/gaceta?tipo=ley" className="gaceta-item">
              <span className="gaceta-icon">⚖️</span>
              <span className="gaceta-text">LEYES</span>
            </Link>
            <Link to="/gaceta?tipo=politica" className="gaceta-item">
              <span className="gaceta-icon">📋</span>
              <span className="gaceta-text">POLÍTICAS</span>
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Noticias */}
      {ultimasNoticias.length > 0 && (
        <AnimatedSection className="section noticias-home" animationType="fadeInLeft">
          <div className="container">
            <h2 className="section-title">{t('home.noticias')}</h2>
            <div className="noticias-grid">
              {ultimasNoticias.map((noticia, index) => (
                <div key={noticia.id} className="noticia-card">
                  <NoticiaImage 
                    src={noticia.imagen_url || getImageByIndex(index, 'gobierno')} 
                    alt={noticia.titulo}
                    className="noticia-card-image"
                  />
                  <div className="noticia-content">
                    <span className="noticia-fecha">
                      {new Date(noticia.fecha_publicacion).toLocaleDateString('es-CO')}
                    </span>
                    <h3>{noticia.titulo}</h3>
                    <p>{noticia.resumen || noticia.contenido.substring(0, 150)}...</p>
                    <Link to={`/noticias/${noticia.id}`} className="btn">
                      Leer más →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center" style={{ marginTop: '2rem' }}>
              <Link to="/noticias" className="btn btn-secondary">
                Ver todas las noticias
              </Link>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Convocatorias Destacadas */}
      {convocatorias.length > 0 && (
        <AnimatedSection className="section convocatorias-home" animationType="fadeInRight">
          <div className="container">
            <h2 className="section-title">Convocatorias</h2>
            <div className="convocatorias-grid">
              {convocatorias.slice(0, 6).map((convocatoria, index) => (
                <div key={convocatoria.id} className="convocatoria-card">
                  <NoticiaImage 
                    src={convocatoria.imagen_url || getImageByIndex(index, 'eventos')} 
                    alt={convocatoria.titulo}
                    className="convocatoria-card-image"
                  />
                  <div className="convocatoria-content">
                    <span className="convocatoria-fecha">
                      {new Date(convocatoria.fecha_inicio).toLocaleDateString('es-CO')} - {new Date(convocatoria.fecha_fin).toLocaleDateString('es-CO')}
                    </span>
                    <h3>{convocatoria.titulo}</h3>
                    <p>{convocatoria.descripcion.substring(0, 120)}...</p>
                    <Link to={`/convocatorias/${convocatoria.id}`} className="btn">
                      Ver más →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center" style={{ marginTop: '2rem' }}>
              <Link to="/convocatorias" className="btn btn-secondary">
                Ver todas las convocatorias
              </Link>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Enlaces de Interés */}
      <AnimatedSection className="section enlaces-interes" animationType="bounceIn">
        <div className="container">
          <h2 className="section-title">Enlaces de Interés</h2>
          <div className="enlaces-grid">
            <a href="https://www.gov.co" target="_blank" rel="noopener noreferrer" className="enlace-item">
              <div className="enlace-icon">
                <GovCoLogo width={70} height={70} />
              </div>
              <span className="enlace-texto">Trámites y servicios</span>
            </a>
            <a href="https://www.guachucal-narino.gov.co" target="_blank" rel="noopener noreferrer" className="enlace-item">
              <div className="enlace-icon">
                <AlcaldiaLogo width={70} height={70} />
              </div>
              <span className="enlace-texto">Alcaldía de Guachucal</span>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="enlace-item">
              <div className="enlace-icon">
                <ContraloriaLogo width={70} height={70} />
              </div>
              <span className="enlace-texto">Contraloría Municipal</span>
            </a>
            <a href="https://www.colombiacompra.gov.co" target="_blank" rel="noopener noreferrer" className="enlace-item">
              <div className="enlace-icon">
                <ColombiaCompraLogo width={70} height={70} />
              </div>
              <span className="enlace-texto">Colombia compra eficiente</span>
            </a>
            <a href="https://www.urnadecristal.gov.co" target="_blank" rel="noopener noreferrer" className="enlace-item">
              <div className="enlace-icon">
                <UrnaCristalLogo width={70} height={70} />
              </div>
              <span className="enlace-texto">Urna de Cristal</span>
            </a>
            <a href="https://www.contratacion.gov.co" target="_blank" rel="noopener noreferrer" className="enlace-item">
              <div className="enlace-icon">
                <SECOPLogo width={70} height={70} />
              </div>
              <span className="enlace-texto">Contratación Pública</span>
            </a>
            <a href="https://www.gobiernodigital.gov.co" target="_blank" rel="noopener noreferrer" className="enlace-item">
              <div className="enlace-icon">
                <GobiernoDigitalLogo width={70} height={70} />
              </div>
              <span className="enlace-texto">Gobierno Digital</span>
            </a>
            <a href="https://www.presidencia.gov.co" target="_blank" rel="noopener noreferrer" className="enlace-item">
              <div className="enlace-icon">
                <PresidenciaLogo width={70} height={70} />
              </div>
              <span className="enlace-texto">Presidencia de la República</span>
            </a>
          </div>
        </div>
      </AnimatedSection>

      {/* Grupos de Interés */}
      <AnimatedSection className="section grupos-interes" animationType="fadeInUp">
        <div className="container">
          <h2 className="section-title">Grupos de Interés</h2>
          <p className="section-subtitle">Información y servicios especializados para diferentes grupos poblacionales</p>
          
          <div className="grupos-grid">
            {/* Dupla Naranja */}
            <div className="grupo-card grupo-dupla-naranja">
              <div className="grupo-icon">👩</div>
              <h3>Dupla Naranja</h3>
              <p>Ruta de Atención integral para las mujeres</p>
              <Link to="/pqrsd" className="grupo-btn">
                Más información →
              </Link>
            </div>

            {/* Adultos Mayores */}
            <div className="grupo-card grupo-adultos-mayores">
              <div className="grupo-icon">👴</div>
              <h3>Adultos Mayores</h3>
              <p>Servicios y programas especializados para personas mayores</p>
              <Link to="/pqrsd" className="grupo-btn">
                Más información →
              </Link>
            </div>

            {/* Jóvenes */}
            <div className="grupo-card grupo-jovenes">
              <div className="grupo-icon">👨‍🎓</div>
              <h3>Jóvenes</h3>
              <p>Programas, convocatorias y oportunidades para jóvenes</p>
              <Link to="/pqrsd" className="grupo-btn">
                Más información →
              </Link>
            </div>

            {/* Personas con Discapacidad */}
            <div className="grupo-card grupo-discapacidad">
              <div className="grupo-icon">♿</div>
              <h3>Personas con Discapacidad</h3>
              <p>Accesibilidad, inclusión y servicios especializados</p>
              <Link to="/pqrsd" className="grupo-btn">
                Más información →
              </Link>
            </div>

            {/* Comunidades Étnicas */}
            <div className="grupo-card grupo-etnicas">
              <div className="grupo-icon">🌍</div>
              <h3>Comunidades Étnicas</h3>
              <p>Información y servicios para comunidades indígenas y afrodescendientes</p>
              <Link to="/pqrsd" className="grupo-btn">
                Más información →
              </Link>
            </div>

            {/* Empresarios */}
            <div className="grupo-card grupo-empresarios">
              <div className="grupo-icon">💼</div>
              <h3>Empresarios</h3>
              <p>Información sobre contratación, licitaciones y oportunidades de negocio</p>
              <Link to="/pqrsd" className="grupo-btn">
                Más información →
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Ubicación */}
      <AnimatedSection className="section ubicacion" animationType="slideUpFade">
        <div className="container">
          <div className="ubicacion-content">
            <div className="ubicacion-left">
              <div className="ubicacion-escudo-container">
                <img 
                  src="/images/escudo.png" 
                  alt="Escudo de Guachucal"
                  className="ubicacion-escudo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="ubicacion-guachucal-label">GUACHUCAL</div>
              </div>
              <p className="ubicacion-subtitulo">Nariño, Colombia</p>
            </div>
            <div className="ubicacion-right">
              <h2 className="ubicacion-section-title">Ubicación</h2>
              <div className="ubicacion-info">
                <p className="ubicacion-item">
                  <span className="ubicacion-icon">📍</span>
                  Calle Principal, Guachucal, Nariño
                </p>
                <p className="ubicacion-item">
                  <span className="ubicacion-icon">📞</span>
                  +57 (2) XXX-XXXX
                </p>
                <p className="ubicacion-item">
                  <span className="ubicacion-icon">✉️</span>
                  contacto@concejo.guachucal.gov.co
                </p>
              </div>
              <div className="ubicacion-separator"></div>
              <h3 className="ubicacion-horarios-title">Horarios de Atención</h3>
            </div>
          </div>
          <div className="mapa-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.1234567890123!2d-77.12345678901234!3d1.1234567890123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMDcnMjQuNCJOIDc3wrAwNycyNC40Ilc!5e0!3m2!1ses!2sco!4v1234567890123!5m2!1ses!2sco"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Concejo Municipal de Guachucal"
            ></iframe>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Home;


