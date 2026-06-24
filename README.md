# Laundry POS Frontend

Sistema de Punto de Venta para Lavandería - Frontend

## Requisitos

- Node 18+
- Angular CLI 17+

## Instalación

```bash
npm install
```

## Ejecución en desarrollo

```bash
npm start
```

Abrir http://localhost:4200. El proxy de desarrollo redirige `/api` a `http://localhost:8082`.

## Compilación para producción

```bash
npm run build
```

El resultado queda en `dist/laundry-pos-frontend`.

## Docker

```bash
docker build -t laundry-frontend .
docker run -p 80:80 laundry-frontend
```

En producción, nginx dentro del contenedor redirige `/api` a `http://backend:8085/api`.

## Módulos

- **Auth** — Inicio de sesión
- **Dashboard** — Panel principal con órdenes activas
- **POS** — Punto de venta (crear órdenes, imprimir tickets, escanear códigos)
- **Clientes** — CRUD de clientes
- **Inventario** — Gestión de productos y stock
- **Servicios** — Tipos de servicio de lavandería
- **Proveedores** — CRUD de proveedores
- **Gastos** — Registro y consulta de gastos
- **Reportes** — Reportes de ventas (chart.js)
- **Cierre de Caja** — Apertura y cierre de caja

## API

Todas las rutas de API están hardcodeadas como `/api/...` en `ApiService`. El archivo `src/environments/environment.ts` existe pero **no se utiliza** en tiempo de ejecución.
