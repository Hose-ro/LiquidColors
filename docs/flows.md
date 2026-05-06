# Flujos y mapa técnico

## Fuente de verdad

- `AdminAuth`: tabla `admin_users`
- `Blog`: tabla `posts`
- `Public blog feed`: tabla `posts`
- `Catalog`: tablas `categories`, `products`, `offers`
- `Orders`: tablas `orders`, `order_items`, `notifications`

## Mapa técnico

| Ruta o entrada | Controlador | Método | Vista / JSON | Modelos | Tablas | Módulo | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/admin/login` GET | `AdminAuthController` | `showLogin` | `admin.login` | `AdminUser` | `admin_users` | `AdminAuth` | activo |
| `/admin/login` POST | `AdminAuthController` | `login` | redirect | `AdminUser` | `admin_users`, `sessions` | `AdminAuth` | activo |
| `/admin/logout` GET | `AdminAuthController` | `logout` | redirect | none | `sessions` | `AdminAuth` | activo |
| `/admin/dashboard` GET | closure redirect | inline | redirect a `/admin/posts` | none | none | `AdminAuth` | legacy alias |
| `/admin/blog` GET | closure redirect | inline | redirect a `/admin/posts` | none | none | `Blog` | legacy alias |
| `/admin/posts` GET | `AdminPostController` | `index` | `admin.blog` | `Post` | `posts` | `Blog` | activo |
| `/admin/posts-json` GET | `AdminPostController` | `listJson` | JSON | `Post` | `posts` | `Blog` | activo |
| `/admin/posts` POST | `AdminPostController` | `store` | JSON o redirect | `Post` | `posts` | `Blog` | activo |
| `/admin/posts/{id}` GET | `AdminPostController` | `show` | JSON | `Post` | `posts` | `Blog` | activo |
| `/admin/posts/{id}` PUT | `AdminPostController` | `update` | JSON o redirect | `Post` | `posts` | `Blog` | activo |
| `/admin/posts/{id}` DELETE | `AdminPostController` | `destroy` | JSON o redirect | `Post` | `posts` | `Blog` | activo |
| `/api/public/blog-feed` GET | `PublicBlogController` | `feed` | JSON | `Post` | `posts` | `PublicSite`, `Blog` | activo |
| `frontend/html/index.html` | none | static | HTML | none | none | `PublicSite` | activo |
| `frontend/html/products.html` | none | static | HTML | none | none | `PublicSite`, `Catalog` | activo con datos demo |
| `frontend/html/blog.html` | none | static | HTML + fetch JSON | none en cliente | `posts` vía API | `PublicSite`, `Blog` | activo |
| `frontend/html/login.html` | none | static | HTML | none | none | `AdminAuth` | legacy |
| `frontend/html/blog-admin.html` | none | static | HTML | none | none | `Blog` | legacy |
| `frontend/php/public_feed.php` | PHP legacy | file | JSON | none oficiales | esquema ajeno | `Blog` | legacy |

## Flujos end-to-end

## 1. Login admin

1. Usuario entra a `/admin/login`.
2. `AdminAuthController@login` valida credenciales.
3. Laravel crea sesión manual usando `admin_logged`.
4. Middleware `admin.auth` protege el panel.

## 2. CRUD de publicaciones admin

1. Usuario autenticado entra a `/admin/posts`.
2. La vista Blade carga `backend/app/public/admin/blog-admin.js`.
3. El script consume `/admin/posts-json`.
4. Altas, ediciones y bajas pegan a `/admin/posts*`.
5. `Post` persiste contra `posts`.

## 3. Blog público

1. Usuario entra a `frontend/html/blog.html`.
2. `frontend/scripts/blog.js` consume `/api/public/blog-feed`.
3. Laravel transforma `posts` publicados en:
   - `notices`
   - `posts`
   - `deliveries`
4. El sitio público renderiza contenido real.

## 4. Catálogo público actual

1. Usuario entra a `frontend/html/products.html`.
2. `frontend/scripts/products.js` usa `ALL_PRODUCTS`.
3. No hay lectura real desde Laravel.

Estado: incompleto.

## 5. Formulario de pedido actual

1. Usuario usa formulario en `frontend/html/index.html`.
2. `frontend/scripts/script.js` calcula total local.
3. No existe persistencia real en `orders`.

Estado: incompleto.
