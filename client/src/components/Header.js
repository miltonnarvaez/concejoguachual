import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import Escudo from './Escudo';
import LogoTexto from './LogoTexto';
import TexturePattern from './TexturePattern';
import api from '../services/api';
import './Header.css';

const Header = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);
  const menuItemRefs = useRef([]);

  const { data: config = {} } = useQuery({
    queryKey: ['configuracion'],
    queryFn: async () => {
      const response = await api.get('/configuracion');
      return response.data;
    }
  });

  const menuItems = [
    {
      label: t('menu.inicio'),
      path: '/',
      hasSubmenu: false
    },
    {
      label: t('menu.acerca'),
      path: '/acerca',
      hasSubmenu: true,
      submenu: [
        { label: '🎯 Misión', path: '/acerca#mision' },
        { label: '🌟 Visión', path: '/acerca#vision' },
        { label: '👥 Autoridades', path: '/acerca#autoridades' },
        { label: '📜 Historia', path: '/acerca#historia' },
        { label: '📞 Contacto', path: '/acerca#contacto' },
        { label: '🏛️ Símbolos', path: '/acerca#simbolos' }
      ]
    },
    {
      label: t('menu.noticias'),
      path: '/noticias',
      hasSubmenu: true,
      submenu: [
        { label: '📰 Todas las Noticias', path: '/noticias' },
        { label: '📄 Noticias Generales', path: '/noticias?categoria=Noticias' },
        { label: '📋 Sesiones del Concejo', path: '/noticias?categoria=Sesiones' },
        { label: '📜 Acuerdos y Resoluciones', path: '/noticias?categoria=Acuerdos' },
        { label: '📢 Comunicados Oficiales', path: '/noticias?categoria=Comunicados' },
        { label: '🎉 Eventos y Actividades', path: '/noticias?categoria=Eventos' },
        { label: '🏛️ Institucional', path: '/noticias?categoria=Institucional' }
      ]
    },
    {
      label: t('menu.convocatorias'),
      path: '/convocatorias',
      hasSubmenu: false
    },
    {
      label: t('menu.gaceta'),
      path: '/gaceta',
      hasSubmenu: true,
      submenu: [
        { label: '📄 ACUERDOS', path: '/gaceta?tipo=acuerdo' },
        { label: '📋 ACTAS DE SESIÓN', path: '/gaceta?tipo=acta' },
        { label: '📜 DECRETOS', path: '/gaceta?tipo=decreto' },
        { label: '📝 PROYECTOS', path: '/gaceta?tipo=proyecto' },
        { label: '📚 MANUALES', path: '/gaceta?tipo=manual' },
        { label: '⚖️ LEYES', path: '/gaceta?tipo=ley' },
        { label: '📋 POLÍTICAS', path: '/gaceta?tipo=politica' }
      ]
    },
    {
      label: 'Sesiones',
      path: '/sesiones',
      hasSubmenu: false
    },
    {
      label: t('menu.transparencia'),
      path: '/transparencia',
      hasSubmenu: true,
      submenu: [
        { label: '💰 Presupuesto', path: '/transparencia?categoria=presupuesto' },
        { label: '📋 Contratación Pública', path: '/transparencia?categoria=contratacion' },
        { label: '📊 Plan Anual de Compras', path: '/transparencia?categoria=plan_compras' },
        { label: '📈 Rendición de Cuentas', path: '/transparencia?categoria=rendicion_cuentas' },
        { label: '💵 Estados Financieros', path: '/transparencia?categoria=estados_financieros' },
        { label: '🔍 Control Interno', path: '/transparencia?categoria=control_interno' },
        { label: '📑 Declaración de Renta', path: '/transparencia?categoria=declaracion_renta' },
        { label: '🏢 Estructura Organizacional', path: '/transparencia?categoria=estructura_organizacional' },
        { label: '📐 Plan de Desarrollo', path: '/transparencia?categoria=plan_desarrollo' },
        { label: '⚖️ Normatividad', path: '/transparencia?categoria=normatividad' },
        { label: '👥 Servicios Ciudadanos', path: '/transparencia?categoria=servicios_ciudadanos' },
        { label: '🔎 Auditorías', path: '/transparencia?categoria=auditorias' },
        { label: '🏛️ Bienes Inmuebles', path: '/transparencia?categoria=bienes_inmuebles' },
        { label: '👤 Personal', path: '/transparencia?categoria=personal' }
      ]
    },
    {
      label: 'Galería',
      path: '/galeria',
      hasSubmenu: true,
      submenu: [
        { label: '📸 Todas', path: '/galeria' },
        { label: '📋 Sesiones', path: '/galeria?categoria=sesiones' },
        { label: '🎉 Eventos', path: '/galeria?categoria=eventos' },
        { label: '👥 Autoridades', path: '/galeria?categoria=autoridades' },
        { label: '🏛️ Actividades', path: '/galeria?categoria=actividades' },
        { label: '📸 Otros', path: '/galeria?categoria=otros' }
      ]
    },
    {
      label: 'Encuestas',
      path: '/encuestas',
      hasSubmenu: false
    },
    {
      label: 'Trámites',
      path: '/tramites',
      hasSubmenu: false
    },
    {
      label: 'Foros',
      path: '/foros',
      hasSubmenu: false
    },
    {
      label: t('menu.contacto'),
      path: '/#contacto',
      hasSubmenu: false
    }
  ];

  const handleMouseEnter = (index) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMenu(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  const handleSubmenuClick = () => {
    setActiveMenu(null);
    setFocusedIndex(null);
    // Scroll al top después de un pequeño delay para permitir la navegación
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleNavClick = () => {
    // Scroll al top cuando se hace clic en un enlace del menú principal
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
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
      <TexturePattern />
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
                src="/images/logoGovCO.png" 
                alt="Gobierno de Colombia"
                className="gov-co-logo-img"
                onError={(e) => {
                  // Intentar con diferentes extensiones
                  const extensions = ['.jpg', '.jpeg', '.svg', '.webp'];
                  const baseName = '/images/logoGovCO';
                  const currentSrc = e.target.src;
                  const currentExt = currentSrc.substring(currentSrc.lastIndexOf('.'));
                  const currentIndex = extensions.indexOf(currentExt);
                  
                  if (currentIndex < extensions.length - 1) {
                    e.target.src = baseName + extensions[currentIndex + 1];
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
            <Escudo />
            <LogoTexto />
          </Link>
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
          <ul className="nav-menu">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''} ${activeMenu === index ? 'active-menu' : ''}`}
                onMouseEnter={() => item.hasSubmenu && handleMouseEnter(index)}
                onMouseLeave={() => item.hasSubmenu && handleMouseLeave()}
              >
                <Link 
                  to={item.path} 
                  className="nav-link"
                  ref={el => menuItemRefs.current[index] = el}
                  onKeyDown={(e) => handleKeyDown(e, index, item.hasSubmenu)}
                  onClick={handleNavClick}
                  onFocus={() => setFocusedIndex(index)}
                  aria-haspopup={item.hasSubmenu ? 'true' : undefined}
                  aria-expanded={item.hasSubmenu ? (activeMenu === index ? 'true' : 'false') : undefined}
                >
                  {item.label}
                </Link>
                {item.hasSubmenu && activeMenu === index && (
                  <ul 
                    className="nav-submenu" 
                    onMouseEnter={() => handleMouseEnter(index)} 
                    onMouseLeave={handleMouseLeave}
                    role="menu"
                  >
                    {item.submenu.map((subItem, subIndex) => (
                      <li key={subIndex} role="none">
                        <Link 
                          to={subItem.path} 
                          onClick={handleSubmenuClick} 
                          className="nav-sublink"
                          onKeyDown={(e) => handleSubmenuKeyDown(e, index, subIndex, item.submenu.length)}
                          role="menuitem"
                        >
                          {subItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
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


