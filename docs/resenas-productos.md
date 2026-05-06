# Módulo de Reseñas de Productos

## ¿Qué hace?

Permite a los clientes dejar reseñas con calificación de 1 a 5 estrellas y un comentario en cualquier producto del catálogo. Las reseñas quedan pendientes de aprobación hasta que un administrador las revise desde el panel admin.

---

## Modelo de datos

**Tabla:** `resenas`

| Columna      | Tipo                | Descripción                                   |
|--------------|---------------------|-----------------------------------------------|
| `id`         | bigint PK           | Identificador único                           |
| `product_id` | bigint (index)      | ID del producto al que pertenece              |
| `nombre`     | string(100) null    | Nombre del cliente (opcional)                 |
| `email`      | string(180) null    | Email del cliente (opcional, no se muestra)   |
| `rating`     | tinyint (1–5)       | Calificación de 1 a 5 estrellas               |
| `comentario` | text                | Texto de la reseña (5–1000 caracteres)        |
| `aprobada`   | boolean (default 0) | Solo las aprobadas se muestran públicamente   |
| `created_at` | timestamp           | Fecha de creación                             |
| `updated_at` | timestamp           | Última actualización                          |

> **Nota:** `product_id` no tiene FK constraint para compatibilidad con los productos del catálogo demo del frontend.

---

## Endpoints públicos

### `GET /api/public/productos/{id}/resenas`

Devuelve las reseñas **aprobadas** de un producto, con estadísticas.

**Respuesta:**
```json
{
  "resenas": [
    {
      "id": 1,
      "nombre": "María G.",
      "rating": 5,
      "comentario": "Excelente calidad, lo recomiendo.",
      "created_at": "2026-05-06T12:00:00Z"
    }
  ],
  "promedio": 4.5,
  "total": 12,
  "distribucion": {
    "5": 8,
    "4": 2,
    "3": 1,
    "2": 1,
    "1": 0
  }
}
```

---

### `POST /api/public/productos/{id}/resenas`

Crea una reseña para un producto. La reseña queda con `aprobada = false`.

**Body JSON:**
```json
{
  "rating": 5,
  "comentario": "Muy buen producto, llegó rápido.",
  "nombre": "Carlos M.",
  "email": "carlos@ejemplo.com"
}
```

**Validaciones:**
- `rating`: requerido, entero, entre 1 y 5
- `comentario`: requerido, mínimo 5 caracteres, máximo 1000
- `nombre`: opcional, máximo 100 caracteres
- `email`: opcional, debe ser formato email válido

**Respuesta exitosa (201):**
```json
{
  "message": "Tu reseña fue enviada y está pendiente de aprobación."
}
```

**Respuesta con error (422):**
```json
{
  "message": "The rating field must be between 1 and 5.",
  "errors": { "rating": ["..."] }
}
```

> **CSRF:** Este endpoint está excluido de verificación CSRF para permitir peticiones desde el frontend estático.

---

## Endpoints admin (requieren sesión admin)

### `GET /admin/resenas`
Vista del panel de gestión de reseñas.

### `GET /admin/resenas-json`
Devuelve JSON con **todas** las reseñas (aprobadas y pendientes).

### `PATCH /admin/resenas/{id}/aprobar`
Aprueba una reseña (`aprobada = true`). La reseña pasa a ser visible públicamente.

### `PATCH /admin/resenas/{id}/rechazar`
Rechaza/desaprueba una reseña (`aprobada = false`).

### `DELETE /admin/resenas/{id}`
Elimina permanentemente una reseña.

---

## Cálculo del promedio

```
promedio = SUM(rating de reseñas aprobadas) / COUNT(reseñas aprobadas)
```

- Redondeado a 1 decimal.
- Si no hay reseñas aprobadas: `promedio = 0`, `total = 0`.
- Se calcula en PHP sobre la colección filtrada ya en memoria (sin query adicional).

---

## Cómo aprobar reseñas

1. Iniciar sesión en `/admin/login`
2. Ir a **Reseñas** en la barra de navegación del panel admin
3. Filtrar por "Pendientes" para ver solo las nuevas
4. Leer el comentario y hacer clic en **Aprobar**
5. La reseña aparecerá públicamente en el producto de inmediato

---

## Ejecutar la migración

```bash
cd backend/app
php artisan migrate
```

O si usas Docker:
```bash
docker exec -it <container_name> php artisan migrate
```

Para revertir:
```bash
php artisan migrate:rollback
```

---

## Pruebas manuales

### Crear reseña válida
```bash
curl -X POST http://localhost/api/public/productos/101/resenas \
  -H "Content-Type: application/json" \
  -d '{"rating": 5, "comentario": "Producto excelente, calidad premium.", "nombre": "Test User"}'
# Esperado: 201 con mensaje de aprobación pendiente
```

### Rating inválido (debe fallar con 422)
```bash
curl -X POST http://localhost/api/public/productos/101/resenas \
  -H "Content-Type: application/json" \
  -d '{"rating": 0, "comentario": "Texto de prueba válido"}'

curl -X POST http://localhost/api/public/productos/101/resenas \
  -H "Content-Type: application/json" \
  -d '{"rating": 6, "comentario": "Texto de prueba válido"}'
```

### Comentario muy corto (debe fallar con 422)
```bash
curl -X POST http://localhost/api/public/productos/101/resenas \
  -H "Content-Type: application/json" \
  -d '{"rating": 4, "comentario": "Ok"}'
```

### Verificar que no aparece hasta aprobar
```bash
# Ver reseñas públicas del producto (debe estar vacío o sin la nueva reseña)
curl http://localhost/api/public/productos/101/resenas
```

### Aprobar desde admin y verificar
```bash
# Aprobar (requiere sesión admin activa, usar desde navegador o herramienta con cookies)
curl -X PATCH http://localhost/admin/resenas/1/aprobar \
  -H "X-CSRF-TOKEN: <token>" \
  -b "laravel_session=<session_id>"

# Luego verificar que aparece públicamente
curl http://localhost/api/public/productos/101/resenas
```

---

## Seguridad implementada

- `aprobada` no está en `$fillable` del modelo: el frontend no puede enviarlo
- Comentarios escapados con `escapeHTML()` en el frontend para prevenir XSS
- Validación de rating solo en backend (1–5), no solo en frontend
- Comentario limitado a 1000 caracteres en BD y validación
- Reseñas pendientes invisibles públicamente hasta aprobación manual
- Endpoints admin protegidos con middleware `admin.auth` (sesión)
