# Decisiones técnicas

## Angular 17 standalone (sin NgModules)

**Por qué**: Angular 17 introdujo `bootstrapApplication` como approach oficial. Elimina boilerplate de módulos.

**Descartado**: Arquitectura tradicional con `AppModule`. No hay `@NgModule` en el código.

## Inyección funcional con inject()

**Por qué**: Consistente con standalone — `inject()` es la API recomendada desde Angular 14+. El proyecto la usa en todos los servicios, guards, interceptores y componentes.

**Descartado**: Constructor injection. No existe ni un solo `constructor(private ...)` en el proyecto.

## JWT en localStorage (no HttpOnly cookies)

**Por qué**: Simplicidad. El frontend lee/escribe `token`, `username` y `role` directamente.

**Consecuencia**: El interceptor funcional `authInterceptor` lee el token sincrónicamente. No hay mecanismo de refresh — si el token expira, toca volver a login.

## API paths hardcodeados en ApiService

**Por qué**: `environment.apiUrl` está definido pero nunca se importa. Todas las rutas son `/api/...` directamente.

**Detalle**: El proxy de desarrollo (`proxy.conf.json`) redirige `/api` → `localhost:8085`. En Docker, nginx redirige `/api` → `api:8085`.

## Dashboard polling (setInterval + switchMap cada 30s)

**Por qué**: Reflejar estado del servidor en tiempo real sin WebSockets.

**Riesgo**: No hay reconexión si falla — el `switchMap` cancela la suscripción anterior pero `interval` sigue emitiendo.

## POS hardcodea userId: 1

**Por qué**: No hay sesión de usuario real implementada en `createOrder()`. El backend asigna automáticamente o se dejó como placeholder.

**Riesgo**: En multi-usuario real, todas las órdenes se crearían con userId=1.

## SalesService filtra client-side

**Por qué**: `getSalesByDateRange` obtiene TODAS las órdenes y filtra en el frontend por fecha. No existe endpoint de filtro por rango en el backend (aparentemente).

**Riesgo**: Ineficiente con miles de órdenes.
