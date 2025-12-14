import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import AccessibilityBar from './components/AccessibilityBar';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopOnNavigate from './components/ScrollToTopOnNavigate';

// Páginas públicas
import Home from './pages/Home';
import Acerca from './pages/Acerca';
import Noticias from './pages/Noticias';
import NoticiaDetalle from './pages/NoticiaDetalle';
import Convocatorias from './pages/Convocatorias';
import ConvocatoriaDetalle from './pages/ConvocatoriaDetalle';
import Gaceta from './pages/Gaceta';
import GacetaDetalle from './pages/GacetaDetalle';
import Transparencia from './pages/Transparencia';
import Galeria from './pages/Galeria';
import Encuestas from './pages/Encuestas';
import EncuestaDetalle from './pages/EncuestaDetalle';
import Sesiones from './pages/Sesiones';
import SesionDetalle from './pages/SesionDetalle';
import PQRSD from './pages/PQRSD';
import PQRSDConsulta from './pages/PQRSDConsulta';
import DatosAbiertos from './pages/DatosAbiertos';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import TratamientoDatos from './pages/TratamientoDatos';
import MapaSitio from './pages/MapaSitio';
import Busqueda from './pages/Busqueda';

// Páginas de administración
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNoticias from './pages/admin/AdminNoticias';
import AdminConvocatorias from './pages/admin/AdminConvocatorias';
import AdminGaceta from './pages/admin/AdminGaceta';
import AdminConfiguracion from './pages/admin/AdminConfiguracion';
import AdminTransparencia from './pages/admin/AdminTransparencia';
import AdminSesiones from './pages/admin/AdminSesiones';
import AdminAutoridades from './pages/admin/AdminAutoridades';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminPQRSD from './pages/admin/AdminPQRSD';
import AdminGaleria from './pages/admin/AdminGaleria';
import AdminEncuestas from './pages/admin/AdminEncuestas';
import AdminHistoria from './pages/admin/AdminHistoria';
import AdminTramites from './pages/admin/AdminTramites';
import AdminOpiniones from './pages/admin/AdminOpiniones';
import AdminForos from './pages/admin/AdminForos';
import Tramites from './pages/Tramites';
import Foros from './pages/Foros';
import ForoDetalle from './pages/ForoDetalle';
import Contacto from './pages/Contacto';

function App() {
  return (
    <div className="App">
      <ScrollToTopOnNavigate />
      <AccessibilityBar />
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/acerca" element={<Acerca />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/noticias/:id" element={<NoticiaDetalle />} />
          <Route path="/convocatorias" element={<Convocatorias />} />
          <Route path="/convocatorias/:id" element={<ConvocatoriaDetalle />} />
          <Route path="/gaceta" element={<Gaceta />} />
          <Route path="/gaceta/:id" element={<GacetaDetalle />} />
          <Route path="/transparencia" element={<Transparencia />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/encuestas" element={<Encuestas />} />
          <Route path="/encuestas/:id" element={<EncuestaDetalle />} />
          <Route path="/encuestas/:id/resultados" element={<EncuestaDetalle />} />
          <Route path="/sesiones" element={<Sesiones />} />
          <Route path="/sesiones/:id" element={<SesionDetalle />} />
          <Route path="/foros" element={<Foros />} />
          <Route path="/foros/:id" element={<ForoDetalle />} />
          <Route path="/pqrsd" element={<PQRSD />} />
          <Route path="/pqrsd/consulta/:numeroRadicado?" element={<PQRSDConsulta />} />
          <Route path="/datos-abiertos" element={<DatosAbiertos />} />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/tratamiento-datos" element={<TratamientoDatos />} />
          <Route path="/mapa-sitio" element={<MapaSitio />} />
          <Route path="/busqueda" element={<Busqueda />} />
          <Route path="/contacto" element={<Contacto />} />
          
          {/* Rutas de administración */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/noticias"
            element={
              <ProtectedRoute>
                <AdminNoticias />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/convocatorias"
            element={
              <ProtectedRoute>
                <AdminConvocatorias />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gaceta"
            element={
              <ProtectedRoute>
                <AdminGaceta />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/transparencia"
            element={
              <ProtectedRoute>
                <AdminTransparencia />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sesiones"
            element={
              <ProtectedRoute>
                <AdminSesiones />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/autoridades"
            element={
              <ProtectedRoute>
                <AdminAutoridades />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/configuracion"
            element={
              <ProtectedRoute>
                <AdminConfiguracion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute>
                <AdminUsuarios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pqrsd"
            element={
              <ProtectedRoute>
                <AdminPQRSD />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/galeria"
            element={
              <ProtectedRoute>
                <AdminGaleria />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/encuestas"
            element={
              <ProtectedRoute>
                <AdminEncuestas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/historia"
            element={
              <ProtectedRoute>
                <AdminHistoria />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tramites"
            element={
              <ProtectedRoute>
                <AdminTramites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/opiniones"
            element={
              <ProtectedRoute>
                <AdminOpiniones />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/foros"
            element={
              <ProtectedRoute>
                <AdminForos />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;


