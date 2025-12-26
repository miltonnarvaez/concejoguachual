import React, { useState, useEffect, useRef } from 'react';
import Escudo from './Escudo';
import LogoTexto from './LogoTexto';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const hasFinishedRef = useRef(false);
  const animationTimeoutRef = useRef(null);

  useEffect(() => {
    // Iniciar animación de salida después de 2.5 segundos
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(true);
    }, 2500);

    // Ocultar y llamar onFinish después de 3 segundos (2.5s + 0.5s animación)
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
      if (!hasFinishedRef.current && onFinish) {
        hasFinishedRef.current = true;
        onFinish();
      }
    }, 3000);

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      clearTimeout(hideTimeout);
    };
  }, [onFinish]);

  // No renderizar si ya no es visible
  if (!isVisible) return null;

  return (
    <div className={`splash-screen ${isAnimating ? 'fade-out' : 'fade-in'}`}>
      <div className="splash-content">
        <div className="splash-logo">
          <Escudo />
        </div>
        <div className="splash-logo-texto">
          <LogoTexto />
        </div>
      </div>
      {/* Loader de puntos fuera del content para posición fija */}
      <div className="splash-loader">
        <div className="loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;



