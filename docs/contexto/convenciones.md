# Convenciones

## Estilo y naming

- **Componentes standalone**: `bootstrapApplication` en `main.ts`, sin NgModules
- **Inyección de dependencias**: Solo `inject()` — prohibido constructor injection
- **Archivos**: Sin archivos separados `.html`/`.css` — template y styles inline en el `.ts`
- **Prefijo de componentes**: `app-` (configurado en `angular.json`)
- **Naming de rutas**: `snake-case` para URLs (`/cash-closure`, `/servicios`)
- **Naming de servicios**: `PascalCase.service.ts` (ej: `AuthService`, `ApiService`)

## Patrones usados

- Guards y interceptores funcionales (no clases)
- Servicios con `providedIn: 'root'`
- Lazy loading en todas las rutas de módulos
- Interfaces agrupadas en `core/models/auth.models.ts`
- Subscripciones RxJS con `subscribe()` directo (no `async` pipe)
- DI vía `inject()` llamado en campo de clase o `ngOnInit`

## Patrones prohibidos

- Constructor injection (no usado en ningún archivo)
- NgModules (no existe ningún `@NgModule`)
- Estado global compartido entre componentes (cada componente carga sus datos vía API)

## Tests

- Framework: Jasmine + Karma (configurado en `angular.json`)
- [PENDIENTE: No se encontraron archivos `.spec.ts` ni tests escritos]
- Comando: `npm test` (ng test)

## Commits

- [PENDIENTE: No se detectó convención explícita de commits]
- Commits observados: mensajes en español e inglés mixtos
