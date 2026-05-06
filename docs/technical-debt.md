# Deuda técnica

## Prioridad alta

### 1. Duplicidad `Post` vs `BlogPost`

Impacto:

- dos modelos para el mismo dominio
- dos tablas potencialmente competidoras
- ambigüedad en naming y evolución

Decisión:

- `posts` + `Post` quedan oficiales
- `blog_posts` + `BlogPost` quedan legacy

Acción recomendada:

1. congelar `BlogPost`
2. migrar cualquier dato útil a `posts`
3. retirar tabla y modelo cuando no haya dependencia

### 2. Activos duplicados entre `frontend/` y `backend/app/public/`

Impacto:

- riesgo de divergencia
- mantenimiento doble
- dificultad para saber qué asset es oficial

Ejemplos:

- `frontend/css/styles.css`
- `backend/app/public/css/styles.css`
- `frontend/scripts/blog.js`
- `backend/app/public/scripts/blog.js`

Acción recomendada:

1. definir un origen único por asset
2. copiar solo en build o deploy, no manualmente
3. documentar qué directorio alimenta la publicación

### 3. Catálogo y pedidos siguen en demo

Impacto:

- el portafolio aparenta más integración de la que realmente existe
- `Category`, `Product`, `Order` y `OrderItem` no están conectados al frontend público

Acción recomendada:

1. exponer endpoints Laravel para catálogo
2. conectar `products.html` a datos reales
3. persistir pedidos desde `index.html`

## Prioridad media

### 4. `docker-compose.yml` usa MySQL, Laravel usa SQLite por defecto

Impacto:

- entorno ambiguo
- documentación inconsistente

Acción recomendada:

- elegir una estrategia oficial de desarrollo local:
  - SQLite simple para portafolio
  - o MySQL como entorno base real

### 5. README genérico de Laravel en subcarpeta

Estado:

- mitigado en esta iteración con documentación raíz

Acción recomendada:

- mantener README del backend alineado con el proyecto, no con el skeleton

### 6. Pruebas insuficientes

Estado actual:

- ya existen pruebas feature básicas para `AdminAuth` y `PublicBlog`
- todavía no hay cobertura de CRUD completo de publicaciones ni de catálogo/pedidos

Acción recomendada:

1. ampliar cobertura de CRUD de `posts`
2. agregar pruebas de validación y errores de login
3. agregar pruebas para catálogo y pedidos cuando el flujo sea oficial

## Prioridad baja

### 7. Tooling no alineado con la UI real

Contexto:

- Vite 7 y Tailwind 4 están instalados
- la UI real pública usa Bootstrap por CDN y CSS propio

Acción recomendada:

- documentar Tailwind/Vite como tooling disponible, no como stack UI oficial

### 8. Archivos residuales del skeleton y placeholders

Ejemplos:

- `backend/app/public/resources/views/welcome.blade.php`
- `backend/app/resources/views/ss`
- `backend/app/resources/ss`

Acción recomendada:

- mover a legacy documentado o eliminar en una fase de limpieza

## Inventario legacy actual

- [frontend/html/login.html](/Users/jose/Documents/ProyectoWeb2/frontend/html/login.html)
- [frontend/scripts/admin-login.js](/Users/jose/Documents/ProyectoWeb2/frontend/scripts/admin-login.js)
- [frontend/html/blog-admin.html](/Users/jose/Documents/ProyectoWeb2/frontend/html/blog-admin.html)
- [frontend/scripts/blog-admin.js](/Users/jose/Documents/ProyectoWeb2/frontend/scripts/blog-admin.js)
- [frontend/php/public_feed.php](/Users/jose/Documents/ProyectoWeb2/frontend/php/public_feed.php)
- [backend/app/app/Models/BlogPost.php](/Users/jose/Documents/ProyectoWeb2/backend/app/app/Models/BlogPost.php)
- [backend/app/app/Models/BlogCategory.php](/Users/jose/Documents/ProyectoWeb2/backend/app/app/Models/BlogCategory.php)
- [backend/app/public/resources/views/welcome.blade.php](/Users/jose/Documents/ProyectoWeb2/backend/app/public/resources/views/welcome.blade.php)

## Plan por fases

### Fase 1. Limpieza y unificación

- dejar un único login oficial
- dejar un único admin de publicaciones oficial
- documentar y marcar legacy

### Fase 2. Integración de flujos reales

- blog público contra Laravel
- catálogo público contra Laravel
- pedidos persistidos en Laravel

### Fase 3. Profesionalización

- modularizar controladores y dominios
- cubrir flujos activos con pruebas
- unificar assets y publicación

### Fase 4. Documentación y portafolio

- diagramas simples
- capturas o gif del flujo admin + blog público
- README con alcance real y decisiones técnicas
