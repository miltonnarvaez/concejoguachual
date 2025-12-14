import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import './AnimatedSection.css';

const AnimatedSection = ({ children, className = '', animationType = 'fadeInUp', id, ...props }) => {
  const [ref, isIntersecting, hasIntersected] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  const animationClass = hasIntersected ? `animate-${animationType}` : '';
  const combinedClassName = `animated-section ${animationClass} ${className}`.trim();

  return (
    <section
      ref={ref}
      id={id}
      className={combinedClassName}
      {...props}
    >
      {children}
    </section>
  );
};

export default AnimatedSection;
