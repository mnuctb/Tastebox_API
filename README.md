# TasteBox API

API REST de TasteBox hecha con Node.js, Express y MySQL.

## Cómo ejecutarla

1. Instalar las dependencias con `npm install`.
2. En MySQL Workbench ejecutar `database/tastebox.sql` y después `database/seed.sql`.
3. Copiar `.env.example`, renombrar la copia a `.env` y poner la contraseña de MySQL.
4. Ejecutar `npm run dev`.

La API queda en `http://localhost:5000/api`.

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

## Carpetas

- `env`: lee la configuración del archivo `.env`.
- `services`: conexión a MySQL.
- `routes`: rutas de cada recurso.
- `middlewares`: usuario de la solicitud, permisos y errores.
- `validators`: revisión de los datos que llegan.
- `controllers`: reglas del negocio y respuestas.
- `dao`: consultas SQL.
- `utils`: constantes y funciones de apoyo.

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
