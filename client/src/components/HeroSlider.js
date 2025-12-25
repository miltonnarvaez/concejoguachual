import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './HeroSlider.css';

const HeroSlider = ({ slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Si no hay slides, usar slides por defecto
  const defaultSlides = [
    {
      id: 1,
      image: `${process.env.PUBLIC_URL || ''}/images/slider1.JPEG`,
    },
    {
      id: 2,
      image: `${process.env.PUBLIC_URL || ''}/images/slider2.jpg`,
    },
    {
      id: 4,
      image: `${process.env.PUBLIC_URL || ''}/images/slider4.jpg`,
    }
  ];

  const slidesToShow = slides.length > 0 ? slides : defaultSlides;

  // Auto-play del slider con tiempos diferentes por slide
  useEffect(() => {
    if (!isAutoPlaying) return;

    let timeoutId;
    const scheduleNext = () => {
      // Tiempo diferente según el slide actual: slider1 (8s), otros (6s)
      const delay = currentSlide === 0 ? 8000 : 6000;
      
      timeoutId = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slidesToShow.length);
        scheduleNext(); // Programar el siguiente cambio
      }, delay);
    };

    scheduleNext();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isAutoPlaying, slidesToShow.length, currentSlide]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Reanudar auto-play después de 10 segundos
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesToShow.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesToShow.length) % slidesToShow.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="hero-slider">
      <div className="slider-container">
        {slidesToShow.map((slide, index) => (
          <div
            key={slide.id || index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img 
              src={slide.image} 
              alt=""
              className="slide-image"
            />
            <div className="slide-overlay"></div>
          </div>
        ))}
      </div>

      {/* Controles de navegación */}
      <button className="slider-nav slider-prev" onClick={prevSlide} aria-label="Slide anterior">
        <FaChevronLeft />
      </button>
      <button className="slider-nav slider-next" onClick={nextSlide} aria-label="Slide siguiente">
        <FaChevronRight />
      </button>

      {/* Indicadores */}
      <div className="slider-indicators">
        {slidesToShow.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;

