import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import './AnimatedSection.css';

const AnimatedSection = ({ 
  children, 
  className = '', 
  animationType = 'fadeInUp',
  delay = 0,
  id,
  ...props
}) => {
  const [ref, isIntersecting, hasIntersected] = useIntersectionObserver();

  return (
    <section
      ref={ref}
      id={id}
      className={`animated-section ${className} ${hasIntersected ? `animate-${animationType}` : ''}`}
      style={{ 
        animationDelay: `${delay}ms`,
        opacity: hasIntersected ? 1 : 0
      }}
      {...props}
    >
      {children}
    </section>
  );
};

export default AnimatedSection;

