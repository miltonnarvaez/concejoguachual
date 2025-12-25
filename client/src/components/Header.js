import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import Escudo from './Escudo';
import LogoTexto from './LogoTexto';
import TexturePattern from './TexturePattern';
import api from '../services/api';
import { 
  FaHome, FaBuilding, FaNewspaper, FaFileAlt, FaSearch, FaUsers, FaCog,
  FaBullseye, FaEye, FaUserFriends, FaHistory, FaPhone, FaMonument,
  FaList, FaGavel, FaFileContract, FaBook, FaBalanceScale, FaClipboardList,
  FaDollarSign, FaHandshake, FaChartLine, FaFileInvoiceDollar, FaShieldAlt,
  FaFileSignature, FaSitemap, FaProjectDiagram, FaGavel as FaLaw, FaUserCog,
  FaClipboardCheck, FaLandmark, FaUser, FaImages, FaCalendarAlt, FaComments, FaEnvelope,
  FaCheckCircle, FaTimes, FaBars, FaClock
} from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActiveSubmenu, setMobileActiveSubmenu] = useState(null);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);
  const menuItemRefs = useRef([]);
  const megaMenuRefs = useRef([]);

  const { data: config = {} } = useQuery({
    queryKey: ['configuracion'],
    queryFn: async () => {
      const response = await api.get('/configuracion');
      return response.data;
    }
  });

  // Estado para fecha y hora de Colombia
  const [fechaHora, setFechaHora] = useState({
    fecha: '',
    hora: ''
  });

  useEffect(() => {
    const actualizarFechaHora = () => {
      // Zona horaria de Colombia (America/Bogota)
      const ahora = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Bogota"}));
      
      const opcionesFecha = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      
      const opcionesHora = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };
      
      setFechaHora({
        fecha: ahora.toLocaleDateString('es-CO', opcionesFecha),
        hora: ahora.toLocaleTimeString('es-CO', opcionesHora)
      });
    };

    // Actualizar inmediatamente
    actualizarFechaHora();
    
    // Actualizar cada minuto (60000 ms)
    const interval = setInterval(actualizarFechaHora, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    {
      label: t('menu.inicio'),
      path: '/',
      hasSubmenu: false,
      icon: FaHome
    },
    {
      label: t('menu.acerca'),
      path: '/acerca',
      hasSubmenu: true,
      icon: FaBuilding,
      description: 'Conoce el Concejo',
      submenu: [
        { label: 'Misión', path: '/acerca#mision', icon: FaBullseye },
        { label: 'Visión', path: '/acerca#vision', icon: FaEye },
        { label: 'Estructura Jerárquica', path: '/acerca#estructura', icon: FaSitemap },
        { label: 'Autoridades', path: '/acerca#autoridades', icon: FaUserFriends },
        { label: 'Historia', path: '/historia', icon: FaHistory },
        { label: 'Plan de Acción 2025', path: '/plan-accion', icon: FaFileAlt },
        { label: 'Contacto', path: '/acerca#contacto', icon: FaPhone },
        { label: 'Símbolos', path: '/acerca#simbolos', icon: FaMonument }
      ]
    },
    {
      label: t('menu.noticias'),
      path: '/noticias',
      hasSubmenu: true,
      icon: FaNewspaper,
      description: 'Información y actualidad',
      submenu: [
        { label: 'Todas las Noticias', path: '/noticias', icon: FaNewspaper },
        { label: 'Noticias Generales', path: '/noticias?categoria=Noticias', icon: FaFileAlt },
        { label: 'Sesiones del Concejo', path: '/noticias?categoria=Sesiones', icon: FaList },
        { label: 'Acuerdos y Resoluciones', path: '/noticias?categoria=Acuerdos', icon: FaGavel },
        { label: 'Comunicados Oficiales', path: '/noticias?categoria=Comunicados', icon: FaFileContract },
        { label: 'Eventos y Actividades', path: '/noticias?categoria=Eventos', icon: FaCalendarAlt },
        { label: 'Institucional', path: '/noticias?categoria=Institucional', icon: FaBuilding }
      ]
    },
    {
      label: 'Documentos',
      path: '/gaceta',
      hasSubmenu: true,
      icon: FaFileAlt,
      description: 'Gaceta y documentos oficiales',
      submenu: [
        { label: 'Gaceta Municipal', path: '/gaceta', icon: FaFileAlt },
        { label: 'ACUERDOS', path: '/gaceta?tipo=acuerdo', icon: FaGavel },
        { label: 'ACTAS DE SESIÓN', path: '/gaceta?tipo=acta', icon: FaClipboardList },
        { label: 'DECRETOS', path: '/gaceta?tipo=decreto', icon: FaFileContract },
        { label: 'PROYECTOS', path: '/gaceta?tipo=proyecto', icon: FaProjectDiagram },
        { label: 'MANUALES', path: '/gaceta?tipo=manual', icon: FaBook },
        { label: 'PLANES', path: '/gaceta?tipo=plan', icon: FaProjectDiagram },
        { label: 'REGLAMENTO INTERNO', path: '/gaceta?tipo=reglamento-interno', icon: FaBook },
        { label: 'LEYES', path: '/gaceta?tipo=ley', icon: FaLaw },
        { label: 'POLÍTICAS', path: '/gaceta?tipo=politica', icon: FaClipboardList }
      ]
    },
    {
      label: t('menu.transparencia'),
      path: '/transparencia',
      hasSubmenu: true,
      icon: FaSearch,
      description: 'Acceso a la información pública',
      submenu: [
        { label: 'Presupuesto', path: '/transparencia?categoria=presupuesto', icon: FaDollarSign },
        { label: 'Contratación Pública', path: '/transparencia?categoria=contratacion', icon: FaHandshake },
        { label: 'Plan Anual de Compras', path: '/transparencia?categoria=plan_compras', icon: FaChartLine },
        { label: 'Rendición de Cuentas', path: '/transparencia?categoria=rendicion_cuentas', icon: FaFileInvoiceDollar },
        { label: 'Estados Financieros', path: '/transparencia?categoria=estados_financieros', icon: FaDollarSign },
        { label: 'Control Interno', path: '/transparencia?categoria=control_interno', icon: FaShieldAlt },
        { label: 'Declaración de Renta', path: '/transparencia?categoria=declaracion_renta', icon: FaFileSignature },
        { label: 'Estructura Organizacional', path: '/transparencia?categoria=estructura_organizacional', icon: FaSitemap },
        { label: 'Plan de Desarrollo', path: '/transparencia?categoria=plan_desarrollo', icon: FaProjectDiagram },
        { label: 'Normatividad', path: '/transparencia?categoria=normatividad', icon: FaGavel },
        { label: 'Servicios Ciudadanos', path: '/transparencia?categoria=servicios_ciudadanos', icon: FaUserCog },
        { label: 'Auditorías', path: '/transparencia?categoria=auditorias', icon: FaClipboardCheck },
        { label: 'Bienes Inmuebles', path: '/transparencia?categoria=bienes_inmuebles', icon: FaLandmark },
        { label: 'Personal', path: '/transparencia?categoria=personal', icon: FaUser }
      ]
    },
    {
      label: 'Participación',
      path: '/encuestas',
      hasSubmenu: true,
      icon: FaUsers,
      description: 'Participa y opina',
      submenu: [
        { label: 'Encuestas', path: '/encuestas', icon: FaChartLine },
        { label: 'Foros', path: '/foros', icon: FaComments },
        { label: 'Sesiones', path: '/sesiones', icon: FaList },
        { label: 'Convocatorias', path: '/convocatorias', icon: FaCalendarAlt }
      ]
    },
    {
      label: 'Servicios',
      path: '/tramites',
      hasSubmenu: true,
      icon: FaCog,
      description: 'Trámites y servicios',
      submenu: [
        { label: 'Trámites', path: '/tramites', icon: FaFileAlt },
        { label: 'Galería', path: '/galeria', icon: FaImages },
        { label: 'Contacto', path: '/contacto', icon: FaEnvelope }
      ]
    }
  ];

  const handleMouseEnter = (index) => {
    // Limpiar cualquier timeout existente inmediatamente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // Solo abrir si no hay otro menú activo o si es el mismo
    if (activeMenu === null || activeMenu === index) {
      setActiveMenu(index);
    } else {
      // Si hay otro menú activo, cerrarlo primero con un pequeño delay
      setActiveMenu(null);
      setTimeout(() => {
        setActiveMenu(index);
      }, 100);
    }
  };

  // Actualizar posición del mega-menu cuando cambia activeMenu o se hace scroll
  useEffect(() => {
    if (activeMenu !== null && menuItemRefs.current[activeMenu] && megaMenuRefs.current[activeMenu]) {
      const updatePosition = () => {
        const rect = menuItemRefs.current[activeMenu].getBoundingClientRect();
        if (megaMenuRefs.current[activeMenu]) {
          // Posicionar el mega-menu justo debajo del nav-item
          megaMenuRefs.current[activeMenu].style.top = `${rect.bottom}px`;
        }
      };
      updatePosition();
      window.addEventListener('scroll', updatePosition, { passive: true });
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [activeMenu]);

  const handleMouseLeave = (index) => {
    // Reducir el timeout para cerrar más rápido
    timeoutRef.current = setTimeout(() => {
      // Solo cerrar si el menú activo sigue siendo el mismo
      if (activeMenu === index) {
        setActiveMenu(null);
      }
    }, 150);
  };

  const handleSubmenuClick = () => {
    setActiveMenu(null);
    setFocusedIndex(null);
    setMobileMenuOpen(false);
    setMobileActiveSubmenu(null);
  };

  const handleNavClick = () => {
    setActiveMenu(null);
    setFocusedIndex(null);
    setMobileMenuOpen(false);
    setMobileActiveSubmenu(null);
  };

  const handleMobileSubmenuToggle = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileActiveSubmenu(mobileActiveSubmenu === index ? null : index);
  };

  // Navegación por teclado
  const handleKeyDown = (e, index, hasSubmenu) => {
    const menuItems = menuItemRefs.current;
    
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        if (index < menuItems.length - 1) {
          menuItems[index + 1]?.focus();
          setFocusedIndex(index + 1);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (index > 0) {
          menuItems[index - 1]?.focus();
          setFocusedIndex(index - 1);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (hasSubmenu) {
          setActiveMenu(index);
          const firstSubmenuItem = menuItemRefs.current[index]?.nextElementSibling?.querySelector('.nav-sublink');
          firstSubmenuItem?.focus();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (hasSubmenu && activeMenu === index) {
          setActiveMenu(null);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setActiveMenu(null);
        setFocusedIndex(null);
        menuItems[index]?.blur();
        break;
      case 'Enter':
      case ' ':
        if (hasSubmenu) {
          e.preventDefault();
          setActiveMenu(activeMenu === index ? null : index);
        }
        break;
      default:
        break;
    }
  };

  const handleSubmenuKeyDown = (e, parentIndex, subIndex, submenuLength) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (subIndex < submenuLength - 1) {
          const nextItem = e.target.parentElement.nextElementSibling?.querySelector('.nav-sublink');
          nextItem?.focus();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (subIndex > 0) {
          const prevItem = e.target.parentElement.previousElementSibling?.querySelector('.nav-sublink');
          prevItem?.focus();
        } else {
          menuItemRefs.current[parentIndex]?.focus();
          setActiveMenu(null);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setActiveMenu(null);
        menuItemRefs.current[parentIndex]?.focus();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Cerrar menú móvil cuando cambia la ruta
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileActiveSubmenu(null);
  }, [location.pathname]);

  // Prevenir scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menu-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    };
  }, [mobileMenuOpen]);

  // Detectar scroll para ocultar/mostrar menú en móvil
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Solo aplicar en móvil (ancho <= 768px)
      if (window.innerWidth <= 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down - ocultar menú
          setIsScrolled(true);
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up - mostrar menú
          setIsScrolled(false);
        }
      } else {
        // En desktop, siempre mostrar
        setIsScrolled(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`header ${isScrolled ? 'header-hidden' : ''}`} ref={menuRef}>
      {/* Franja superior delgada */}
      <div className="header-top-bar">
        <div className="top-bar-container">
          <div className="top-bar-left">
            <a 
              href="https://www.gov.co" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="gov-co-logo"
              aria-label="Portal Único del Estado - Gobierno de Colombia"
            >
              <img 
                src={`${process.env.PUBLIC_URL || ''}/images/logoGovCO.png`}
                alt="Gobierno de Colombia"
                className="gov-co-logo-img"
                onError={(e) => {
                  // Intentar con diferentes extensiones
                  const extensions = ['.jpg', '.jpeg', '.svg', '.webp'];
                  const baseName = `${process.env.PUBLIC_URL || ''}/images/logoGovCO`;
                  const currentSrc = e.target.src;
                  const currentExt = currentSrc.substring(currentSrc.lastIndexOf('.'));
                  const currentIndex = extensions.indexOf(currentExt);
                  
                  if (currentIndex < extensions.length - 1) {
                    e.target.src = `${baseName}${extensions[currentIndex + 1]}`;
                  } else {
                    // Fallback a texto si ninguna extensión funciona
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline-block';
                  }
                }}
              />
              <span className="gov-co-logo-text" style={{ display: 'none' }}>GOV.CO</span>
            </a>
            <span className="top-bar-separator">|</span>
            <span className="top-bar-phone">📞 {config.telefono || '+57 (2) XXX-XXXX'}</span>
            <span className="top-bar-separator">|</span>
            <span className="top-bar-email">✉️ {config.email || 'contacto@concejo.guachucal.gov.co'}</span>
          </div>
          <div className="top-bar-right">
            <a href={config.facebook_url || "https://www.facebook.com/p/Concejo-Municipal-de-Guachucal-61555825801735"} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="header-top">
        <div className="header-container">
          <Link to="/" className="header-logo">
            <div className="escudo-colombia-container">
              <img 
                src={`${process.env.PUBLIC_URL || ''}/images/colombia.png`}
                alt="Escudo de Colombia"
                className="escudo-colombia"
                onError={(e) => {
                  // Si no existe la imagen, intentar con diferentes extensiones
                  const extensions = ['.svg', '.jpg', '.jpeg', '.webp'];
                  const baseName = `${process.env.PUBLIC_URL || ''}/images/colombia`;
                  const currentSrc = e.target.src;
                  const currentExt = currentSrc.substring(currentSrc.lastIndexOf('.'));
                  const currentIndex = extensions.indexOf(currentExt);
                  
                  if (currentIndex < extensions.length - 1) {
                    e.target.src = `${baseName}${extensions[currentIndex + 1]}`;
                  } else {
                    // Si ninguna extensión funciona, usar una URL pública del escudo de Colombia
                    e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Escudo_de_Colombia.svg/200px-Escudo_de_Colombia.svg.png';
                  }
                }}
              />
            </div>
            <Escudo />
            <div className="escudo-alcaldia-container">
              <img 
                src={`${process.env.PUBLIC_URL || ''}/images/alcaldia.png`}
                alt="Escudo de la Alcaldía de Guachucal"
                className="escudo-alcaldia"
                onError={(e) => {
                  // Si no existe la imagen, intentar con diferentes extensiones
                  const extensions = ['.png', '.jpeg', '.webp', '.svg'];
                  const baseName = `${process.env.PUBLIC_URL || ''}/images/alcaldia`;
                  const currentSrc = e.target.src;
                  const currentExt = currentSrc.substring(currentSrc.lastIndexOf('.'));
                  const currentIndex = extensions.indexOf(currentExt);
                  
                  if (currentIndex < extensions.length - 1) {
                    e.target.src = `${baseName}${extensions[currentIndex + 1]}`;
                  } else {
                    e.target.style.display = 'none';
                  }
                }}
              />
            </div>
            <LogoTexto />
          </Link>
          <div className="header-datetime-wrapper">
            <div className="header-datetime">
              <FaClock />
              <div className="header-datetime-content">
                <span className="header-fecha">{fechaHora.fecha}</span>
                <span className="header-hora">{fechaHora.hora}</span>
              </div>
            </div>
          </div>
          <div className="header-contact">
            <Link to="/busqueda" className="header-search-btn" aria-label="Búsqueda avanzada">
              🔍
            </Link>
            <LanguageSelector />
          </div>
        </div>
      </div>
      <nav className="header-nav">
        <div className="nav-container">
          {/* Botón hamburguesa solo para móvil */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          
          {/* Menú desktop - funciona con hover */}
          <ul className="nav-menu">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`nav-item ${item.hasSubmenu ? 'has-submenu' : ''} ${location.pathname === item.path ? 'active' : ''}`}
              >
                <Link 
                  to={item.path} 
                  className="nav-link"
                  ref={el => menuItemRefs.current[index] = el}
                  onKeyDown={(e) => handleKeyDown(e, index, item.hasSubmenu)}
                  onClick={handleNavClick}
                  onFocus={() => setFocusedIndex(index)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                >
                  {item.icon && <item.icon className="nav-link-icon" />}
                  <span className="nav-link-text">{item.label}</span>
                </Link>
                {item.hasSubmenu && (
                  <div 
                    ref={el => megaMenuRefs.current[index] = el}
                    className={`mega-menu ${activeMenu === index ? 'active' : ''}`}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      // Cancelar cualquier cierre pendiente inmediatamente
                      if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = null;
                      }
                      // Si hay otro menú activo, cerrarlo primero
                      if (activeMenu !== null && activeMenu !== index) {
                        setActiveMenu(null);
                        setTimeout(() => {
                          setActiveMenu(index);
                        }, 50);
                      } else {
                        // Mantener el menú abierto
                        setActiveMenu(index);
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.stopPropagation();
                      // No cerrar inmediatamente, dar tiempo para mover el mouse
                      handleMouseLeave(index);
                    }}
                    style={{ 
                      pointerEvents: activeMenu === index ? 'auto' : 'none'
                    }}
                  >
                    <div className="mega-menu-content">
                      <div className="mega-menu-header">
                        <div className="mega-menu-icon">
                          {item.icon && <item.icon />}
                        </div>
                        <div>
                          <h3 className="mega-menu-title">{item.label}</h3>
                          {item.description && <p className="mega-menu-description">{item.description}</p>}
                        </div>
                      </div>
                      <div className="mega-menu-grid">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link 
                            key={subIndex}
                            to={subItem.path} 
                            onClick={handleSubmenuClick} 
                            className={`mega-menu-item ${subItem.icon === FaPhone ? 'mega-menu-item-phone' : ''}`}
                            onKeyDown={(e) => handleSubmenuKeyDown(e, index, subIndex, item.submenu.length)}
                          >
                            {subItem.icon && <subItem.icon className="mega-menu-item-icon" />}
                            <span className="mega-menu-item-text">{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Menú móvil - funciona con clics */}
          <ul className={`mobile-nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
            {menuItems.map((item, index) => (
              <li key={index} className="mobile-nav-item">
                {item.hasSubmenu ? (
                  <>
                    <button
                      className={`mobile-nav-link ${mobileActiveSubmenu === index ? 'active' : ''}`}
                      onClick={(e) => handleMobileSubmenuToggle(index, e)}
                    >
                      {item.icon && <item.icon className="mobile-nav-icon" />}
                      <span>{item.label}</span>
                      <span className="mobile-nav-arrow">{mobileActiveSubmenu === index ? <FaTimes /> : <FaBars />}</span>
                    </button>
                    {mobileActiveSubmenu === index && (
                      <ul className="mobile-nav-submenu">
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link 
                              to={subItem.path} 
                              onClick={handleSubmenuClick}
                              className="mobile-nav-sublink"
                            >
                              {subItem.icon && <subItem.icon className="mobile-nav-sublink-icon" />}
                              <span>{subItem.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link 
                    to={item.path} 
                    className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={handleNavClick}
                  >
                    {item.icon && <item.icon className="mobile-nav-icon" />}
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;


