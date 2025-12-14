import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Escudo from './Escudo';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();

  const handleLinkClick = () => {
    // Scroll al top cuando se hace clic en un enlace del footer
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Primera fila: Logo y Ubicación */}
        <div className="footer-main">
          <div className="footer-logo-section">
            <div className="footer-logo">
              <Escudo />
              <h3>Concejo Municipal de Guachucal</h3>
              <p>Nariño, Colombia</p>
            </div>
          </div>

          <div className="footer-ubicacion">
            <h4>Ubicación</h4>
            <p>📍 Calle Principal, Guachucal, Nariño</p>
            <p>📞 +57 (2) XXX-XXXX</p>
            <p>✉️ contacto@concejo.guachucal.gov.co</p>
            <div className="footer-horario">
              <h5>Horarios de Atención</h5>
              <p>Lunes-Viernes: 8:00am - 12:00pm - 2:00pm - 6:00pm</p>
            </div>
          </div>
        </div>

        {/* Segunda fila: Enlaces organizados */}
        <div className="footer-links-section">
          <div className="footer-links-column">
            <h4>Enlaces de Interés</h4>
            <ul className="footer-links">
              <li><a href="https://www.gov.co" target="_blank" rel="noopener noreferrer">gov.co</a></li>
              <li><a href="https://www.guachucal-narino.gov.co" target="_blank" rel="noopener noreferrer">Trámites y servicios</a></li>
              <li><a href="https://www.guachucal-narino.gov.co" target="_blank" rel="noopener noreferrer">Alcaldía de Guachucal</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">Contraloría Municipal de Guachucal</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">Contraloría Municipal</a></li>
            </ul>
          </div>

          <div className="footer-links-column">
            <h4>Enlaces Institucionales</h4>
            <ul className="footer-links">
              <li><a href="https://www.colombiacompra.gov.co" target="_blank" rel="noopener noreferrer">Colombia compra eficiente</a></li>
              <li><a href="https://www.urnadecristal.gov.co" target="_blank" rel="noopener noreferrer">Urna de cristal</a></li>
              <li><a href="https://www.urnadecristal.gov.co" target="_blank" rel="noopener noreferrer">Urna de Cristal</a></li>
              <li><a href="https://www.contratacion.gov.co" target="_blank" rel="noopener noreferrer">Sistema electrónico de contratación pública</a></li>
              <li><a href="https://www.contratacion.gov.co" target="_blank" rel="noopener noreferrer">Contratación Pública</a></li>
              <li><a href="https://www.gobiernodigital.gov.co" target="_blank" rel="noopener noreferrer">Gobierno Digital</a></li>
              <li><a href="https://www.presidencia.gov.co" target="_blank" rel="noopener noreferrer">Presidencia de la República</a></li>
            </ul>
          </div>

          <div className="footer-links-column">
            <h4>Dupla Naranja</h4>
            <p>Ruta de Atención integral para las mujeres</p>
            <a href="#" target="_blank" rel="noopener noreferrer" className="dupla-link">
              Más información →
            </a>
            <div className="footer-social">
              <h5>Síguenos</h5>
              <div className="social-links">
                <a href="https://www.facebook.com/p/Concejo-Municipal-de-Guachucal-61555825801735/?locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <span>📘</span> Facebook
                </a>
                <p className="social-note">
                  Visita nuestra página de Facebook para ver videos de sesiones, 
                  publicaciones y más información actualizada.
                </p>
              </div>
            </div>
          </div>

          <div className="footer-links-column">
            <h4>Notificaciones</h4>
            <p className="footer-nota">
              <strong>Notificaciones Judiciales:</strong><br />
              notificacionesjudiciales@concejo.guachucal.gov.co
            </p>
            <p className="footer-nota-small">
              <em>Nota: Este correo es única y exclusivamente para las notificaciones que permiten acceder a información relacionada con la representación judicial del concejo municipal de guachucal.</em>
            </p>
            <p className="footer-nota-small">
              <Link to="/pqrsd" className="footer-pqrs-link" onClick={handleLinkClick}>
                ¿Tiene alguna comunicación, oficio u otro tipo de requerimiento (PQR)? Haga clic aquí →
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} <strong>Concejo Municipal de Guachucal</strong> - Todos los derechos reservados</p>
          <div className="footer-bottom-links">
            <Link to="/acerca" onClick={handleLinkClick}>Acerca del Concejo</Link>
            <Link to="/noticias" onClick={handleLinkClick}>Noticias</Link>
            <Link to="/contacto" onClick={handleLinkClick}>Contáctenos</Link>
            <Link to="/mapa-sitio" onClick={handleLinkClick}>Mapa del sitio</Link>
            <Link to="/politica-privacidad" onClick={handleLinkClick}>Política de Privacidad</Link>
            <Link to="/tratamiento-datos" onClick={handleLinkClick}>Tratamiento de Datos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


