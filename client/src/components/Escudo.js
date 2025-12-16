import React from 'react';
import './Escudo.css';

const Escudo = () => {
  const imagePath = `${process.env.PUBLIC_URL || ''}/images/escudo.png`;
  
  return (
    <div className="escudo-container">
      <img
        src={imagePath}
        alt="Escudo del Concejo Municipal de Guachucal"
        className="escudo-image"
        onError={(e) => {
          console.error('Error cargando escudo:', imagePath);
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
};

export default Escudo;


