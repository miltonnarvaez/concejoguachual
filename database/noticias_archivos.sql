-- Agregar campo para documentos adicionales en noticias
-- Ejecutar después de schema.sql

USE concejo_guachucal;

-- Agregar campo para almacenar JSON de documentos adicionales
ALTER TABLE noticias 
ADD COLUMN IF NOT EXISTS documentos_adicionales TEXT DEFAULT NULL COMMENT 'JSON array con información de documentos adicionales';

-- Nota: El campo imagen_url seguirá existiendo pero ahora almacenará la ruta del archivo subido
-- Ejemplo: /uploads/images/noticia-1234567890.jpg











