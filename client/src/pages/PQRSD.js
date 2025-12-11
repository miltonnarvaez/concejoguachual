import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './PQRSD.css';

const PQRSD = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tipo: 'peticion',
    grupo_interes: 'general',
    nombre: '',
    documento: '',
    email: '',
    telefono: '',
    asunto: '',
    descripcion: '',
    aceptaTerminos: false
  });

  const [enviado, setEnviado] = useState(false);
  const [numeroRadicado, setNumeroRadicado] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.aceptaTerminos) {
      setError('Debe aceptar la Política de Privacidad y el Tratamiento de Datos Personales');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/pqrsd', {
        tipo: formData.tipo,
        grupo_interes: formData.grupo_interes || 'general',
        nombre: formData.nombre,
        documento: formData.documento,
        email: formData.email,
        telefono: formData.telefono || null,
        asunto: formData.asunto,
        descripcion: formData.descripcion
      });

      setNumeroRadicado(response.data.numero_radicado);
      setEnviado(true);
      
      // Resetear formulario
      setFormData({
        tipo: 'peticion',
        grupo_interes: 'general',
        nombre: '',
        documento: '',
        email: '',
        telefono: '',
        asunto: '',
        descripcion: '',
        aceptaTerminos: false
      });
    } catch (err) {
      console.error('Error enviando PQRSD:', err);
      setError(err.response?.data?.error || 'Error al enviar la solicitud. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pqrsd-page">
      <section className="section">
        <div className="container">
          <h1 className="page-title">PQRSD - Peticiones, Quejas, Reclamos, Sugerencias y Denuncias</h1>
          
          <div className="pqrsd-consulta-link" style={{
            background: '#e7f3ff',
            border: '1px solid #b3d9ff',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <strong>¿Ya tiene un número de radicado?</strong>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95em', color: '#666' }}>
                Consulte el estado de su solicitud ingresando su número de radicado
              </p>
            </div>
            <Link 
              to="/pqrsd/consulta" 
              className="btn btn-secondary"
              style={{ whiteSpace: 'nowrap' }}
            >
              🔍 Consultar Estado
            </Link>
          </div>
          
          <div className="pqrsd-info">
            <p>
              De acuerdo con la <strong>Ley 1712 de 2014</strong> (Ley de Transparencia y del Derecho de Acceso a la Información Pública Nacional), 
              usted tiene derecho a presentar solicitudes de información, peticiones, quejas, reclamos, sugerencias y denuncias.
            </p>
            <p>
              <strong>Plazos de respuesta:</strong>
            </p>
            <ul>
              <li><strong>Peticiones:</strong> 15 días hábiles</li>
              <li><strong>Quejas y Reclamos:</strong> 15 días hábiles</li>
              <li><strong>Sugerencias:</strong> Respuesta según corresponda</li>
              <li><strong>Denuncias:</strong> Según la naturaleza del caso</li>
            </ul>
          </div>

          {error && (
            <div className="pqrsd-error" style={{ 
              background: '#fee', 
              border: '1px solid #fcc', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginBottom: '1rem',
              color: '#c33'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {enviado ? (
            <div className="pqrsd-success">
              <h2>✓ Solicitud Enviada</h2>
              <p>Su solicitud ha sido recibida correctamente. Le responderemos en el plazo establecido por la ley.</p>
              <p><strong>Número de radicado:</strong> <span style={{ fontSize: '1.2em', color: '#155724' }}>{numeroRadicado}</span></p>
              <p style={{ marginTop: '1rem' }}>
                <strong>Importante:</strong> Guarde este número de radicado para consultar el estado de su solicitud.
              </p>
              <div style={{ marginTop: '1.5rem' }}>
                <button 
                  onClick={() => navigate(`/pqrsd/consulta/${numeroRadicado}`)}
                  className="btn btn-secondary"
                  style={{ marginRight: '1rem' }}
                >
                  Consultar Estado
                </button>
                <button 
                  onClick={() => {
                    setEnviado(false);
                    setNumeroRadicado('');
                  }}
                  className="btn"
                >
                  Enviar Otra Solicitud
                </button>
              </div>
            </div>
          ) : (
            <form className="pqrsd-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="tipo">Tipo de Solicitud *</label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="peticion">Petición</option>
                  <option value="queja">Queja</option>
                  <option value="reclamo">Reclamo</option>
                  <option value="sugerencia">Sugerencia</option>
                  <option value="denuncia">Denuncia</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="grupo_interes">Grupo de Interés</label>
                <select
                  id="grupo_interes"
                  name="grupo_interes"
                  value={formData.grupo_interes}
                  onChange={handleChange}
                >
                  <option value="general">General</option>
                  <option value="dupla_naranja">Dupla Naranja (Mujeres)</option>
                  <option value="adultos_mayores">Adultos Mayores</option>
                  <option value="jovenes">Jóvenes</option>
                  <option value="personas_discapacidad">Personas con Discapacidad</option>
                  <option value="comunidades_etnicas">Comunidades Étnicas</option>
                  <option value="empresarios">Empresarios</option>
                </select>
                <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
                  Seleccione el grupo de interés al que pertenece (opcional)
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="nombre">Nombre Completo *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="documento">Número de Documento *</label>
                  <input
                    type="text"
                    id="documento"
                    name="documento"
                    value={formData.documento}
                    onChange={handleChange}
                    required
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
                  />
                </div>
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
                />
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción Detallada *</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="6"
                  required
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="aceptaTerminos"
                    checked={formData.aceptaTerminos}
                    onChange={handleChange}
                    required
                  />
                  Acepto la <a href="/politica-privacidad" target="_blank">Política de Privacidad</a> y 
                  el <a href="/tratamiento-datos" target="_blank">Tratamiento de Datos Personales</a> *
                </label>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </form>
          )}

          <div className="pqrsd-contact">
            <h3>Información de Contacto</h3>
            <p>
              <strong>Correo electrónico:</strong> contacto@concejo.guachucal.gov.co<br />
              <strong>Teléfono:</strong> +57 (2) XXX-XXXX<br />
              <strong>Dirección:</strong> Calle Principal, Guachucal, Nariño<br />
              <strong>Horario de atención:</strong> Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PQRSD;



