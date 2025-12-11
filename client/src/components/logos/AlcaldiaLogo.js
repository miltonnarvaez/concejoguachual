import React from 'react';

const AlcaldiaLogo = ({ width = 70, height = 70 }) => {
  return (
    <img 
      src="/images/escudo.png" 
      alt="Alcaldía de Guachucal"
      width={width}
      height={height}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default AlcaldiaLogo;




