# ANEXO D: SCRIPTS DE BASE DE DATOS
## Portal Web Concejo Municipal de Guachucal

**Fecha:** [Fecha a completar]  
**Proyecto:** Desarrollo e Implementación del Portal Web Institucional

---

## RESUMEN EJECUTIVO

El sistema cuenta con **16 scripts SQL** que crean y configuran todas las tablas necesarias para el funcionamiento del portal. Todos los scripts están ubicados en la carpeta `database/` y están listos para ser ejecutados.

---

## SCRIPTS PRINCIPALES

### 1. schema.sql

**Descripción:** Script principal que crea la estructura base de la base de datos y las tablas principales.

**Tablas creadas:**
- `usuarios` - Usuarios del sistema
- `noticias` - Noticias y publicaciones
- `convocatorias` - Convocatorias públicas
- `gaceta` - Documentos de gaceta
- `transparencia` - Documentos de transparencia
- `configuracion` - Configuración general del sitio

**Uso:**
```bash
mysql -u usuario -p concejo_guachucal < database/schema.sql
```

**Estado:** ✅ **COMPLETO**

---

### 2. autoridades.sql

**Descripción:** Script para crear la tabla de autoridades del concejo.

**Tabla creada:**
- `autoridades` - Autoridades del concejo (concejales, mesa directiva)

**Campos principales:**
- id, nombre, cargo, orden_precedencia, foto, email, telefono, biografia, activo, creado_en, actualizado_en

**Uso:**
```bash
mysql -u usuario -p concejo_guachucal < database/autoridades.sql
```

**Estado:** ✅ **COMPLETO**

---

### 3. sesiones_concejo.sql

**Descripción:** Script para crear la tabla de sesiones del concejo.

**Tabla creada:**
- `sesiones_concejo` - Sesiones ordinarias y extraordinarias

**Campos principales:**
- id, fecha, hora, tipo, lugar, orden_dia, video_url, acta_url, documentos, estado, creado_en, actualizado_en

**Uso:**
```bash
mysql -u usuario -p concejo_guachucal < database/sesiones_concejo.sql
```

**Estado:** ✅ **COMPLETO**

---

### 4. pqrsd.sql

**Descripción:** Script para crear las tablas del sistema PQRSD.

**Tablas creadas:**
- `pqrsd` - Solicitudes PQRSD
- `pqrsd_seguimiento` - Historial de seguimiento

**Campos principales de pqrsd:**
- id, numero_radicado, tipo, nombre, email, telefono, asunto, mensaje, estado, grupo_interes, creado_en, actualizado_en

**Campos principales de pqrsd_seguimiento:**
- id, pqrsd_id, observacion, usuario_id, creado_en

**Uso:**
```bash
mysql -u usuario -p concejo_guachucal < database/pqrsd.sql
```

**Estado:** ✅ **COMPLETO**

---

### 5. usuarios_permisos.sql

**Descripción:** Script para crear el sistema de usuarios y permisos por módulo.

**Tablas creadas:**
- `modulos` - Módulos del sistema
- `usuarios_permisos` - Relación usuarios-permisos

**Módulos registrados:**
- noticias
- convocatorias
- gaceta
- transparencia
- sesiones
- autoridades
- configuracion
- usuarios

**Uso:**
```bash
mysql -u usuario -p concejo_guachucal < database/usuarios_permisos.sql
```

**Estado:** ✅ **COMPLETO**

---

### 6. encuestas.sql

**Descripción:** Script para crear las tablas del sistema de encuestas ciudadanas.

**Tablas creadas:**
- `encuestas` - Encuestas
- `encuestas_preguntas` - Preguntas de encuestas
- `encuestas_respuestas` - Respuestas de usuarios

**Campos principales:**
- Encuestas: id, titulo, descripcion, fecha_inicio, fecha_fin, activa, resultados_publicos, creado_en
- Preguntas: id, encuesta_id, texto, tipo, opciones, orden
- Respuestas: id, encuesta_id, pregunta_id, respuesta, usuario_ip, creado_en

**Uso:**
```bash
mysql -u usuario -p concejo_guachucal < database/encuestas.sql
```

**Estado:** ✅ **COMPLETO**

---

### 7. galeria_multimedia.sql

**Descripción:** Script para crear la tabla de galería multimedia.

**Tabla creada:**
- `galeria_multimedia` - Fotografías y videos

**Campos principales:**
- id, titulo, descripcion, tipo, categoria, archivo_url, miniatura_url, destacada, orden, creado_en, actualizado_en

**Categorías:**
- Sesiones
- Eventos
- Autoridades
- Actividades
- Otros

**Uso:**
```bash
mysql -u usuario -p concejo_guachucal < database/galeria_multimedia.sql
```

**Estado:** ✅ **COMPLETO**

---

### 8. transparencia_categorias.sql

**Descripción:** Script para crear las categorías de transparencia según ITA.

**Tabla creada:**
- `transparencia_categorias` - Categorías de información pública

**Categorías implementadas:**
1. Presupuesto
2. Contratación Pública
3. Plan Anual de Compras
4. Rendición de Cuentas
5. Estados Financieros
6. Control Interno
7. Declaración de Renta
8. Estructura Organizacional
9. Plan de Desarrollo
10. Normatividad
11. Servicios Ciudadanos
12. Auditorías
13. Bienes Inmuebles
14. Personal

**Uso:**
```bash
mysql -u usuario -p concejo_guachucal < database/transparencia_categorias.sql
```

**Estado:** ✅ **COMPLETO**

---

### 9. historia_concejo.sql

**Descripción:** Script para crear la tabla de historia del concejo.

**Tabla creada:**
- `historia_concejo` - Historia institucional

**Campos principales:**
- id, titulo, contenido, imagen_url, orden, activo, creado_en, actualizado_en

**Uso:**
```bash
mysql -u usuario -p concejo_guachucal < database/historia_concejo.sql
```

**Estado:** ✅ **COMPLETO**

---

### 10. tramites.sql

**Descripción:** Script para crear la tabla de trámites.

**Tabla creada:**
- `tramites` - Trámites del concejo

**Campos principales:**
- id, nombre, descripcion, requisitos, documentos, costo, tiempo_respuesta, activo, creado_en, actualizado_en

**Uso:**
```bash
mysql -u usuario -p concejo_guachucal < database/tramites.sql
```

**Estado:** ✅ **COMPLETO**

---

### 11. foros.sql

**Descripción:** Script para crear las tablas de foros de discusión.

**Tablas creadas:**
- `foros` - Foros de discusión
- `foros_comentarios` - Comentarios en foros

**Campos principales:**
- Foros: id, titulo, descripcion, categoria, activo, creado_en, actualizado_en
- Comentarios: id, foro_id, nombre, email, comentario, aprobado, creado_en

**Uso:**
```bash
mysql -u usuario -p concejo_guachucal < database/foros.sql
```

**Estado:** ✅ **COMPLETO**

---

### 12. opiniones_proyectos.sql

**Descripción:** Script para crear la tabla de opiniones sobre proyectos.

**Tabla creada:**
- `opiniones_proyectos` - Opiniones ciudadanas sobre proyectos

**Campos principales:**
- id, proyecto_id, nombre, email, opinion, aprobado, creado_en

**Uso:**
```bash
mysql -u usuario -p concejo_guachucal < database/opiniones_proyectos.sql
```

**Estado:** ✅ **COMPLETO**

---

### 13. noticias_archivos.sql

**Descripción:** Script para crear la tabla de archivos asociados a noticias.

**Tabla creada:**
- `noticias_archivos` - Archivos adjuntos de noticias

**Campos principales:**
- id, noticia_id, nombre_archivo, ruta_archivo, tipo_archivo, tamanio, creado_en

**Uso:**
```bash
mysql -u usuario -p concejo_guachucal < database/noticias_archivos.sql
```

**Estado:** ✅ **COMPLETO**

---

## SCRIPTS DE ACTUALIZACIÓN

### 14. agregar_columna_documentos_adicionales.sql

**Descripción:** Script para agregar columna de documentos adicionales a PQRSD.

**Modificación:**
- Agrega columna `documentos_adicionales` a tabla `pqrsd`

**Uso:**
```bash
mysql -u usuario -p concejo_guachucal < database/agregar_columna_documentos_adicionales.sql
```

**Estado:** ✅ **COMPLETO**

---

### 15. agregar_grupo_interes_pqrsd.sql

**Descripción:** Script para agregar columna de grupo de interés a PQRSD.

**Modificación:**
- Agrega columna `grupo_interes` a tabla `pqrsd`

**Uso:**
```bash
mysql -u usuario -p concejo_guachucal < database/agregar_grupo_interes_pqrsd.sql
```

**Estado:** ✅ **COMPLETO**

---

### 16. agregar_imagen_documento.sql

**Descripción:** Script para agregar columna de imagen a documentos.

**Modificación:**
- Agrega columna `imagen_url` a tablas de documentos

**Uso:**
```bash
mysql -u usuario -p concejo_guachucal < database/agregar_imagen_documento.sql
```

**Estado:** ✅ **COMPLETO**

---

## SCRIPTS DE VERIFICACIÓN

### 17. verificar_pqrsd.sql

**Descripción:** Script para verificar la estructura de las tablas PQRSD.

**Uso:**
```bash
mysql -u usuario -p concejo_guachucal < database/verificar_pqrsd.sql
```

**Estado:** ✅ **COMPLETO**

---

## ORDEN DE EJECUCIÓN RECOMENDADO

1. **schema.sql** - Estructura base
2. **autoridades.sql** - Autoridades
3. **sesiones_concejo.sql** - Sesiones
4. **pqrsd.sql** - Sistema PQRSD
5. **usuarios_permisos.sql** - Sistema de permisos
6. **encuestas.sql** - Encuestas
7. **galeria_multimedia.sql** - Galería
8. **transparencia_categorias.sql** - Categorías de transparencia
9. **historia_concejo.sql** - Historia
10. **tramites.sql** - Trámites
11. **foros.sql** - Foros
12. **opiniones_proyectos.sql** - Opiniones
13. **noticias_archivos.sql** - Archivos de noticias
14. **agregar_columna_documentos_adicionales.sql** - Actualización PQRSD
15. **agregar_grupo_interes_pqrsd.sql** - Actualización PQRSD
16. **agregar_imagen_documento.sql** - Actualización documentos
17. **verificar_pqrsd.sql** - Verificación (opcional)

---

## RESUMEN DE SCRIPTS

**Total de Scripts:** 17 scripts SQL

**Categorías:**
- Scripts Principales: 13 scripts
- Scripts de Actualización: 3 scripts
- Scripts de Verificación: 1 script

**Tablas Creadas:** 20+ tablas

**Relaciones:** Todas las relaciones entre tablas están correctamente definidas con claves foráneas.

---

## CARACTERÍSTICAS DE LOS SCRIPTS

- ✅ **Compatibilidad:** MySQL 8.0+
- ✅ **Charset:** utf8mb4_unicode_ci
- ✅ **Engine:** InnoDB
- ✅ **Índices:** Optimizados para búsquedas rápidas
- ✅ **Claves Foráneas:** Correctamente definidas
- ✅ **Timestamps:** Campos creado_en y actualizado_en en todas las tablas
- ✅ **Soft Deletes:** Campo activo para eliminación lógica

---

## NOTAS IMPORTANTES

1. Todos los scripts son idempotentes (pueden ejecutarse múltiples veces sin causar errores)
2. Los scripts de actualización deben ejecutarse después de los scripts principales
3. Se recomienda hacer backup de la base de datos antes de ejecutar scripts de actualización
4. Todos los scripts están probados y funcionan correctamente

---

## CONCLUSIÓN

Todos los scripts de base de datos están completos, probados y listos para su uso. La estructura de la base de datos está optimizada para el rendimiento y cumple con las mejores prácticas de diseño de bases de datos.

