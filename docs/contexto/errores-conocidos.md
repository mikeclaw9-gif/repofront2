# Errores conocidos

## Código

1. **POS hardcodea userId: 1** (`pos.component.ts:276`)
   - `createOrder()` envía `userId: 1` fijo.
   - Todas las órdenes se crean como usuario 1 independientemente de quién inició sesión.

2. **ReportsComponent no implementa OnInit** (`reports.component.ts:88`)
   - La clase tiene `ngOnInit()` pero no dice `implements OnInit`.
   - TypeScript no da error porque el método existe, pero Angular podría no llamarlo si el component se instancia sin OnInit. Actualmente sí se llama porque Angular detecta el método por nombre (duck typing).

3. **SalesService filtra client-side** (`sales.service.ts:12-20`)
   - `getSalesByDateRange` descarga TODAS las órdenes y filtra en el frontend.
   - Con miles de órdenes será muy lento. El backend debería filtrar.

4. **DashboardComponent no refetch activeOrders en el polling**
   - El `interval(30000).pipe(switchMap(() => this.api.checkHealth()))` solo verifica health, no recarga `activeOrders`. Las órdenes activas solo se cargan una vez en `ngOnInit`.

5. **environment.apiUrl sin uso**
   - Definido en `environment.ts` y `environment.prod.ts` pero nunca importado en ningún servicio.

## Docker

6. **502 Bad Gateway si el backend no está disponible**
   - `nginx.conf` proxy a `http://api:8085/api`. Si `api` no resuelve (red Docker no compartida o backend caído), nginx responde 502.
   - Solución: asegurar que `docker-compose.yml` del frontend use la misma red `laundry-pos-network`.

7. **No hay .gitignore**
   - `node_modules/`, `dist/`, `.angular/cache/` no están excluidos.
   - Riesgo de commitear artefactos pesados.

## UI

8. **Tabla responsive solo hasta cierto punto**
   - `styles.scss` tiene media queries para `max-width: 767px` pero las tablas con muchas columnas se desbordan en móvil.

9. **Scanner de códigos usa BarcodeDetector API**
   - Solo disponible en Chrome Android y navegadores basados en Chromium recientes.
   - En iOS Safari o Firefox no funciona. El código muestra un toast "No disponible" pero no ofrece alternativa.

10. **No hay manejo de token expirado**
    - Si el JWT expira, las llamadas API fallarán con 401 pero no hay redirect automático a login.
    - El interceptor solo añade el header — no captura errores 401.
