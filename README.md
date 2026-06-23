# Shopify Orders — Frontend (Vue 3)

Panel operativo para visualizar órdenes Shopify e inventario de materiales de empaque en tiempo real.

## Stack

- **Vue 3** Composition API + TypeScript
- **Pinia** — gestión de estado
- **TailwindCSS** — estilos
- **Vite** — bundler y dev server

## Requisitos

- Node.js 20+
- Backend NestJS corriendo (ver repositorio `shopify-orders-backend`)

## Instalación

```bash
npm install
cp .env.example .env     # editar VITE_API_URL si el backend corre en otro puerto
npm run dev              # http://localhost:5173
```

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_API_URL` | URL base del backend NestJS | `http://localhost:3000` |

> **Nota:** Solo las variables con prefijo `VITE_` son accesibles en el navegador.  
> Nunca pongas secretos (tokens, contraseñas) en este archivo.

## Scripts

```bash
npm run dev        # Servidor de desarrollo con HMR
npm run build      # Build de producción (output en /dist)
npm run preview    # Preview del build de producción
npm run test       # Tests unitarios (Vitest)
npm run lint       # Lint con ESLint
```

## Funcionalidades del panel

- **KPI cards** — total órdenes, pendientes, procesadas, fallidas
- **Tabla de órdenes** — paginación, filtro por estado, materiales expandibles
- **Inventario** — stock de los 6 materiales (rojo si stock < 10)
- **Auto-refresh** — inventario se actualiza cada 30 segundos
- **Toast notifications** — errores de conexión con animación
- Paleta de colores Shopify Admin (`#008060`)

## Estructura

```
src/
  views/          # DashboardView — panel principal
  stores/         # useOrdersStore, useInventoryStore (Pinia)
  components/     # StatusBadge, SkeletonRow, ToastNotification
  router/         # Vue Router
```
