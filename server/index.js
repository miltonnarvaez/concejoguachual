const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/noticias', require('./routes/noticias'));
app.use('/api/convocatorias', require('./routes/convocatorias'));
app.use('/api/gaceta', require('./routes/gaceta'));
app.use('/api/transparencia', require('./routes/transparencia'));
app.use('/api/sesiones', require('./routes/sesiones'));
app.use('/api/autoridades', require('./routes/autoridades'));
app.use('/api/configuracion', require('./routes/configuracion'));
app.use('/api/pqrsd', require('./routes/pqrsd'));
app.use('/api/datos-abiertos', require('./routes/datosAbiertos'));
app.use('/api/galeria', require('./routes/galeria'));
app.use('/api/encuestas', require('./routes/encuestas'));
app.use('/api/historia', require('./routes/historia'));
app.use('/api/tramites', require('./routes/tramites'));
app.use('/api/busqueda', require('./routes/busqueda'));
app.use('/api/opiniones', require('./routes/opiniones'));
app.use('/api/foros', require('./routes/foros'));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API del Concejo Municipal de Guachucal',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      noticias: '/api/noticias',
      convocatorias: '/api/convocatorias',
      gaceta: '/api/gaceta',
      transparencia: '/api/transparencia',
      sesiones: '/api/sesiones',
      configuracion: '/api/configuracion'
    }
  });
});

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API del Concejo Municipal de Guachucal',
    version: '1.0.0'
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 Base de datos: ${process.env.DB_NAME || 'concejo_guachucal'}`);
});


