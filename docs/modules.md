# Módulos

## Vista general

Los módulos oficiales del proyecto son:

1. `PublicSite`
2. `AdminAuth`
3. `Blog`
4. `Catalog`
5. `Orders`
6. `Shared/Core`
7. `Infrastructure`

## 1. PublicSite

### Responsabilidad

- páginas públicas multipágina
- integración visual
- consumo de endpoints públicos

### Archivos actuales

- [frontend/html/index.html](/Users/jose/Documents/ProyectoWeb2/frontend/html/index.html)
- [frontend/html/products.html](/Users/jose/Documents/ProyectoWeb2/frontend/html/products.html)
- [frontend/html/blog.html](/Users/jose/Documents/ProyectoWeb2/frontend/html/blog.html)
- [frontend/css/styles.css](/Users/jose/Documents/ProyectoWeb2/frontend/css/styles.css)
- [frontend/css/products.css](/Users/jose/Documents/ProyectoWeb2/frontend/css/products.css)
- [frontend/css/blog.css](/Users/jose/Documents/ProyectoWeb2/frontend/css/blog.css)
- [frontend/scripts/script.js](/Users/jose/Documents/ProyectoWeb2/frontend/scripts/script.js)
- [frontend/scripts/products.js](/Users/jose/Documents/ProyectoWeb2/frontend/scripts/products.js)
- [frontend/scripts/blog.js](/Users/jose/Documents/ProyectoWeb2/frontend/scripts/blog.js)

### Estado

- `index`: activo, pero aún con datos demo para catálogo y pedidos
- `products`: activo visualmente, datos demo
- `blog`: activo y ya orientado a endpoint oficial Laravel

## 2. AdminAuth

### Responsabilidad

- login admin
- sesión admin
- middleware de acceso

### Archivos actuales

- [backend/app/app/Http/Controllers/AdminAuthController.php](/Users/jose/Documents/ProyectoWeb2/backend/app/app/Http/Controllers/AdminAuthController.php)
- [backend/app/app/Http/Middleware/AdminAuth.php](/Users/jose/Documents/ProyectoWeb2/backend/app/app/Http/Middleware/AdminAuth.php)
- [backend/app/app/Models/AdminUser.php](/Users/jose/Documents/ProyectoWeb2/backend/app/app/Models/AdminUser.php)
- [backend/app/resources/views/admin/login.blade.php](/Users/jose/Documents/ProyectoWeb2/backend/app/resources/views/admin/login.blade.php)

### Estado

- activo

## 3. Blog

### Responsabilidad

- CRUD de publicaciones
- feed público del blog
- tipologías `noticia`, `articulo`, `pedido`

### Archivos actuales

- [backend/app/app/Http/Controllers/AdminPostController.php](/Users/jose/Documents/ProyectoWeb2/backend/app/app/Http/Controllers/AdminPostController.php)
- [backend/app/app/Http/Controllers/PublicBlogController.php](/Users/jose/Documents/ProyectoWeb2/backend/app/app/Http/Controllers/PublicBlogController.php)
- [backend/app/app/Models/Post.php](/Users/jose/Documents/ProyectoWeb2/backend/app/app/Models/Post.php)
- [backend/app/resources/views/admin/blog.blade.php](/Users/jose/Documents/ProyectoWeb2/backend/app/resources/views/admin/blog.blade.php)
- [backend/app/public/admin/blog-admin.js](/Users/jose/Documents/ProyectoWeb2/backend/app/public/admin/blog-admin.js)

### Estado

- activo

### Decisión de naming

- `Post` es la entidad oficial
- `BlogPost` queda legacy

## 4. Catalog

### Responsabilidad

- categorías
- productos
- ofertas

### Archivos actuales

- [backend/app/app/Models/Category.php](/Users/jose/Documents/ProyectoWeb2/backend/app/app/Models/Category.php)
- [backend/app/app/Models/Product.php](/Users/jose/Documents/ProyectoWeb2/backend/app/app/Models/Product.php)
- [backend/app/database/migrations/2025_11_20_222113_create_categories_table.php](/Users/jose/Documents/ProyectoWeb2/backend/app/database/migrations/2025_11_20_222113_create_categories_table.php)
- [backend/app/database/migrations/2025_11_20_222122_create_products_table.php](/Users/jose/Documents/ProyectoWeb2/backend/app/database/migrations/2025_11_20_222122_create_products_table.php)
- [backend/app/database/migrations/2025_11_20_222658_create_offers_table.php](/Users/jose/Documents/ProyectoWeb2/backend/app/database/migrations/2025_11_20_222658_create_offers_table.php)

### Estado

- incompleto

## 5. Orders

### Responsabilidad

- pedidos
- ítems de pedido
- notificaciones derivadas

### Archivos actuales

- [backend/app/app/Models/Order.php](/Users/jose/Documents/ProyectoWeb2/backend/app/app/Models/Order.php)
- [backend/app/app/Models/OrderItem.php](/Users/jose/Documents/ProyectoWeb2/backend/app/app/Models/OrderItem.php)
- [backend/app/database/migrations/2025_11_20_222136_create_orders_table.php](/Users/jose/Documents/ProyectoWeb2/backend/app/database/migrations/2025_11_20_222136_create_orders_table.php)
- [backend/app/database/migrations/2025_11_20_222143_create_order_items_table.php](/Users/jose/Documents/ProyectoWeb2/backend/app/database/migrations/2025_11_20_222143_create_order_items_table.php)
- [backend/app/database/migrations/2025_11_20_222802_create_notifications_table.php](/Users/jose/Documents/ProyectoWeb2/backend/app/database/migrations/2025_11_20_222802_create_notifications_table.php)

### Estado

- incompleto

## 6. Shared/Core

### Responsabilidad

- convenciones
- helpers comunes
- assets compartidos
- layout y estilos comunes

### Estado

- parcial

### Ejemplos actuales

- [frontend/css/styles.css](/Users/jose/Documents/ProyectoWeb2/frontend/css/styles.css)
- [backend/app/public/admin/styles.css](/Users/jose/Documents/ProyectoWeb2/backend/app/public/admin/styles.css)

## 7. Infrastructure

### Responsabilidad

- framework Laravel
- configuración
- base de datos
- Docker
- tooling

### Archivos actuales

- [backend/app/config/database.php](/Users/jose/Documents/ProyectoWeb2/backend/app/config/database.php)
- [backend/app/bootstrap/app.php](/Users/jose/Documents/ProyectoWeb2/backend/app/bootstrap/app.php)
- [docker-compose.yml](/Users/jose/Documents/ProyectoWeb2/docker-compose.yml)
- [backend/Dockerfile](/Users/jose/Documents/ProyectoWeb2/backend/Dockerfile)
- [backend/app/vite.config.js](/Users/jose/Documents/ProyectoWeb2/backend/app/vite.config.js)
- [backend/app/package.json](/Users/jose/Documents/ProyectoWeb2/backend/app/package.json)

### Estado

- activo, pero con deuda de alineación
