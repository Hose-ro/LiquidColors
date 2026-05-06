# Arquitectura objetivo

## Decisión

La arquitectura oficial del proyecto es un monolito modular híbrido:

- sitio público multipágina en HTML/CSS/JS vanilla
- panel administrativo y lógica de negocio en Laravel
- una sola base de datos
- una sola fuente de verdad para datos y autenticación

## Principios

- Laravel es la fuente oficial de datos y reglas de negocio.
- El frontend público no implementa lógica de dominio ni persistencia propia.
- Cada flujo funcional debe tener una sola implementación oficial.
- Todo artefacto del prototipo que siga en el repo debe quedar marcado como `legacy`.
- El frontend público puede seguir siendo estático, pero debe consumir datos oficiales desde Laravel.

## Límites

### Capa pública

Responsable de:

- render multipágina
- interacción visual
- consumo de endpoints públicos

No responsable de:

- autenticación real
- CRUD real
- persistencia
- definición de verdad de negocio

### Capa Laravel

Responsable de:

- autenticación admin
- controladores
- modelos
- validación
- acceso a datos
- endpoints JSON públicos e internos

## Flujo oficial entre capas

### Sitio público

1. El usuario navega páginas estáticas en `frontend/html`.
2. Los scripts públicos consumen endpoints Laravel.
3. Laravel responde JSON con datos oficiales.

### Panel admin

1. El administrador accede a `/admin/login`.
2. Laravel valida credenciales contra `admin_users`.
3. La sesión se mantiene vía middleware `admin.auth`.
4. El panel administra publicaciones contra la tabla `posts`.

## Oficial vs legacy

### Oficial

- [backend/app/routes/web.php](/Users/jose/Documents/ProyectoWeb2/backend/app/routes/web.php)
- [backend/app/app/Http/Controllers/AdminAuthController.php](/Users/jose/Documents/ProyectoWeb2/backend/app/app/Http/Controllers/AdminAuthController.php)
- [backend/app/app/Http/Controllers/AdminPostController.php](/Users/jose/Documents/ProyectoWeb2/backend/app/app/Http/Controllers/AdminPostController.php)
- [backend/app/app/Http/Controllers/PublicBlogController.php](/Users/jose/Documents/ProyectoWeb2/backend/app/app/Http/Controllers/PublicBlogController.php)
- [backend/app/app/Models/Post.php](/Users/jose/Documents/ProyectoWeb2/backend/app/app/Models/Post.php)
- [backend/app/resources/views/admin/login.blade.php](/Users/jose/Documents/ProyectoWeb2/backend/app/resources/views/admin/login.blade.php)
- [backend/app/resources/views/admin/blog.blade.php](/Users/jose/Documents/ProyectoWeb2/backend/app/resources/views/admin/blog.blade.php)

### Legacy o transicional

- [frontend/html/login.html](/Users/jose/Documents/ProyectoWeb2/frontend/html/login.html)
- [frontend/html/blog-admin.html](/Users/jose/Documents/ProyectoWeb2/frontend/html/blog-admin.html)
- [frontend/php/public_feed.php](/Users/jose/Documents/ProyectoWeb2/frontend/php/public_feed.php)
- [backend/app/app/Models/BlogPost.php](/Users/jose/Documents/ProyectoWeb2/backend/app/app/Models/BlogPost.php)
- [backend/app/app/Models/BlogCategory.php](/Users/jose/Documents/ProyectoWeb2/backend/app/app/Models/BlogCategory.php)
- [backend/app/public/resources/views/welcome.blade.php](/Users/jose/Documents/ProyectoWeb2/backend/app/public/resources/views/welcome.blade.php)
- [backend/app/README.md](/Users/jose/Documents/ProyectoWeb2/backend/app/README.md) antes de esta iteración era documentación genérica de Laravel

## Riesgos arquitectónicos actuales

- Hay assets duplicados entre `frontend/` y `backend/app/public/`.
- El frontend público y Laravel aún no comparten un esquema único de publicación/deploy.
- `BlogPost` y `Post` conviven en la base, aunque solo `Post` está conectado al flujo real.
- `Catalog` y `Orders` tienen modelo físico, pero todavía no tienen integración operativa end-to-end.

## Dirección recomendada

### Corto plazo

- mantener `frontend/` como capa pública estática
- exponer datos públicos desde Laravel
- eliminar rutas demo desde la navegación oficial

### Mediano plazo

- modularizar `backend/app/app` por dominio
- separar scripts públicos por responsabilidad
- consolidar assets compartidos para evitar duplicidad

### Largo plazo

- retirar artefactos legacy del árbol operativo
- dejar el repo con solo una ruta oficial por flujo
- cubrir los flujos conectados con pruebas feature
