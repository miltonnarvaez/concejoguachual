import React from 'react';

// Icono de Alcaldía - Edificio verde oscuro
export const AlcaldiaIcon = ({ width = 50, height = 50 }) => (
  <svg width={width} height={height} viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="20" width="30" height="25" fill="#155724" rx="2"/>
    <rect x="15" y="25" width="5" height="5" fill="#fff" opacity="0.8"/>
    <rect x="22" y="25" width="5" height="5" fill="#fff" opacity="0.8"/>
    <rect x="30" y="25" width="5" height="5" fill="#fff" opacity="0.8"/>
    <rect x="15" y="32" width="5" height="5" fill="#fff" opacity="0.8"/>
    <rect x="22" y="32" width="5" height="5" fill="#fff" opacity="0.8"/>
    <rect x="30" y="32" width="5" height="5" fill="#fff" opacity="0.8"/>
    <rect x="20" y="12" width="10" height="8" fill="#155724" rx="1"/>
  </svg>
);

// Icono de Contraloría - Círculo rojo con círculo amarillo y letra C
export const ContraloriaIcon = ({ width = 50, height = 50 }) => (
  <svg width={width} height={height} viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="25" r="22" fill="none" stroke="#dc3545" strokeWidth="3"/>
    <circle cx="25" cy="25" r="16" fill="#ffc107"/>
    <text x="25" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#fff" fontFamily="Arial, sans-serif">C</text>
  </svg>
);

// Icono de Colombia Compra - Código de barras y bandera
export const ColombiaCompraIcon = ({ width = 50, height = 50 }) => (
  <svg width={width} height={height} viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="10" width="3" height="30" fill="#000"/>
    <rect x="13" y="10" width="2" height="30" fill="#000"/>
    <rect x="17" y="10" width="3" height="30" fill="#000"/>
    <rect x="22" y="10" width="1.5" height="30" fill="#000"/>
    <rect x="25" y="10" width="3" height="30" fill="#000"/>
    <rect x="30" y="10" width="2" height="30" fill="#000"/>
    <rect x="35" y="10" width="2.5" height="30" fill="#000"/>
    <rect x="40" y="10" width="6" height="10" fill="#FFCD00"/>
    <rect x="40" y="20" width="6" height="10" fill="#003893"/>
    <rect x="40" y="30" width="6" height="10" fill="#CE1126"/>
  </svg>
);

// Icono de Urna de Cristal - Cubo azul translúcido
export const UrnaCristalIcon = ({ width = 50, height = 50 }) => (
  <svg width={width} height={height} viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="crystalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2a7a3f" stopOpacity="0.9"/>
        <stop offset="50%" stopColor="#87CEEB" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#B0E0E6" stopOpacity="0.9"/>
      </linearGradient>
    </defs>
    <rect x="15" y="20" width="20" height="20" fill="url(#crystalGradient)" stroke="#1d5c2f" strokeWidth="1.5" rx="2"/>
    <path d="M 15 20 L 25 12 L 45 12 L 35 20 Z" fill="#87CEEB" opacity="0.8" stroke="#1d5c2f" strokeWidth="1.5"/>
    <path d="M 35 20 L 45 12 L 45 32 L 35 40 Z" fill="#2a7a3f" opacity="0.7" stroke="#1d5c2f" strokeWidth="1.5"/>
    <line x1="25" y1="20" x2="25" y2="40" stroke="#1d5c2f" strokeWidth="1" opacity="0.6"/>
    <line x1="15" y1="30" x2="35" y2="30" stroke="#1d5c2f" strokeWidth="1" opacity="0.6"/>
  </svg>
);

// Icono de Contratación Pública - Documento verde con esquina doblada
export const ContratacionPublicaIcon = ({ width = 50, height = 50 }) => (
  <svg width={width} height={height} viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="10" width="26" height="32" fill="#155724" rx="1"/>
    <path d="M 35 10 L 38 13 L 35 13 Z" fill="#28a745" opacity="0.8"/>
    <line x1="18" y1="20" x2="32" y2="20" stroke="#fff" strokeWidth="1.5" opacity="0.9"/>
    <line x1="18" y1="25" x2="32" y2="25" stroke="#fff" strokeWidth="1.5" opacity="0.9"/>
    <path d="M 18 32 Q 20 30, 22 32 T 26 32 T 30 32" stroke="#fff" strokeWidth="2" fill="none" opacity="0.9"/>
  </svg>
);

// Icono de Gobierno Digital - Cuadrado azul con letras GD
export const GobiernoDigitalIcon = ({ width = 50, height = 50 }) => (
  <svg width={width} height={height} viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="30" height="30" fill="#0056b3" rx="3"/>
    <text x="25" y="32" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#fff" fontFamily="Arial, sans-serif">GD</text>
  </svg>
);



