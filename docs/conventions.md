# Convenciones

## Convenciones de arquitectura

- Una implementación oficial por flujo.
- Laravel controla autenticación, validación, persistencia y datos públicos.
- El frontend público no duplica lógica de negocio.
- Todo artefacto no oficial debe estar marcado como `LEGACY`.

## Convenciones de naming

### Modelos

- usar singular en PascalCase
- preferir nombres de dominio estables
- `Post` es oficial
- `BlogPost` y `BlogCategory` no deben crecer; son transicionales

### Tablas

- plural snake_case
- una tabla por agregado principal
- evitar tablas paralelas para el mismo concepto

### Rutas

- admin HTML: `/admin/...`
- JSON interno admin: `/admin/...-json` solo mientras dure la transición
- JSON público: `/api/public/...`

## Convenciones de frontend público

- HTML multipágina en `frontend/html`
- CSS global en `frontend/css/styles.css`
- un script por responsabilidad de página
- no agregar frameworks frontend nuevos

## Separación recomendada de scripts públicos

### Oficial

- `script.js`: home y formulario de pedido
- `products.js`: catálogo público
- `blog.js`: blog público y consumo de feed oficial

### Legacy

- `admin-login.js`
- `blog-admin.js`

## Convenciones de legacy

- agregar comentario `LEGACY` al inicio del archivo
- retirar enlaces desde navegación oficial
- documentar reemplazo oficial en `docs/technical-debt.md`

## Convenciones de documentación

- `README.md` resume el estado oficial del repo
- `docs/architecture.md` documenta decisiones
- `docs/modules.md` define límites
- `docs/flows.md` contiene el mapa técnico
- `docs/technical-debt.md` contiene deuda y plan

## Convenciones de crecimiento

- antes de agregar un flujo nuevo, definir módulo propietario
- antes de agregar una tabla, identificar controlador, vista y endpoint asociados
- antes de dejar un prototipo en repo, marcarlo como `legacy` o eliminarlo
