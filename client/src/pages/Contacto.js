import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import './Contacto.css';

const Contacto = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });

  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
      setError('Por favor complete todos los campos obligatorios');
      setLoading(false);
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingrese un email válido');
      setLoading(false);
      return;
    }

    try {
      await api.post('/contacto', formData);
      setEnviado(true);
      
      // Resetear formulario
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
      });
    } catch (err) {
      console.error('Error enviando mensaje de contacto:', err);
      setError(err.response?.data?.error || 'Error al enviar el mensaje. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contacto-page page-container">
      <section className="section">
        <div className="container">
          <div className="page-header">
            <div className="page-header-icon">📧</div>
            <div>
              <h1>Contacto</h1>
              <p>Estamos aquí para ayudarte. Envíanos tu mensaje y te responderemos lo antes posible.</p>
            </div>
          </div>

          <div className="contacto-content-wrapper">
            <div className="contacto-info-section">
              <h2>Información de Contacto</h2>
              <div className="contacto-info-card">
                <div className="contacto-info-item">
                  <span className="contacto-icon">📍</span>
                  <div>
                    <strong>Dirección</strong>
                    <p>Calle Principal, Guachucal, Nariño</p>
                  </div>
                </div>
                <div className="contacto-info-item">
                  <span className="contacto-icon">📞</span>
                  <div>
                    <strong>Teléfono</strong>
                    <p>+57 (2) XXX-XXXX</p>
                  </div>
                </div>
                <div className="contacto-info-item">
                  <span className="contacto-icon">✉️</span>
                  <div>
                    <strong>Correo Electrónico</strong>
                    <p>contacto@concejo.guachucal.gov.co</p>
                  </div>
                </div>
                <div className="contacto-info-item">
                  <span className="contacto-icon">🕐</span>
                  <div>
                    <strong>Horario de Atención</strong>
                    <p>Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="contacto-pqrs-link">
                <h3>¿Tiene alguna petición, queja, reclamo, sugerencia o denuncia?</h3>
                <a href="/pqrsd" className="btn btn-pqrs-link">
                  Envíe su PQRS aquí →
                </a>
              </div>
            </div>

            <div className="contacto-form-section">
              {enviado ? (
                <div className="contacto-success">
                  <div className="success-icon">✓</div>
                  <h2>¡Mensaje Enviado!</h2>
                  <p>Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos a la brevedad posible.</p>
                  <button 
                    onClick={() => setEnviado(false)} 
                    className="btn btn-secondary"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form className="contacto-form" onSubmit={handleSubmit}>
                  <h2>Enviar Mensaje</h2>
                  
                  {error && (
                    <div className="form-error">
                      {error}
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="nombre">Nombre Completo *</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Ingrese su nombre completo"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Correo Electrónico *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="ejemplo@correo.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+57 (2) XXX-XXXX"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="asunto">Asunto *</label>
                    <input
                      type="text"
                      id="asunto"
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleChange}
                      required
                      placeholder="Ingrese el asunto de su mensaje"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="mensaje">Mensaje *</label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      rows="6"
                      required
                      placeholder="Escriba su mensaje aquí..."
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar Mensaje'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacto;
