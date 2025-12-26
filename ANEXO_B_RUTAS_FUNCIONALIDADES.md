# ANEXO B: RUTAS Y FUNCIONALIDADES
## Portal Web Concejo Municipal de Guachucal

**Fecha:** [Fecha a completar]  
**Proyecto:** Desarrollo e Implementación del Portal Web Institucional

---

## RUTAS PÚBLICAS DEL FRONTEND

### Páginas Principales

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | `Home.js` | Página principal con banner institucional, noticias destacadas y convocatorias |
| `/acerca` | `Acerca.js` | Información institucional, misión, visión, autoridades y símbolos |
| `/noticias` | `Noticias.js` | Listado de todas las noticias con búsqueda |
| `/noticias/:id` | `NoticiaDetalle.js` | Detalle completo de una noticia |
| `/convocatorias` | `Convocatorias.js` | Listado de convocatorias públicas |
| `/convocatorias/:id` | `ConvocatoriaDetalle.js` | Detalle de una convocatoria |
| `/gaceta` | `Gaceta.js` | Documentos normativos (actas, acuerdos, decretos, etc.) |
| `/gaceta/:id` | `GacetaDetalle.js` | Detalle de un documento de gaceta |
| `/transparencia` | `Transparencia.js` | Documentos de transparencia con 14 categorías |
| `/sesiones` | `Sesiones.js` | Calendario y listado de sesiones del concejo |
| `/sesiones/:id` | `SesionDetalle.js` | Detalle de una sesión con actas y videos |
| `/galeria` | `Galeria.js` | Galería multimedia con fotografías y videos |
| `/encuestas` | `Encuestas.js` | Listado de encuestas ciudadanas activas |
| `/encuestas/:id` | `EncuestaDetalle.js` | Responder encuesta o ver resultados |
| `/encuestas/:id/resultados` | `EncuestaDetalle.js` | Ver resultados de encuesta finalizada |
| `/foros` | `Foros.js` | Listado de foros de discusión |
| `/foros/:id` | `ForoDetalle.js` | Detalle de un foro |
| `/pqrsd` | `PQRSD.js` | Formulario público de PQRSD |
| `/pqrsd/consulta/:numeroRadicado?` | `PQRSDConsulta.js` | Consulta pública por número de radicado |
| `/datos-abiertos` | `DatosAbiertos.js` | Catálogo de datos abiertos con exportación |
| `/busqueda` | `Busqueda.js` | Búsqueda global en todo el contenido |
| `/contacto` | `Contacto.js` | Página de contacto |
| `/historia` | `Historia.js` | Historia del Concejo Municipal |
| `/politica-privacidad` | `PoliticaPrivacidad.js` | Política de privacidad |
| `/tratamiento-datos` | `TratamientoDatos.js` | Política de tratamiento de datos personales |
| `/mapa-sitio` | `MapaSitio.js` | Mapa del sitio web |

---

## RUTAS DEL PANEL DE ADMINISTRACIÓN

### Requiere Autenticación

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/admin/login` | `AdminLogin.js` | Página de login para administradores |
| `/admin` | `AdminDashboard.js` | Dashboard principal con resumen |
| `/admin/usuarios` | `AdminUsuarios.js` | Gestión de usuarios y permisos |
| `/admin/noticias` | `AdminNoticias.js` | Gestión de noticias |
| `/admin/convocatorias` | `AdminConvocatorias.js` | Gestión de convocatorias |
| `/admin/gaceta` | `AdminGaceta.js` | Gestión de documentos de gaceta |
| `/admin/transparencia` | `AdminTransparencia.js` | Gestión de documentos de transparencia |
| `/admin/sesiones` | `AdminSesiones.js` | Gestión de sesiones del concejo |
| `/admin/autoridades` | `AdminAutoridades.js` | Gestión de autoridades |
| `/admin/pqrsd` | `AdminPQRSD.js` | Gestión de solicitudes PQRSD |
| `/admin/encuestas` | `AdminEncuestas.js` | Gestión de encuestas ciudadanas |
| `/admin/galeria` | `AdminGaleria.js` | Gestión de galería multimedia |
| `/admin/configuracion` | `AdminConfiguracion.js` | Configuración general del sitio |

---

## RUTAS DE LA API (BACKEND)

### Autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/auth/login` | Iniciar sesión |
| `POST` | `/api/auth/logout` | Cerrar sesión |
| `GET` | `/api/auth/verify` | Verificar token |

### Usuarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/usuarios` | Listar usuarios |
| `GET` | `/api/usuarios/:id` | Obtener usuario |
| `POST` | `/api/usuarios` | Crear usuario |
| `PUT` | `/api/usuarios/:id` | Actualizar usuario |
| `DELETE` | `/api/usuarios/:id` | Eliminar usuario |
| `GET` | `/api/usuarios/:id/permisos` | Obtener permisos de usuario |

### Noticias

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/noticias` | Listar noticias |
| `GET` | `/api/noticias/:id` | Obtener noticia |
| `POST` | `/api/noticias` | Crear noticia |
| `PUT` | `/api/noticias/:id` | Actualizar noticia |
| `DELETE` | `/api/noticias/:id` | Eliminar noticia |
| `GET` | `/api/noticias/buscar?q=termino` | Buscar noticias |

### Convocatorias

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/convocatorias` | Listar convocatorias |
| `GET` | `/api/convocatorias/:id` | Obtener convocatoria |
| `POST` | `/api/convocatorias` | Crear convocatoria |
| `PUT` | `/api/convocatorias/:id` | Actualizar convocatoria |
| `DELETE` | `/api/convocatorias/:id` | Eliminar convocatoria |

### Gaceta

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/gaceta` | Listar documentos |
| `GET` | `/api/gaceta/:id` | Obtener documento |
| `POST` | `/api/gaceta` | Crear documento |
| `PUT` | `/api/gaceta/:id` | Actualizar documento |
| `DELETE` | `/api/gaceta/:id` | Eliminar documento |
| `GET` | `/api/gaceta/tipos` | Listar tipos de documentos |

### Transparencia

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/transparencia` | Listar documentos |
| `GET` | `/api/transparencia/:id` | Obtener documento |
| `POST` | `/api/transparencia` | Crear documento |
| `PUT` | `/api/transparencia/:id` | Actualizar documento |
| `DELETE` | `/api/transparencia/:id` | Eliminar documento |
| `GET` | `/api/transparencia/categorias` | Listar categorías |

### Sesiones

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/sesiones` | Listar sesiones |
| `GET` | `/api/sesiones/:id` | Obtener sesión |
| `POST` | `/api/sesiones` | Crear sesión |
| `PUT` | `/api/sesiones/:id` | Actualizar sesión |
| `DELETE` | `/api/sesiones/:id` | Eliminar sesión |

### Autoridades

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/autoridades` | Listar autoridades |
| `GET` | `/api/autoridades/:id` | Obtener autoridad |
| `POST` | `/api/autoridades` | Crear autoridad |
| `PUT` | `/api/autoridades/:id` | Actualizar autoridad |
| `DELETE` | `/api/autoridades/:id` | Eliminar autoridad |

### PQRSD

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/pqrsd` | Crear solicitud (público) |
| `GET` | `/api/pqrsd/consulta/:numeroRadicado` | Consultar por radicado (público) |
| `GET` | `/api/pqrsd` | Listar solicitudes (admin) |
| `GET` | `/api/pqrsd/:id` | Obtener solicitud (admin) |
| `PUT` | `/api/pqrsd/:id` | Actualizar solicitud (admin) |
| `POST` | `/api/pqrsd/:id/seguimiento` | Agregar seguimiento (admin) |
| `GET` | `/api/pqrsd/:id/seguimiento` | Obtener historial (admin) |

### Encuestas

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/encuestas` | Listar encuestas |
| `GET` | `/api/encuestas/:id` | Obtener encuesta |
| `POST` | `/api/encuestas` | Crear encuesta (admin) |
| `PUT` | `/api/encuestas/:id` | Actualizar encuesta (admin) |
| `DELETE` | `/api/encuestas/:id` | Eliminar encuesta (admin) |
| `POST` | `/api/encuestas/:id/respuestas` | Enviar respuesta (público) |
| `GET` | `/api/encuestas/:id/resultados` | Obtener resultados |

### Galería

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/galeria` | Listar elementos |
| `GET` | `/api/galeria/:id` | Obtener elemento |
| `POST` | `/api/galeria` | Crear elemento (admin) |
| `PUT` | `/api/galeria/:id` | Actualizar elemento (admin) |
| `DELETE` | `/api/galeria/:id` | Eliminar elemento (admin) |

### Datos Abiertos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/datos-abiertos` | Listar datasets |
| `GET` | `/api/datos-abiertos/transparencia/csv` | Exportar transparencia CSV |
| `GET` | `/api/datos-abiertos/transparencia/json` | Exportar transparencia JSON |
| `GET` | `/api/datos-abiertos/transparencia/xml` | Exportar transparencia XML |
| `GET` | `/api/datos-abiertos/gaceta/csv` | Exportar gaceta CSV |
| `GET` | `/api/datos-abiertos/gaceta/json` | Exportar gaceta JSON |
| `GET` | `/api/datos-abiertos/gaceta/xml` | Exportar gaceta XML |
| `GET` | `/api/datos-abiertos/noticias/csv` | Exportar noticias CSV |
| `GET` | `/api/datos-abiertos/noticias/json` | Exportar noticias JSON |
| `GET` | `/api/datos-abiertos/noticias/xml` | Exportar noticias XML |
| `GET` | `/api/datos-abiertos/convocatorias/csv` | Exportar convocatorias CSV |
| `GET` | `/api/datos-abiertos/convocatorias/json` | Exportar convocatorias JSON |
| `GET` | `/api/datos-abiertos/convocatorias/xml` | Exportar convocatorias XML |

### Búsqueda

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/busqueda?q=termino` | Búsqueda global |

### Configuración

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/configuracion` | Obtener configuración |
| `PUT` | `/api/configuracion` | Actualizar configuración |

### Historia

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/historia` | Obtener historia |
| `POST` | `/api/historia` | Crear/actualizar historia |
| `PUT` | `/api/historia/:id` | Actualizar historia |

### Trámites

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/tramites` | Listar trámites |
| `GET` | `/api/tramites/:id` | Obtener trámite |
| `POST` | `/api/tramites` | Crear trámite |
| `PUT` | `/api/tramites/:id` | Actualizar trámite |
| `DELETE` | `/api/tramites/:id` | Eliminar trámite |

### Foros

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/foros` | Listar foros |
| `GET` | `/api/foros/:id` | Obtener foro |
| `POST` | `/api/foros` | Crear foro |
| `PUT` | `/api/foros/:id` | Actualizar foro |
| `DELETE` | `/api/foros/:id` | Eliminar foro |

### Opiniones

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/opiniones` | Listar opiniones |
| `GET` | `/api/opiniones/:id` | Obtener opinión |
| `POST` | `/api/opiniones` | Crear opinión |
| `PUT` | `/api/opiniones/:id` | Actualizar opinión |
| `DELETE` | `/api/opiniones/:id` | Eliminar opinión |

### Contacto

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/contacto` | Enviar mensaje de contacto |

### Repositorio

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/repositorio/upload` | Subir archivo al repositorio |
| `GET` | `/api/repositorio` | Listar archivos del repositorio |

---

## FUNCIONALIDADES POR MÓDULO

### 1. Fechas de Actualización Visibles

**Rutas donde se muestra:**
- `/transparencia` - Documentos de transparencia
- `/gaceta` - Documentos de gaceta
- `/noticias` - Noticias
- `/noticias/:id` - Detalle de noticia
- `/convocatorias` - Convocatorias
- `/convocatorias/:id` - Detalle de convocatoria

**Formato:** "Última actualización: [día] de [mes] de [año]"

---

### 2. Schema.org Markup para SEO

**Rutas donde está implementado:**
- `/` - OrganizationSchema y WebSiteSchema
- `/acerca` - OrganizationSchema
- `/noticias/:id` - ArticleSchema
- `/datos-abiertos` - DatasetSchema

**Validación:**
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/

---

### 3. Galería Multimedia

**Rutas:**
- `/galeria` - Página pública
- `/admin/galeria` - Panel de administración

**Funcionalidades:**
- Grid de imágenes y videos
- Filtros por categoría (Sesiones, Eventos, Autoridades, Actividades, Otros)
- Filtros por tipo (Fotografías, Videos)
- Lightbox para ver imágenes en grande
- Reproductor de video integrado
- Elementos destacados

---

### 4. Sistema de Encuestas Ciudadanas

**Rutas:**
- `/encuestas` - Lista de encuestas
- `/encuestas/:id` - Responder encuesta
- `/encuestas/:id/resultados` - Ver resultados
- `/admin/encuestas` - Panel de administración

**Funcionalidades:**
- Lista de encuestas activas y finalizadas
- Formulario de respuesta con múltiples tipos de preguntas
- Visualización de resultados con gráficos
- Panel admin completo

---

### 5. Exportación de Datos Abiertos

**Ruta:**
- `/datos-abiertos`

**Funcionalidades:**
- Catálogo de datasets disponibles
- Exportación a CSV, JSON, XML
- Información de licencia (Creative Commons 4.0)
- Contacto técnico

---

### 6. Sistema PQRSD

**Rutas:**
- `/pqrsd` - Formulario público
- `/pqrsd/consulta/:numeroRadicado` - Consulta pública
- `/admin/pqrsd` - Panel de administración

**Funcionalidades:**
- Formulario completo de solicitudes
- Tipos: Petición, Queja, Reclamo, Sugerencia, Denuncia
- Consulta pública por número de radicado
- Panel de administración con gestión completa
- Historial de seguimiento
- Generación automática de números de radicado
- Información sobre plazos de respuesta

---

### 7. Búsqueda Global

**Ruta:**
- `/busqueda`

**Funcionalidades:**
- Búsqueda en múltiples módulos
- Resultados agrupados por tipo
- Filtros avanzados

---

## RESUMEN DE RUTAS

**Rutas Públicas:** 25+ rutas  
**Rutas de Administración:** 13 rutas  
**Rutas de API:** 100+ endpoints  
**Total de Rutas:** 138+ rutas implementadas

---

## NOTAS IMPORTANTES

1. Todas las rutas de administración requieren autenticación
2. Las rutas de API están protegidas con middleware de autenticación cuando corresponde
3. Las rutas públicas no requieren autenticación
4. El sistema de permisos controla el acceso a funcionalidades específicas dentro de cada módulo

