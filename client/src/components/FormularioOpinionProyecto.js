import React, { useState } from 'react';
import api from '../services/api';
import './FormularioOpinionProyecto.css';

const FormularioOpinionProyecto = ({ proyectoId, proyectoTitulo, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    documento: '',
    email: '',
    telefono: '',
    organizacion: '',
    tipo_organizacion: 'ciudadano',
    opinion: '',
    argumentos: '',
    sugerencias: ''
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

    if (!formData.nombre || !formData.documento || !formData.email || !formData.opinion) {
      setError('Por favor complete todos los campos obligatorios');
      setLoading(false);
      return;
    }

    try {
      await api.post('/opiniones', {
        proyecto_id: proyectoId,
        ...formData
      });

      setEnviado(true);
      if (onSuccess) onSuccess();
      
      // Resetear formulario
      setFormData({
        nombre: '',
        documento: '',
        email: '',
        telefono: '',
        organizacion: '',
        tipo_organizacion: 'ciudadano',
        opinion: '',
        argumentos: '',
        sugerencias: ''
      });
    } catch (err) {
      console.error('Error enviando opinión:', err);
      setError(err.response?.data?.error || 'Error al enviar la opinión. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <div className="opinion-success">
        <h3>✓ Opinión Enviada</h3>
        <p>Su opinión ha sido registrada y será revisada antes de su publicación.</p>
        <button onClick={() => setEnviado(false)} className="btn">
          Enviar Otra Opinión
        </button>
      </div>
    );
  }

  return (
    <form className="formulario-opinion" onSubmit={handleSubmit}>
      <h3>Dar su Opinión sobre este Proyecto</h3>
      <p className="opinion-subtitle">Su opinión es importante para nosotros</p>

      {error && (
        <div className="opinion-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="form-row">
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
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email *</label>
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

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tipo_organizacion">Tipo</label>
          <select
            id="tipo_organizacion"
            name="tipo_organizacion"
            value={formData.tipo_organizacion}
            onChange={handleChange}
          >
            <option value="ciudadano">Ciudadano</option>
            <option value="organizacion">Organización</option>
            <option value="empresa">Empresa</option>
            <option value="ong">ONG</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="organizacion">Organización (si aplica)</label>
          <input
            type="text"
            id="organizacion"
            name="organizacion"
            value={formData.organizacion}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="opinion">Su Opinión *</label>
        <textarea
          id="opinion"
          name="opinion"
          value={formData.opinion}
          onChange={handleChange}
          rows="5"
          required
          placeholder="Exprese su opinión sobre este proyecto..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="argumentos">Argumentos (opcional)</label>
        <textarea
          id="argumentos"
          name="argumentos"
          value={formData.argumentos}
          onChange={handleChange}
          rows="4"
          placeholder="Presente sus argumentos a favor o en contra..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="sugerencias">Sugerencias (opcional)</label>
        <textarea
          id="sugerencias"
          name="sugerencias"
          value={formData.sugerencias}
          onChange={handleChange}
          rows="4"
          placeholder="Tiene alguna sugerencia para mejorar este proyecto?"
        />
      </div>

      <button type="submit" className="btn" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar Opinión'}
      </button>
    </form>
  );
};

export default FormularioOpinionProyecto;





