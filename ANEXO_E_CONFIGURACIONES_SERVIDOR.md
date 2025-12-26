# ANEXO E: CONFIGURACIONES DEL SERVIDOR
## Portal Web Concejo Municipal de Guachucal

**Fecha:** [Fecha a completar]  
**Proyecto:** Desarrollo e Implementación del Portal Web Institucional

---

## RESUMEN EJECUTIVO

El servidor está completamente configurado y listo para recibir peticiones del dominio institucional `concejodeguachucal.gov.co`. Todas las configuraciones necesarias han sido implementadas y probadas.

---

## CONFIGURACIÓN DE NGINX

### 1. nginx-concejo.conf

**Ubicación:** Raíz del proyecto

**Descripción:** Configuración principal de Nginx para el portal del concejo.

**Características:**
- ✅ Configuración de proxy reverso para API
- ✅ Servicio de archivos estáticos del frontend
- ✅ Configuración de uploads
- ✅ Optimización de caché para imágenes
- ✅ Configuración de logs

**Configuración Principal:**

```nginx
server {
    listen 80;
    server_name concejodeguachucal.gov.co;

    # Frontend (React Build)
    location / {
        root /var/www/concejoguachual/client/build;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Archivos estáticos (uploads)
    location /uploads {
        alias /var/www/concejoguachual/server/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Archivos de imágenes
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        root /var/www/concejoguachual/client/build;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Logs
    access_log /var/log/nginx/concejo_access.log;
    error_log /var/log/nginx/concejo_error.log;
}
```

**Estado:** ✅ **CONFIGURADO Y LISTO**

---

### 2. milton-nginx-ssl.conf

**Ubicación:** Raíz del proyecto

**Descripción:** Configuración de Nginx con SSL/HTTPS habilitado.

**Características:**
- ✅ Redirección HTTP a HTTPS
- ✅ Configuración de certificados SSL
- ✅ Configuración de seguridad mejorada
- ✅ Headers de seguridad

**Estado:** ✅ **CONFIGURADO Y LISTO**

---

### 3. milton-nginx-limpio.conf

**Ubicación:** Raíz del proyecto

**Descripción:** Configuración limpia de Nginx sin comentarios adicionales.

**Estado:** ✅ **CONFIGURADO Y LISTO**

---

## CONFIGURACIÓN DEL SERVIDOR NODE.JS

### server/index.js

**Ubicación:** `server/index.js`

**Características Implementadas:**

#### Seguridad

- ✅ **Helmet** - Headers de seguridad HTTP
  - Content Security Policy configurado
  - Protección contra XSS
  - Protección contra clickjacking

- ✅ **Rate Limiting** - Protección contra ataques
  - Límite de 100 requests por 15 minutos para API general
  - Límite de 5 intentos de login por 15 minutos
  - Mensajes de error personalizados

- ✅ **CORS** - Configuración de origen cruzado
  - Origen configurado desde variables de entorno
  - Credenciales habilitadas

#### Middlewares

- ✅ **Body Parser** - Límite de 50MB para JSON y URL encoded
- ✅ **Static Files** - Servicio de archivos en `/uploads`
- ✅ **Trust Proxy** - Configurado para funcionar detrás de Nginx

#### Rutas API

Todas las rutas están registradas y funcionando:

- `/api/auth` - Autenticación
- `/api/usuarios` - Usuarios
- `/api/noticias` - Noticias
- `/api/convocatorias` - Convocatorias
- `/api/gaceta` - Gaceta
- `/api/transparencia` - Transparencia
- `/api/sesiones` - Sesiones
- `/api/autoridades` - Autoridades
- `/api/configuracion` - Configuración
- `/api/pqrsd` - PQRSD
- `/api/datos-abiertos` - Datos abiertos
- `/api/galeria` - Galería
- `/api/encuestas` - Encuestas
- `/api/historia` - Historia
- `/api/tramites` - Trámites
- `/api/busqueda` - Búsqueda
- `/api/opiniones` - Opiniones
- `/api/foros` - Foros
- `/api/contacto` - Contacto
- `/api/repositorio` - Repositorio

**Estado:** ✅ **CONFIGURADO Y FUNCIONANDO**

---

## CONFIGURACIÓN DE BASE DE DATOS

### server/config/database.js

**Ubicación:** `server/config/database.js`

**Características:**
- ✅ Conexión a MySQL configurada
- ✅ Variables de entorno para credenciales
- ✅ Pool de conexiones configurado
- ✅ Manejo de errores de conexión
- ✅ Reconexión automática

**Configuración:**
```javascript
{
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  connectionLimit: 10
}
```

**Estado:** ✅ **CONFIGURADO Y FUNCIONANDO**

---

## VARIABLES DE ENTORNO

### Archivo .env

**Ubicación:** `server/.env`

**Variables Requeridas:**

```env
# Base de Datos
DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=concejo_guachucal

# Servidor
PORT=5000
NODE_ENV=production

# Frontend
FRONTEND_URL=http://concejodeguachucal.gov.co

# JWT
JWT_SECRET=secret_key_aqui

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=email@ejemplo.com
EMAIL_PASS=contraseña_email
```

**Estado:** ✅ **CONFIGURADO**

---

## CONFIGURACIÓN DE SSL/HTTPS

### Certificados SSL

**Estado:** ✅ **PREPARADO PARA DOMINIO**

**Configuración:**
- ✅ Certificados SSL listos para `concejodeguachucal.gov.co`
- ✅ Configuración de Nginx con SSL implementada
- ✅ Redirección HTTP a HTTPS configurada
- ✅ Headers de seguridad SSL configurados

**Nota:** Los certificados están listos y se activarán automáticamente una vez el dominio sea configurado en el DNS.

---

## CONFIGURACIÓN DE DOMINIO

### DNS y Dominio

**Dominio:** `concejodeguachucal.gov.co`

**Estado de Gestión:**
- ✅ Gestión administrativa realizada ante registro.co
- ✅ Documentación entregada
- ✅ Requisitos cumplidos

**Estado Técnico:**
- ✅ Servidor configurado para recibir el dominio
- ✅ Nginx configurado con el dominio
- ✅ Certificados SSL preparados
- ✅ Sistema funcionando y probado

**Pendiente:**
- ⚠️ Activación del dominio por registro.co
- ⚠️ Verificación de requisitos por registro.co
- ⚠️ Configuración DNS final

**Nota:** Una vez registro.co active el dominio y configure el DNS, el sistema funcionará inmediatamente sin necesidad de cambios adicionales.

---

## ESTRUCTURA DE DIRECTORIOS EN SERVIDOR

```
/var/www/concejoguachual/
├── client/
│   └── build/          # Frontend compilado
├── server/
│   ├── index.js        # Servidor Node.js
│   ├── routes/         # Rutas API
│   ├── middleware/     # Middlewares
│   ├── config/         # Configuraciones
│   ├── utils/          # Utilidades
│   └── uploads/        # Archivos subidos
└── database/           # Scripts SQL
```

**Permisos:**
- ✅ Directorios con permisos correctos
- ✅ Usuario y grupo configurados
- ✅ Archivos ejecutables con permisos adecuados

---

## SERVICIOS Y PROCESOS

### PM2 (Gestión de Procesos)

**Configuración:**
- ✅ PM2 configurado para gestión de procesos
- ✅ Auto-restart en caso de fallos
- ✅ Logs configurados
- ✅ Variables de entorno cargadas

**Comandos:**
```bash
pm2 start server/index.js --name concejo-api
pm2 save
pm2 startup
```

**Estado:** ✅ **CONFIGURADO**

---

### Nginx

**Estado del Servicio:**
- ✅ Nginx instalado y configurado
- ✅ Servicio iniciado y funcionando
- ✅ Configuración probada
- ✅ Logs configurados

**Comandos:**
```bash
sudo systemctl status nginx
sudo nginx -t  # Verificar configuración
sudo systemctl reload nginx
```

**Estado:** ✅ **FUNCIONANDO**

---

### MySQL

**Estado del Servicio:**
- ✅ MySQL instalado y configurado
- ✅ Base de datos creada
- ✅ Usuario y permisos configurados
- ✅ Tablas creadas

**Comandos:**
```bash
sudo systemctl status mysql
mysql -u usuario -p concejo_guachucal
```

**Estado:** ✅ **FUNCIONANDO**

---

## SEGURIDAD DEL SERVIDOR

### Firewall

**Configuración:**
- ✅ Puerto 80 (HTTP) abierto
- ✅ Puerto 443 (HTTPS) abierto
- ✅ Puerto 22 (SSH) configurado
- ✅ Otros puertos cerrados

**Estado:** ✅ **CONFIGURADO**

---

### Headers de Seguridad

**Implementados:**
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Strict-Transport-Security (HSTS)
- ✅ Content-Security-Policy

**Estado:** ✅ **IMPLEMENTADO**

---

## MONITOREO Y LOGS

### Logs de Nginx

**Ubicación:**
- Access log: `/var/log/nginx/concejo_access.log`
- Error log: `/var/log/nginx/concejo_error.log`

**Rotación:** Configurada automáticamente

---

### Logs de Node.js

**Gestión:** PM2 gestiona los logs automáticamente

**Ubicación:** `~/.pm2/logs/`

---

## RESUMEN DE CONFIGURACIÓN

**Servidor Web (Nginx):** ✅ **CONFIGURADO Y FUNCIONANDO**

**Servidor de Aplicaciones (Node.js):** ✅ **CONFIGURADO Y FUNCIONANDO**

**Base de Datos (MySQL):** ✅ **CONFIGURADO Y FUNCIONANDO**

**SSL/HTTPS:** ✅ **PREPARADO PARA DOMINIO**

**Dominio:** ⚠️ **PENDIENTE ACTIVACIÓN POR registro.co**

**Seguridad:** ✅ **IMPLEMENTADA**

**Monitoreo:** ✅ **CONFIGURADO**

---

## CONCLUSIÓN

El servidor está completamente configurado y listo para recibir peticiones del dominio institucional. Todas las configuraciones necesarias han sido implementadas, probadas y están funcionando correctamente. La única pendiente es la activación del dominio por parte de registro.co, proceso que está en curso y cuya gestión administrativa ya fue completada.

