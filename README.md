# Evaluación 1 · API de la Copa Libertadores

API REST hecha con Node y Express que responde consultas sobre los clubes de la Copa Libertadores, agrupados por país y con los años de sus títulos.

## Cómo levantarlo

Requiere Node 20 o más nuevo y yarn.

```bash
yarn
yarn dev
```

El servidor queda en **http://localhost:3000** (se reinicia solo al guardar cambios gracias a `node --watch`).

## Rutas

| Ruta | Descripción |
|---|---|
| `GET /api/clubes` | Los 16 clubes |
| `GET /api/clubes/:id` | Un club por su id (404 si no existe) |
| `GET /api/clubes?pais=Chile` | Clubes de un país, sin importar mayúsculas (404 si el país no existe) |
| `GET /api/titulos/:club` | Años de títulos de un club por nombre (404 si el club no existe; `[]` si existe pero no ha ganado) |
| `GET /api/titulos` | Extra: todos los años de todos los clubes, ordenados |
| `GET /api/estadisticas` | Extra: total de clubes, total de títulos y títulos por país |

Los errores siempre se devuelven como JSON: `{ "error": "No existe el club 99" }`.

## Video

Enlace al video de explicación: https://youtu.be/h6Y8Yp0U95c
