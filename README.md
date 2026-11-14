# TasteBox API

API REST de TasteBox hecha con Node.js, Express y MySQL.

## Cómo ejecutarla

1. Instalar las dependencias con `npm install`.
2. En MySQL Workbench ejecutar `database/tastebox.sql` y después `database/seed.sql`.
3. Copiar `.env.example`, renombrar la copia a `.env` y poner la contraseña de MySQL. En `CORS_ORIGIN` va la dirección desde donde se abre el frontend (por defecto `http://localhost:5500`).
4. Ejecutar `npm run dev`.

Las fechas de `seed.sql` se calculan a partir del día en que se ejecuta. Así las suscripciones premium están vigentes, la caja semanal corresponde a la semana actual y el límite mensual del plan gratuito se puede probar en cualquier mes.

La API queda en `http://localhost:5000/api`.

## Contraseñas

Las contraseñas se guardan con hash bcrypt (factor de costo 12) en la columna `password_hash`. Cada hash lleva su propio salt aleatorio. El registro y el cambio de contraseña hashean antes de guardar, y el inicio de sesión compara contra el hash.

Si ya tienes una base creada con el esquema anterior (columna `password` en texto plano), no hace falta recrearla:

1. Ejecutar `database/migrations/001_password_hash.sql` en MySQL Workbench.
2. Ejecutar `npm run migrate:passwords`. El script convierte las contraseñas en texto plano y se puede repetir sin riesgo, porque omite las que ya son hash.

Una base nueva no necesita estos pasos, porque `tastebox.sql` y `seed.sql` ya incluyen el esquema y los hashes.

## Usuario que hace la solicitud

Después de iniciar sesión con `POST /api/sessions`, las rutas que necesitan un usuario reciben su id en el encabezado `X-User-Id`.

| id | Correo | Contraseña | Caso |
|----|--------|------------|------|
| 1 | admin@tastebox.com | Admin2026 | Administrador |
| 2 | daniela@correo.com | Daniela2026 | Plan gratuito con 3 recetas vistas este mes |
| 3 | hanna@correo.com | Hanna2026 | Premium |
| 4 | karen@correo.com | Karen2026 | Cuenta suspendida |
| 5 | manuel@correo.com | Manuel2026 | Premium vencido, ahora gratuito |
| 6 | juan@correo.com | Juan2026 | Premium |

Las contraseñas de esta tabla son solo para pruebas. En la base de datos se guardan como hash.

## Carpetas

- `env`: lee la configuración del archivo `.env`.
- `services`: conexión a MySQL.
- `routes`: rutas de cada recurso.
- `middlewares`: usuario de la solicitud, permisos y errores.
- `validators`: revisión de los datos que llegan.
- `controllers`: reglas del negocio y respuestas.
- `dao`: consultas SQL.
- `utils`: constantes, funciones de apoyo y hashing de contraseñas.
- `scripts`: migración de contraseñas en texto plano a hash.
- `database/migrations`: cambios de esquema respecto a versiones anteriores.
- `docs`: documentación OpenAPI, colección de Postman y diagrama entidad-relación.

## Endpoints

| Método | Ruta | Quién |
|--------|------|-------|
| POST | /api/sessions | Todos |
| POST | /api/users | Todos |
| GET | /api/users | Admin |
| GET, PATCH | /api/users/:userId | Dueño o admin |
| PATCH | /api/users/:userId/status | Admin |
| GET | /api/users/:userId/subscription | Dueño o admin |
| GET, POST | /api/users/:userId/subscriptions | Dueño o admin |
| GET, POST | /api/users/:userId/collection | Dueño o admin |
| DELETE | /api/users/:userId/collection/:recipeId | Dueño o admin |
| GET, POST | /api/users/:userId/cooking-activity | Dueño o admin |
| GET | /api/users/:userId/cooking-activity/summary | Dueño o admin |
| GET | /api/recipes | Todos |
| GET | /api/recipes/:recipeId | Usuario |
| POST | /api/recipes | Admin |
| PUT, DELETE | /api/recipes/:recipeId | Admin |
| PUT, DELETE | /api/recipes/:recipeId/ingredients/:ingredientId | Admin |
| GET | /api/recipes/:recipeId/reviews | Todos |
| POST | /api/recipes/:recipeId/reviews | Usuario |
| GET | /api/subscriptions | Admin |
| GET | /api/weekly-boxes/current | Usuario Premium |
| POST | /api/weekly-boxes | Admin |
| GET | /api/plans, /api/cuisine-types, /api/ingredients, /api/tags | Todos |
| POST | /api/ingredients | Admin |