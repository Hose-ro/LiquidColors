# ProyectoWeb2

Monolito modular híbrido para Liquid Colors.

La decisión arquitectónica oficial de este repositorio es:

- `frontend/` mantiene el sitio público multipágina en HTML/CSS/JS vanilla.
- `backend/app/` mantiene Laravel 12 como única fuente oficial de datos, autenticación y lógica real.
- No es SPA.
- No usa React ni Vue.
- No usa microservicios.

## Estado oficial

### Flujos activos

- `AdminAuth`: login de administrador en Laravel.
- `Blog`: CRUD de publicaciones en Laravel.
- `PublicSite -> Blog`: el blog público ya tiene endpoint oficial en Laravel (`/api/public/blog-feed`).

### Flujos incompletos

- `Catalog`: modelos y tablas presentes, sin integración completa con el frontend público.
- `Orders`: modelos y tablas presentes, sin flujo end-to-end conectado desde el formulario público.

### Legacy explícito

Estos artefactos permanecen solo como referencia visual o técnica del prototipo:

- [frontend/html/login.html](/Users/jose/Documents/ProyectoWeb2/frontend/html/login.html)
- [frontend/scripts/admin-login.js](/Users/jose/Documents/ProyectoWeb2/frontend/scripts/admin-login.js)
- [frontend/html/blog-admin.html](/Users/jose/Documents/ProyectoWeb2/frontend/html/blog-admin.html)
- [frontend/scripts/blog-admin.js](/Users/jose/Documents/ProyectoWeb2/frontend/scripts/blog-admin.js)
- [frontend/php/public_feed.php](/Users/jose/Documents/ProyectoWeb2/frontend/php/public_feed.php)

## Estructura actual

```text
ProyectoWeb2/
├─ docs/
├─ frontend/
│  ├─ html/
│  ├─ css/
│  ├─ scripts/
│  ├─ imgs/
│  └─ php/
└─ backend/
   └─ app/
      ├─ app/
      ├─ bootstrap/
      ├─ config/
      ├─ database/
      ├─ public/
      ├─ resources/views/
      ├─ routes/
      └─ tests/
```

## Estructura objetivo

La estructura objetivo no rompe Laravel ni el frontend actual; introduce orden modular y separación clara entre oficial y legacy:

```text
ProyectoWeb2/
├─ docs/
├─ frontend/
│  ├─ html/
│  │  ├─ public/
│  │  └─ legacy/
│  ├─ css/
│  │  ├─ public/
│  │  └─ legacy/
│  ├─ scripts/
│  │  ├─ public/
│  │  └─ legacy/
│  ├─ imgs/
│  └─ php/legacy/
└─ backend/
   └─ app/
      ├─ app/
      │  ├─ Domain/
      │  │  ├─ AdminAuth/
      │  │  ├─ Blog/
      │  │  ├─ Catalog/
      │  │  ├─ Orders/
      │  │  ├─ Shared/
      │  │  └─ Infrastructure/
      │  └─ Http/
      ├─ database/
      ├─ public/
      ├─ resources/views/
      └─ routes/
```

## Diagnóstico resumido

- Existían dos implementaciones de login admin: demo estático y login real en Laravel.
- Existían dos implementaciones de administración de publicaciones: demo estático y panel real en Laravel.
- El blog público consumía un feed PHP legacy no alineado con la base SQLite real.
- Hay duplicidad de conceptos `Post` y `BlogPost`.
- `docker-compose.yml` levanta MySQL, pero la app Laravel usa SQLite por defecto.
- El repo aún conserva residuos del skeleton de Laravel y activos duplicados en `backend/app/public`.

## Cambios aplicados en esta iteración

- Se consolidó el flujo oficial de admin en Laravel.
- Se corrigió el panel admin para consumir `posts-json` y guardar ediciones vía Laravel de forma consistente.
- Se añadió el endpoint oficial [backend/app/app/Http/Controllers/PublicBlogController.php](/Users/jose/Documents/ProyectoWeb2/backend/app/app/Http/Controllers/PublicBlogController.php) para el blog público.
- Se reorientaron los accesos públicos de admin hacia `/admin/login`.
- Se marcaron explícitamente los artefactos legacy.
- Se reemplazó la documentación genérica por documentación del proyecto.

## Documentación

- [docs/architecture.md](/Users/jose/Documents/ProyectoWeb2/docs/architecture.md)
- [docs/modules.md](/Users/jose/Documents/ProyectoWeb2/docs/modules.md)
- [docs/flows.md](/Users/jose/Documents/ProyectoWeb2/docs/flows.md)
- [docs/conventions.md](/Users/jose/Documents/ProyectoWeb2/docs/conventions.md)
- [docs/technical-debt.md](/Users/jose/Documents/ProyectoWeb2/docs/technical-debt.md)

## Ejecución

### Backend Laravel

Desde [backend/app](/Users/jose/Documents/ProyectoWeb2/backend/app):

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend público

El frontend público sigue siendo multipágina estático. Para que consuma datos reales del blog, debe convivir en el mismo host que Laravel o detrás de un reverse proxy que exponga:

- `/admin/*` para el panel admin
- `/api/public/*` para datos públicos

## Decisiones de dominio

- `Post` es la entidad oficial del módulo `Blog`.
- `BlogPost` queda clasificado como modelo legacy/transicional.
- `AdminUser` es la entidad oficial del módulo `AdminAuth`.
- `Category`, `Product`, `Order` y `OrderItem` existen, pero aún no tienen integración pública completa.

# ProyectoWeb2

## Descripción

ProyectoWeb2 es una aplicación web híbrida orientada a la gestión y visualización de contenido para un negocio tipo e-commerce (Liquid Colors).

Incluye:

- Sitio público multipágina
- Panel administrativo en Laravel
- Gestión de publicaciones (blog)
- Base estructural para catálogo y pedidos

El objetivo del proyecto es demostrar una arquitectura profesional, mantenible y escalable sin recurrir a SPA ni microservicios.

---

## Arquitectura

Este proyecto sigue una arquitectura:

**Monolito modular híbrido**

- `frontend/` → sitio público multipágina (HTML/CSS/JS vanilla)
- `backend/app/` → Laravel 12 como única fuente de datos, lógica y autenticación
- No es SPA
- No usa React ni Vue
- No usa microservicios

---

## Objetivo del proyecto

- Demostrar diseño de arquitectura modular en Laravel
- Integrar frontend tradicional con backend moderno
- Evitar sobreingeniería innecesaria
- Servir como proyecto sólido de portafolio backend/fullstack

---

## Stack tecnológico

- Frontend: HTML5, CSS, Bootstrap 5, JavaScript vanilla
- Backend: PHP 8.2, Laravel 12
- Base de datos: SQLite (por defecto)
- Tooling: Vite, Tailwind (instalado pero no utilizado actualmente), Docker

---

## Estado del proyecto

### Flujos activos

- `AdminAuth`: login de administrador funcional
- `Blog`: CRUD completo de publicaciones en Laravel
- `PublicSite -> Blog`: consumo real desde `/api/public/blog-feed`

### Flujos en desarrollo

- `Catalog`: modelos definidos, sin integración completa
- `Orders`: modelos definidos, flujo no conectado end-to-end

---

## Legacy explícito

Estos archivos existen solo como referencia del prototipo inicial:

- `frontend/html/login.html`
- `frontend/scripts/admin-login.js`
- `frontend/html/blog-admin.html`
- `frontend/scripts/blog-admin.js`
- `frontend/php/public_feed.php`

No forman parte del flujo oficial.

---

## Estructura actual

```text
ProyectoWeb2/
├─ docs/
├─ frontend/
│  ├─ html/
│  ├─ css/
│  ├─ scripts/
│  ├─ imgs/
│  └─ php/
└─ backend/
   └─ app/
      ├─ app/
      ├─ bootstrap/
      ├─ config/
      ├─ database/
      ├─ public/
      ├─ resources/views/
      ├─ routes/
      └─ tests/
```

> Nota: la doble carpeta `app/app` corresponde a la estructura estándar de Laravel.

---

## Estructura objetivo

```text
ProyectoWeb2/
├─ docs/
├─ frontend/
│  ├─ html/
│  │  ├─ public/
│  │  └─ legacy/
│  ├─ css/
│  │  ├─ public/
│  │  └─ legacy/
│  ├─ scripts/
│  │  ├─ public/
│  │  └─ legacy/
│  ├─ imgs/
│  └─ php/legacy/
└─ backend/
   └─ app/
      ├─ app/
      │  ├─ Domain/
      │  │  ├─ AdminAuth/
      │  │  ├─ Blog/
      │  │  ├─ Catalog/
      │  │  ├─ Orders/
      │  │  ├─ Shared/
      │  │  └─ Infrastructure/
      │  └─ Http/
      ├─ database/
      ├─ public/
      ├─ resources/views/
      └─ routes/
```

---

## Modelo de dominio (resumen)

- `Post`: entidad principal del módulo Blog
- `AdminUser`: autenticación administrativa
- `Category` → tiene muchos `Product`
- `Product` → pertenece a `Category`
- `Order` → tiene muchos `OrderItem`
- `OrderItem` → pertenece a `Order` y `Product`

---

## Diagnóstico técnico

- Existía duplicidad de login (demo vs Laravel)
- Existía duplicidad en administración de blog
- El blog público usaba un feed PHP legacy
- Inconsistencia entre `Post` y `BlogPost`
- SQLite vs MySQL en Docker no alineados
- Código legacy mezclado con código activo

---

## Cambios aplicados

- Unificación del flujo admin en Laravel
- Corrección del consumo de `posts-json`
- Endpoint oficial para blog público (`/api/public/blog-feed`)
- Redirección de accesos admin a `/admin/login`
- Identificación clara de código legacy
- Reescritura de documentación

---

## Ejecución

### Backend Laravel

```bash
cd backend/app
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Acceso

- App: http://localhost:8000
- Admin: http://localhost:8000/admin/login
- API Blog: http://localhost:8000/api/public/blog-feed

---

## Usuario administrador

Define `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` en `backend/app/.env` antes de ejecutar:

```bash
php artisan migrate --seed
```

---

## Frontend público

El frontend es multipágina y estático.

Para consumir datos reales:
- Debe correr en el mismo host que Laravel
- O usar un proxy que exponga:
  - `/admin/*`
  - `/api/public/*`

---

## Documentación

- `docs/architecture.md`
- `docs/modules.md`
- `docs/flows.md`
- `docs/conventions.md`
- `docs/technical-debt.md`

---

## Decisiones de dominio

- `Post` es la entidad oficial del módulo Blog
- `BlogPost` es legacy
- `AdminUser` es la entidad de autenticación
- `Category`, `Product`, `Order`, `OrderItem` están definidos pero en integración progresiva

---

## Conclusión

Este proyecto prioriza:

- claridad arquitectónica
- consistencia
- mantenibilidad
- valor real de portafolio

Evitando sobreingeniería y enfocándose en una base sólida para crecimiento real.
