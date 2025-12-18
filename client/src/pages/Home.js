import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import NoticiaImage from '../components/NoticiaImage';
import { getImageByIndex } from '../utils/exampleImages';
import TexturePattern from '../components/TexturePattern';
import { OrganizationSchema, WebSiteSchema } from '../components/SchemaMarkup';
import AnimatedSection from '../components/AnimatedSection';
import {
  FaCalendarAlt, FaHandshake, FaFileSignature, FaDollarSign, FaChartLine,
  FaShieldAlt, FaFileAlt, FaBook, FaClipboardCheck, FaBalanceScale, FaSitemap,
  FaGavel, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFileContract,
  FaClipboardList, FaProjectDiagram, FaFemale, FaUserClock, FaGraduationCap,
  FaWheelchair, FaGlobeAmericas, FaBriefcase, FaChevronDown, FaUsers, FaNewspaper,
  FaComments, FaFileAlt as FaDocument, FaBuilding, FaCity, FaShoppingCart,
  FaBox, FaArchive, FaLaptopCode, FaDigitalTachograph, FaFlag, FaLandmark
} from 'react-icons/fa';
import CountUp from '../components/CountUp';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import './Home.css';
import '../styles/force-center.css';
import '../styles/EMERGENCY-CENTER-FIX.css';
import '../styles/ULTIMATE-CENTER-FIX.css';
import '../styles/FIX-ACCESO-RAPIDO.css';
import '../styles/FIX-CONTACTO.css';
import '../styles/FIX-NOTICIAS-HOME.css';
import '../styles/FIX-GRUPOS-INTERES.css';
import '../styles/FIX-GRUPOS-GRID-LEFT.css';
import '../styles/FIX-UBICACION.css';
import '../styles/FIX-ESTADISTICAS-SECTION.css';
import '../styles/FIX-GACETA.css';
import '../styles/FIX-ENLACES-INTERES.css';
import '../styles/FIX-ENLACES-GRID-SCROLL.css';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  // Precargar imagen de fondo del hero
  useEffect(() => {
    const img = new Image();
    const imagePath = `${process.env.PUBLIC_URL || ''}/images/hero-grupo-personas.jpg`;
    img.src = imagePath;
    img.onload = () => {
      setHeroImageLoaded(true);
    };
    img.onerror = () => {
      // Intentar con la segunda imagen
      const img2 = new Image();
      img2.src = `${process.env.PUBLIC_URL || ''}/images/hero-grupo-personas2.jpg`;
      img2.onload = () => {
        setHeroImageLoaded(true);
      };
      img2.onerror = () => {
        setHeroImageLoaded(false);
      };
    };
  }, []);

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

  // Animación de entrada
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToNext = () => {
    const nextSection = document.querySelector('.anuncios, .acceso-rapido');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const { data: config = {} } = useQuery({
    queryKey: ['configuracion'],
    queryFn: async () => {
      const response = await api.get('/configuracion');
      return response.data;
    }
  });

  // Obtener estadísticas para la sección de métricas
  const { data: sesiones = [] } = useQuery({
    queryKey: ['sesiones'],
    queryFn: async () => {
      const response = await api.get('/sesiones');
      return response.data;
    }
  });

  const { data: pqrsd = [] } = useQuery({
    queryKey: ['pqrsd'],
    queryFn: async () => {
      const response = await api.get('/pqrsd');
      return response.data;
    }
  });

  const { data: documentos = [] } = useQuery({
    queryKey: ['gaceta'],
    queryFn: async () => {
      const response = await api.get('/gaceta');
      return response.data;
    }
  });

  // Calcular estadísticas
  const stats = {
    sesiones: sesiones.length,
    pqrsdResueltas: pqrsd.filter(p => p.estado === 'resuelto').length,
    documentos: documentos.length,
    noticias: noticias.length
  };

  // Función para obtener datos por mes (últimos 6 meses)
  const obtenerDatosPorMes = (items, fechaField = 'creado_en') => {
    const meses = [];
    const ahora = new Date();
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
      const mesNombre = fecha.toLocaleDateString('es-CO', { month: 'short' });
      const año = fecha.getFullYear();
      const mesNum = fecha.getMonth();
      
      const count = items.filter(item => {
        const itemFecha = new Date(item[fechaField] || item.creado_en || item.fecha_publicacion);
        return itemFecha.getFullYear() === año && itemFecha.getMonth() === mesNum;
      }).length;
      
      meses.push({ mes: mesNombre, año, count });
    }
    return meses;
  };

  // Datos mensuales
  const datosMensuales = {
    noticias: obtenerDatosPorMes(noticias, 'fecha_publicacion'),
    sesiones: obtenerDatosPorMes(sesiones, 'fecha_sesion'),
    documentos: obtenerDatosPorMes(documentos, 'fecha_publicacion'),
    pqrsd: obtenerDatosPorMes(pqrsd, 'fecha_creacion')
  };

  // Gráfico de línea - Comparativa mensual
  const chartDataMensual = {
    labels: datosMensuales.noticias.map(d => d.mes),
    datasets: [
      {
        label: 'Noticias',
        data: datosMensuales.noticias.map(d => d.count),
        borderColor: 'rgba(40, 167, 69, 1)',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Sesiones',
        data: datosMensuales.sesiones.map(d => d.count),
        borderColor: 'rgba(0, 123, 255, 1)',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Documentos',
        data: datosMensuales.documentos.map(d => d.count),
        borderColor: 'rgba(255, 193, 7, 1)',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'PQRSD',
        data: datosMensuales.pqrsd.map(d => d.count),
        borderColor: 'rgba(220, 53, 69, 1)',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Datos para gráficos
  const pqrsdPorEstado = {
    resuelto: pqrsd.filter(p => p.estado === 'resuelto').length,
    enProceso: pqrsd.filter(p => p.estado === 'en_proceso').length,
    pendiente: pqrsd.filter(p => p.estado === 'pendiente').length,
    cerrado: pqrsd.filter(p => p.estado === 'cerrado').length
  };

  // Gráfico de barras - PQRSD por estado
  const chartDataPQRSD = {
    labels: ['Resueltas', 'En Proceso', 'Pendientes', 'Cerradas'],
    datasets: [{
      label: 'PQRSD por Estado',
      data: [
        pqrsdPorEstado.resuelto,
        pqrsdPorEstado.enProceso,
        pqrsdPorEstado.pendiente,
        pqrsdPorEstado.cerrado
      ],
      backgroundColor: [
        'rgba(40, 167, 69, 0.8)',
        'rgba(255, 193, 7, 0.8)',
        'rgba(220, 53, 69, 0.8)',
        'rgba(108, 117, 125, 0.8)'
      ],
      borderColor: [
        'rgba(40, 167, 69, 1)',
        'rgba(255, 193, 7, 1)',
        'rgba(220, 53, 69, 1)',
        'rgba(108, 117, 125, 1)'
      ],
      borderWidth: 2
    }]
  };

  // Gráfico de dona - Distribución general
  const chartDataDona = {
    labels: ['Sesiones', 'PQRSD Resueltas', 'Documentos', 'Noticias'],
    datasets: [{
      data: [stats.sesiones, stats.pqrsdResueltas, stats.documentos, stats.noticias],
      backgroundColor: [
        'rgba(40, 167, 69, 0.8)',
        'rgba(0, 123, 255, 0.8)',
        'rgba(255, 193, 7, 0.8)',
        'rgba(220, 53, 69, 0.8)'
      ],
      borderColor: [
        'rgba(40, 167, 69, 1)',
        'rgba(0, 123, 255, 1)',
        'rgba(255, 193, 7, 1)',
        'rgba(220, 53, 69, 1)'
      ],
      borderWidth: 2
    }]
  };

  // Opciones de gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 12
        }
      }
    }
  };

  // Opciones para gráfico de línea
  const chartOptionsLine = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

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
            backgroundImage: heroImageLoaded
              ? `url('${process.env.PUBLIC_URL || ''}/images/hero-grupo-personas.jpg'), linear-gradient(135deg, rgba(21, 87, 36, 0.7) 0%, rgba(40, 167, 69, 0.7) 100%)`
              : 'linear-gradient(135deg, #155724 0%, #28a745 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        <div className="hero-overlay"></div>
        <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
          <h1 className="hero-title">Concejo Municipal de Guachucal</h1>
          <p className="hero-subtitle">Transparencia, participación ciudadana y servicio público</p>
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
              <span className="acceso-icon"><FaCalendarAlt /></span>
              <h3>Agenda CMP</h3>
            </Link>
            <Link to="/transparencia" className="acceso-item">
              <span className="acceso-icon"><FaHandshake /></span>
              <h3>Contratación</h3>
            </Link>
            <Link to="/transparencia" className="acceso-item">
              <span className="acceso-icon"><FaFileSignature /></span>
              <h3>Dec. Renta</h3>
            </Link>
            <Link to="/transparencia" className="acceso-item">
              <span className="acceso-icon"><FaDollarSign /></span>
              <h3>Ejec. Presupuestal</h3>
            </Link>
            <Link to="/transparencia" className="acceso-item">
              <span className="acceso-icon"><FaChartLine /></span>
              <h3>Est. Financieros</h3>
            </Link>
            <Link to="/transparencia" className="acceso-item">
              <span className="acceso-icon"><FaShieldAlt /></span>
              <h3>Informes Control Interno</h3>
            </Link>
            <Link to="/pqrsd" className="acceso-item">
              <span className="acceso-icon"><FaFileAlt /></span>
              <h3>PQRSD</h3>
            </Link>
            <Link to="/transparencia" className="acceso-item">
              <span className="acceso-icon"><FaBook /></span>
              <h3>Libro de registro</h3>
            </Link>
            <Link to="/transparencia" className="acceso-item">
              <span className="acceso-icon"><FaDollarSign /></span>
              <h3>Presupuesto</h3>
            </Link>
            <Link to="/transparencia" className="acceso-item">
              <span className="acceso-icon"><FaChartLine /></span>
              <h3>Rendición de cuentas</h3>
            </Link>
            <Link to="/transparencia" className="acceso-item">
              <span className="acceso-icon"><FaSitemap /></span>
              <h3>Entidades</h3>
            </Link>
            <Link to="/transparencia" className="acceso-item">
              <span className="acceso-icon"><FaBalanceScale /></span>
              <h3>Entes de control</h3>
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Contacto */}
      <AnimatedSection 
        id="contacto" 
        className="section contacto" 
        animationType="fadeInUp"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3840&q=100')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container">
          <h2 className="section-title">{t('home.contacto')}</h2>
          <div className="contacto-content">
            <div className="contacto-info-grid">
              <div className="contacto-info-card">
                <div className="contacto-icon-wrapper">
                  <FaMapMarkerAlt className="contacto-icon" />
                </div>
                <h3>Ubicación</h3>
                <p>Calle Principal, Guachucal, Nariño</p>
              </div>
              <div className="contacto-info-card">
                <div className="contacto-icon-wrapper">
                  <FaPhone className="contacto-icon" />
                </div>
                <h3>Teléfono</h3>
                <p>+57 (2) XXX-XXXX</p>
              </div>
              <div className="contacto-info-card">
                <div className="contacto-icon-wrapper">
                  <FaEnvelope className="contacto-icon" />
                </div>
                <h3>Email</h3>
                <p>contacto@concejo.guachucal.gov.co</p>
              </div>
              <div className="contacto-info-card">
                <div className="contacto-icon-wrapper">
                  <FaClock className="contacto-icon" />
                </div>
                <h3>Horarios</h3>
                <p>Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM</p>
              </div>
            </div>
            <div className="contacto-actions-grid">
              <div className="contacto-action-card contacto-pqrs-card">
                <div className="contacto-action-icon">
                  <FaFileAlt />
                </div>
                <h3>PQRS</h3>
                <p>¿Tiene alguna petición, queja, reclamo, sugerencia o denuncia?</p>
                <Link to="/pqrsd" className="btn btn-pqrs">
                  Envíe su PQRS aquí
                </Link>
              </div>
              <div className="contacto-action-card contacto-mensaje-card">
                <div className="contacto-action-icon">
                  <FaEnvelope />
                </div>
                <h3>Contacto</h3>
                <p>¿Tiene alguna consulta o mensaje general?</p>
                <Link to="/contacto" className="btn btn-contacto">
                  Enviar Mensaje
                </Link>
              </div>
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
              <span className="gaceta-icon"><FaGavel /></span>
              <span className="gaceta-text">ACUERDOS</span>
            </Link>
            <Link to="/gaceta?tipo=acta" className="gaceta-item">
              <span className="gaceta-icon"><FaClipboardList /></span>
              <span className="gaceta-text">ACTAS DE SESIÓN</span>
            </Link>
            <Link to="/gaceta?tipo=decreto" className="gaceta-item">
              <span className="gaceta-icon"><FaFileContract /></span>
              <span className="gaceta-text">DECRETOS</span>
            </Link>
            <Link to="/gaceta?tipo=proyecto" className="gaceta-item">
              <span className="gaceta-icon"><FaProjectDiagram /></span>
              <span className="gaceta-text">PROYECTOS</span>
            </Link>
            <Link to="/gaceta?tipo=manual" className="gaceta-item">
              <span className="gaceta-icon"><FaBook /></span>
              <span className="gaceta-text">MANUALES</span>
            </Link>
            <Link to="/gaceta?tipo=ley" className="gaceta-item">
              <span className="gaceta-icon"><FaBalanceScale /></span>
              <span className="gaceta-text">LEYES</span>
            </Link>
            <Link to="/gaceta?tipo=politica" className="gaceta-item">
              <span className="gaceta-icon"><FaClipboardCheck /></span>
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
                <FaClipboardList />
              </div>
              <span className="enlace-texto">Trámites y servicios</span>
            </a>
            <a href="https://www.guachucal-narino.gov.co" target="_blank" rel="noopener noreferrer" className="enlace-item">
              <div className="enlace-icon">
                <FaBuilding />
              </div>
              <span className="enlace-texto">Alcaldía de Guachucal</span>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="enlace-item">
              <div className="enlace-icon">
                <FaBalanceScale />
              </div>
              <span className="enlace-texto">Contraloría Municipal</span>
            </a>
            <a href="https://www.colombiacompra.gov.co" target="_blank" rel="noopener noreferrer" className="enlace-item">
              <div className="enlace-icon">
                <FaShoppingCart />
              </div>
              <span className="enlace-texto">Colombia compra eficiente</span>
            </a>
            <a href="https://www.urnadecristal.gov.co" target="_blank" rel="noopener noreferrer" className="enlace-item">
              <div className="enlace-icon">
                <FaBox />
              </div>
              <span className="enlace-texto">Urna de Cristal</span>
            </a>
            <a href="https://www.contratacion.gov.co" target="_blank" rel="noopener noreferrer" className="enlace-item">
              <div className="enlace-icon">
                <FaFileContract />
              </div>
              <span className="enlace-texto">Contratación Pública</span>
            </a>
            <a href="https://www.gobiernodigital.gov.co" target="_blank" rel="noopener noreferrer" className="enlace-item">
              <div className="enlace-icon">
                <FaLaptopCode />
              </div>
              <span className="enlace-texto">Gobierno Digital</span>
            </a>
            <a href="https://www.presidencia.gov.co" target="_blank" rel="noopener noreferrer" className="enlace-item">
              <div className="enlace-icon">
                <FaFlag />
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
              <div className="grupo-icon"><FaFemale /></div>
              <h3>Dupla Naranja</h3>
              <p>Ruta de Atención integral para las mujeres</p>
              <Link to="/pqrsd" className="grupo-btn">
                Más información →
              </Link>
            </div>

            {/* Adultos Mayores */}
            <div className="grupo-card grupo-adultos-mayores">
              <div className="grupo-icon"><FaUserClock /></div>
              <h3>Adultos Mayores</h3>
              <p>Servicios y programas especializados para personas mayores</p>
              <Link to="/pqrsd" className="grupo-btn">
                Más información →
              </Link>
            </div>

            {/* Jóvenes */}
            <div className="grupo-card grupo-jovenes">
              <div className="grupo-icon"><FaGraduationCap /></div>
              <h3>Jóvenes</h3>
              <p>Programas, convocatorias y oportunidades para jóvenes</p>
              <Link to="/pqrsd" className="grupo-btn">
                Más información →
              </Link>
            </div>

            {/* Personas con Discapacidad */}
            <div className="grupo-card grupo-discapacidad">
              <div className="grupo-icon"><FaWheelchair /></div>
              <h3>Personas con Discapacidad</h3>
              <p>Accesibilidad, inclusión y servicios especializados</p>
              <Link to="/pqrsd" className="grupo-btn">
                Más información →
              </Link>
            </div>

            {/* Comunidades Étnicas */}
            <div className="grupo-card grupo-etnicas">
              <div className="grupo-icon"><FaGlobeAmericas /></div>
              <h3>Comunidades Étnicas</h3>
              <p>Información y servicios para comunidades indígenas y afrodescendientes</p>
              <Link to="/pqrsd" className="grupo-btn">
                Más información →
              </Link>
            </div>

            {/* Empresarios */}
            <div className="grupo-card grupo-empresarios">
              <div className="grupo-icon"><FaBriefcase /></div>
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
      <AnimatedSection 
        className="section ubicacion" 
        animationType="slideUpFade"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3840&q=100')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container">
          <div className="ubicacion-content">
            <div className="ubicacion-left">
              <div className="ubicacion-escudo-container">
                <div className="ubicacion-guachucal-label">GUACHUCAL</div>
              </div>
              <p className="ubicacion-subtitulo">Nariño, Colombia</p>
            </div>
            <div className="ubicacion-right">
              <h2 className="ubicacion-section-title">Ubicación</h2>
              <div className="ubicacion-info">
                <p className="ubicacion-item">
                  <span className="ubicacion-icon"><FaMapMarkerAlt /></span>
                  Calle Principal, Guachucal, Nariño
                </p>
                <p className="ubicacion-item">
                  <span className="ubicacion-icon"><FaPhone /></span>
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

      {/* Sección de Estadísticas - Antes del Footer */}
      <AnimatedSection className="section estadisticas-section" animationType="fadeInUp">
        <div className="container">
          <h2 className="section-title">Estadísticas del Concejo</h2>
          <p className="section-subtitle">Datos y métricas de nuestra gestión</p>
          
          {/* Tarjetas de estadísticas */}
          <div className="estadisticas-grid">
            <div className="estadistica-card">
              <div className="estadistica-icon">
                <FaCalendarAlt />
              </div>
              <div className="estadistica-content">
                <h3 className="estadistica-numero">
                  <CountUp end={stats.sesiones} duration={2000} />
                </h3>
                <p className="estadistica-label">Sesiones Realizadas</p>
              </div>
            </div>
            <div className="estadistica-card">
              <div className="estadistica-icon">
                <FaClipboardCheck />
              </div>
              <div className="estadistica-content">
                <h3 className="estadistica-numero estadistica-valor">
                  <CountUp end={stats.pqrsdResueltas} duration={2000} />
                </h3>
                <p className="estadistica-label">PQRSD Resueltas</p>
              </div>
            </div>
            <div className="estadistica-card">
              <div className="estadistica-icon">
                <FaDocument />
              </div>
              <div className="estadistica-content">
                <h3 className="estadistica-numero">
                  <CountUp end={stats.documentos} duration={2000} />
                </h3>
                <p className="estadistica-label">Documentos Publicados</p>
              </div>
            </div>
            <div className="estadistica-card">
              <div className="estadistica-icon">
                <FaNewspaper />
              </div>
              <div className="estadistica-content">
                <h3 className="estadistica-numero estadistica-valor">
                  <CountUp end={stats.noticias} duration={2000} />
                </h3>
                <p className="estadistica-label">Noticias Publicadas</p>
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="estadisticas-graficos">
            <div className="grafico-container grafico-full-width">
              <h3 className="grafico-titulo">Comparativa Mensual (Últimos 6 Meses)</h3>
              <div className="grafico-wrapper">
                <Line data={chartDataMensual} options={chartOptionsLine} />
              </div>
            </div>
            <div className="grafico-container">
              <h3 className="grafico-titulo">PQRSD por Estado</h3>
              <div className="grafico-wrapper">
                <Bar data={chartDataPQRSD} options={chartOptions} />
              </div>
            </div>
            <div className="grafico-container">
              <h3 className="grafico-titulo">Distribución General</h3>
              <div className="grafico-wrapper">
                <Doughnut data={chartDataDona} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Home;


