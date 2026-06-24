# Arquitectura

## Stack

| Capa       | Tecnología                          |
|------------|-------------------------------------|
| Framework  | Angular 17 standalone               |
| Lenguaje   | TypeScript 5.2                      |
| UI         | PrimeNG 17 + PrimeFlex 3.3 + PrimeIcons 6 |
| Charting   | chart.js 4.4                        |
| Código barras | jsbarcode 3.12                   |
| Fuente     | Inter (vía @fontsource/inter)       |
| Testing    | Jasmine + Karma                     |
| Servidor   | nginx (Docker) / ng serve (dev)     |

## Mapa de carpetas

```
src/
  main.ts                          # bootstrapApplication
  index.html                       # lang="es"
  styles.scss                      # Inter, .card, responsive overrides
  environments/
    environment.ts                 # No usado en runtime
    environment.prod.ts
  app/
    app.component.ts               # Solo <router-outlet>
    app.config.ts                  # provideRouter, provideHttpClient, provideAnimations
    app.routes.ts                  # 10 rutas lazy, authGuard en todas menos /auth
    core/
      models/auth.models.ts        # Interfaces: LoginRequest/Response, User, Client, Order, Product, etc.
      interceptors/auth.interceptor.ts  # Inyecta Bearer token
      guards/auth.guard.ts         # isLoggedIn() → true o redirect a /auth
      services/
        auth.service.ts            # login, logout, localStorage JWT
        api.service.ts             # ~40 endpoints CRUD, rutas hardcodeadas /api/...
        sales.service.ts           # getSalesByDateRange con filtro client-side
    shared/components/
      layout.component.ts          # Sidebar + router-outlet, responsive
      sidebar.component.ts         # Nav, username, logout
    modules/ (10 lazy modules)
      auth/login.component.ts
      dashboard/dashboard.component.ts
      pos/pos.component.ts
      clients/clients.component.ts
      inventory/inventory.component.ts
      servicios/servicios.component.ts
      suppliers/suppliers.component.ts
      reports/reports.component.ts
      expenses/expenses.component.ts
      cash-closure/cash-closure.component.ts
```

## Flujo de datos

1. AuthService.login() → POST /api/auth/login → guarda `token`, `username`, `role` en localStorage
2. authInterceptor lee `token` del localStorage y lo añade como `Authorization: Bearer`
3. authGuard consulta AuthService.isLoggedIn() en cada navegación (rutas protegidas)
4. ApiService llama a `/api/...` (hardcodeado, environment.apiUrl NO se usa)
5. nginx (Docker) proxies `/api` → `http://api:8085/api`
6. ng serve (dev) proxies `/api` → `http://localhost:8085` (proxy.conf.json)

## Qué NO existe

- [PENDIENTE: No hay NgModules — todo es standalone]
- [PENDIENTE: No hay Signals, solo RxJS]
- [PENDIENTE: No hay .gitignore]
- [PENDIENTE: No hay docker-compose.yml en el backend — solo existe el del frontend]
- [PENDIENTE: No hay tests unitarios escritos todavía (infraestructura Karma presente)]
- [PENDIENTE: environment.apiUrl está definido pero nunca se referencia en código]
