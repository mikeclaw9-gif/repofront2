# Agents

## Commands

| Action | Command |
|--------|---------|
| Dev server | `npm start` (port 4200, `--host 0.0.0.0`, proxies `/api` → `http://127.0.0.1:8085`) |
| Build | `npm run build` → `dist/laundry-pos-frontend` |
| Test | `npm test` (Karma + Jasmine, ChromeHeadless) — **infrastructure only; no `.spec.ts` tests exist yet** |
| Lint | `npm run lint` — **not configured** (no eslint/tslint; `ng lint` will fail) |
| Docker | `docker compose up` (builds + serves on port 4200, uses external network `laundry-pos-network`) |

## Architecture

- **Angular 17 standalone** — `bootstrapApplication` in `src/main.ts` with `appConfig` from `src/app/app.config.ts`. No NgModules anywhere.
- **DI**: `inject()` only — no constructor injection in any file.
- **Routing**: 10 lazy-loaded feature modules (`auth`, `dashboard`, `pos`, `clients`, `inventory`, `servicios`, `suppliers`, `reports`, `expenses`, `cash-closure`). All non-auth routes are children under `LayoutComponent` and guarded with `authGuard` — redirects to `/auth`. Default redirect: `/` → `/auth`.
- **Auth**: JWT in `localStorage` (`token`, `username`, `role`). Functional `authInterceptor` adds `Authorization: Bearer`. Functional `authGuard` checks `AuthService.isLoggedIn()`. No 401 handling — expired tokens cause silent API failures.
- **API paths** hardcoded as `/api/...` in `ApiService` — `environment.apiUrl` is **dead code** in both `environment.ts` and `environment.prod.ts` (never imported).
- **Components** use inline templates/styles — no separate `.html`/`.css` files.
- **UI**: PrimeNG 17 + PrimeFlex + PrimeIcons. Theme: `lara-dark-blue`. Font: Inter (`@fontsource/inter`).
- **Charting**: chart.js. **Barcode**: jsbarcode for generation; native `BarcodeDetector` API for camera scanning (Chrome Android / Chromium only).
- **RxJS**: direct `subscribe()` calls — no `async` pipe, no Signals.
- **State**: No global store — each component loads its own data from the API on init.

## Gotchas

- `POSComponent.createOrder()` hardcodes `userId: 1` (`src/app/modules/pos/pos.component.ts:276`) — all orders created as user 1.
- No `.gitignore` at repo root — `git add` could commit `node_modules/`, `dist/`, `.angular/cache/`.
- Container: nginx proxies `/api` → `http://api:8085/api` (Docker network, service name `api`). Dev proxy targets `http://127.0.0.1:8085` (`proxy.conf.json`).
- `README.md` says dev proxy targets `localhost:8082` — **wrong**; the actual proxy config uses `127.0.0.1:8085`. Trust `proxy.conf.json` over the README.
- `SalesService.getSalesByDateRange()` fetches ALL orders and filters client-side — expensive at scale.
- `DashboardComponent` polls health every 30s but does not refresh `activeOrders` after initial load.
- `ReportsComponent` has `ngOnInit()` but no `implements OnInit` — works by duck typing but is technically fragile.
- API models are all in `src/app/core/models/auth.models.ts`.

## Deep docs

`docs/contexto/` has Spanish-language background: architecture (`docs/contexto/arquitectura.md`), conventions (`docs/contexto/convenciones.md`), known errors (`docs/contexto/errores-conocidos.md`), workflow (`docs/contexto/flujo-de-trabajo.md`), and a glossary (`docs/contexto/glosario.md`). These are more verbose than AGENTS.md but contain all the domain context.

<!-- CODEGRAPH_START -->
## CodeGraph

In repositories indexed by CodeGraph (a `.codegraph/` directory exists at the repo root), reach for it BEFORE grep/find or reading files when you need to understand or locate code:

- **MCP tools** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them. `codegraph_node` returns one symbol's source + callers, or reads a whole file with line numbers. If the tools are listed but deferred, load them by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` and `codegraph node <symbol-or-file>` print the same output.

If there is no `.codegraph/` directory, skip CodeGraph entirely — indexing is the user's decision.
<!-- CODEGRAPH_END -->
