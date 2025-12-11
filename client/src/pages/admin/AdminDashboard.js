import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="container">
          <h1>Panel de Administración</h1>
          <div className="dashboard-user">
            <span>Bienvenido, {user?.nombre || user?.email}</span>
            <button onClick={logout} className="btn btn-secondary">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          <div className="dashboard-grid">
            <Link to="/admin/noticias" className="dashboard-card">
              <h2>📰 Noticias</h2>
              <p>Gestionar noticias y publicaciones</p>
            </Link>
            <Link to="/admin/convocatorias" className="dashboard-card">
              <h2>📢 Convocatorias</h2>
              <p>Gestionar convocatorias y anuncios</p>
            </Link>
            <Link to="/admin/gaceta" className="dashboard-card">
              <h2>📄 Gaceta</h2>
              <p>Gestionar documentos de gaceta</p>
            </Link>
            <Link to="/admin/transparencia" className="dashboard-card">
              <h2>🔍 Transparencia</h2>
              <p>Gestionar documentos de transparencia</p>
            </Link>
            <Link to="/admin/sesiones" className="dashboard-card">
              <h2>📋 Sesiones</h2>
              <p>Gestionar sesiones del concejo</p>
            </Link>
            <Link to="/admin/autoridades" className="dashboard-card">
              <h2>👥 Autoridades</h2>
              <p>Gestionar autoridades del concejo</p>
            </Link>
            <Link to="/admin/configuracion" className="dashboard-card">
              <h2>⚙️ Configuración</h2>
              <p>Configuración del sitio</p>
            </Link>
            <Link to="/admin/usuarios" className="dashboard-card">
              <h2>👤 Usuarios</h2>
              <p>Gestionar usuarios y permisos</p>
            </Link>
            <Link to="/admin/pqrsd" className="dashboard-card">
              <h2>📝 PQRSD</h2>
              <p>Gestionar peticiones, quejas, reclamos, sugerencias y denuncias</p>
            </Link>
            <Link to="/admin/galeria" className="dashboard-card">
              <h2>📸 Galería</h2>
              <p>Gestionar fotografías y videos</p>
            </Link>
            <Link to="/admin/encuestas" className="dashboard-card">
              <h2>📊 Encuestas</h2>
              <p>Gestionar encuestas ciudadanas</p>
            </Link>
            <Link to="/admin/historia" className="dashboard-card">
              <h2>📜 Historia</h2>
              <p>Gestionar historia del Concejo</p>
            </Link>
            <Link to="/admin/tramites" className="dashboard-card">
              <h2>📋 Trámites</h2>
              <p>Gestionar trámites del Concejo</p>
            </Link>
            <Link to="/admin/opiniones" className="dashboard-card">
              <h2>💬 Opiniones</h2>
              <p>Gestionar opiniones sobre proyectos</p>
            </Link>
            <Link to="/admin/foros" className="dashboard-card">
              <h2>🗣️ Foros</h2>
              <p>Gestionar foros de discusión</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


