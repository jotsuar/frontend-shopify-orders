# Shopify Orders — Frontend (Vue 3)

Panel operativo para visualizar órdenes Shopify e inventario de materiales de empaque en tiempo real.

## Stack

- **Vue 3** Composition API + TypeScript
- **Pinia** — gestión de estado
- **TailwindCSS** — estilos
- **Vite** — bundler y dev server

---

## 🐳 Levante con Docker (recomendado)

Solo necesitas **Docker Desktop** instalado. El frontend se sirve dentro de un contenedor con Vite en modo desarrollo.

### 1. Configurar variables de entorno

```bash
cp .env.example .env
```

> Por defecto `VITE_API_URL=http://localhost:3000`. Cámbialo si el backend corre en otro host o puerto.

### 2. Construir y levantar el contenedor

```bash
docker build -t shopify-frontend .
docker run -d \
  --name shopify_frontend \
  -p 5173:5173 \
  --env-file .env \
  shopify-frontend
```

El panel queda disponible en **http://localhost:5173**

### Detener el contenedor

```bash
docker stop shopify_frontend
docker rm shopify_frontend
```

---

## 💻 Levante sin Docker (manual)

Requisitos previos: Node.js 20+

```bash
npm install
cp .env.example .env     # Ajustar VITE_API_URL si el backend corre en otro puerto
npm run dev              # http://localhost:5173
```

---

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_API_URL` | URL base del backend NestJS | `http://localhost:3000` |

> **Importante:** Solo las variables con prefijo `VITE_` son expuestas al navegador por Vite.  
> Nunca incluyas tokens, contraseñas ni secretos en este archivo.

---

## Scripts

```bash
npm run dev        # Servidor de desarrollo con HMR en http://localhost:5173
npm run build      # Build de producción (output en /dist)
npm run preview    # Preview del build de producción
npm run test       # Tests unitarios con Vitest
npm run lint       # Lint con ESLint
```

---

## Funcionalidades del panel

- **KPI cards** — total órdenes, pendientes, procesadas, fallidas
- **Tabla de órdenes** — paginación, filtro por estado (ALL / PENDING / PROCESSED / FAILED)
- **Materiales expandibles** — al hacer clic en una orden se muestran los materiales consumidos
- **Panel de inventario** — stock de los 6 materiales (rojo si stock < 10, verde si OK)
- **Auto-refresh** — inventario se actualiza automáticamente cada 30 segundos
- **Toast notifications** — errores de conexión con animación de entrada/salida
- Paleta de colores Shopify Admin (`#008060`)

---

## Estructura

```
src/
  views/
    DashboardView.vue     # Panel principal (KPIs + órdenes + inventario)
  stores/
    useOrdersStore.ts     # Fetch, filtros y paginación de órdenes (Pinia)
    useInventoryStore.ts  # Fetch e inventario con auto-refresh (Pinia)
  components/
    StatusBadge.vue       # Badge de color según estado de la orden
    SkeletonRow.vue       # Skeleton loader durante la carga inicial
    ToastNotification.vue # Notificaciones de error con animación
  router/
    index.ts              # Ruta raíz → DashboardView
```
