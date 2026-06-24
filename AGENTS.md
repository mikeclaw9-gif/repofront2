# Agents

## Commands

| Action | Command |
|--------|---------|
| Dev server | `npm start` (port 4200, `--host 0.0.0.0`, proxies `/api` → `http://127.0.0.1:8085`) |
| Build | `npm run build` → `dist/laundry-pos-frontend` |
| Test | `npm test` (Karma + Jasmine, ChromeHeadless via `karma-chrome-launcher`) |
| Lint | `npm run lint` — **not configured** (no eslint/tslint at root; `ng lint` will fail) |
| Docker | `docker compose up` (builds + serves on port 4200, uses external network `laundry-pos-network`) |

## Architecture

- **Angular 17 standalone** — no NgModules. `bootstrapApplication` in `src/main.ts` with `appConfig` from `src/app/app.config.ts`.
- **DI**: `inject()` only — no constructor injection anywhere.
- **Routing**: 10 lazy-loaded feature modules (`auth`, `dashboard`, `pos`, `clients`, `inventory`, `servicios`, `suppliers`, `reports`, `expenses`, `cash-closure`). Non-auth routes guarded with `authGuard` — redirects to `/auth`.
- **Auth**: JWT in `localStorage` (`token`, `username`, `role`). Functional `authInterceptor` adds `Authorization: Bearer`. Functional `authGuard` checks `AuthService.isLoggedIn()`.
- **API paths** hardcoded as `/api/...` in `ApiService` — `environment.apiUrl` is **not** used at runtime (both `environment.ts` and `environment.prod.ts` exist but are dead code).
- **Components** use inline templates/styles — no separate `.html`/`.css` files.
- **UI**: PrimeNG 17 + PrimeFlex + PrimeIcons. Theme: `lara-dark-blue`.
- **Charting**: chart.js (used in reports). Barcode: jsbarcode + native `BarcodeDetector` API for camera scanning.

## Gotchas

- `POSComponent.createOrder()` hardcodes `userId: 1` (`src/app/modules/pos/pos.component.ts:276`).
- No `.gitignore` — `git add` could commit `node_modules/`.
- Container runtime: nginx proxies `/api` → `http://api:8085/api` (Docker network, service name `api`, not `localhost`). Dev proxy targets `http://127.0.0.1:8085` (`proxy.conf.json`).

<!-- CODEGRAPH_START -->
## CodeGraph

In repositories indexed by CodeGraph (a `.codegraph/` directory exists at the repo root), reach for it BEFORE grep/find or reading files when you need to understand or locate code:

- **MCP tools** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them. `codegraph_node` returns one symbol's source + callers, or reads a whole file with line numbers. If the tools are listed but deferred, load them by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` and `codegraph node <symbol-or-file>` print the same output.

If there is no `.codegraph/` directory, skip CodeGraph entirely — indexing is the user's decision.
<!-- CODEGRAPH_END -->
