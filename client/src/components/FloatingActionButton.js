import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEnvelope, FaFileAlt, FaComments, FaTimes } from 'react-icons/fa';
import './FloatingActionButton.css';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: FaEnvelope, label: 'Contacto', path: '/contacto', color: '#155724' },
    { icon: FaFileAlt, label: 'PQRSD', path: '/pqrsd', color: '#28a745' },
    { icon: FaComments, label: 'Opiniones', path: '/opiniones', color: '#48d66a' }
  ];

  return (
    <div className="fab-container">
      <div className={`fab-menu ${isOpen ? 'open' : ''}`}>
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className="fab-action"
            style={{ 
              '--delay': `${index * 0.1}s`,
              '--action-color': action.color
            }}
            onClick={() => setIsOpen(false)}
          >
            <action.icon />
            <span className="fab-label">{action.label}</span>
          </Link>
        ))}
      </div>
      <button
        className={`fab-button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Acciones rápidas"
        aria-expanded={isOpen}
      >
        {isOpen ? <FaTimes style={{ display: 'block' }} /> : <FaPlus style={{ display: 'block' }} />}
      </button>
    </div>
  );
};

export default FloatingActionButton;



