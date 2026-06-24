# Flujo de trabajo

## Pasos para hacer un cambio

1. **Entender el módulo afectado** — revisar `app.routes.ts` para ver la ruta y su lazy module
2. **Localizar el componente** en `src/app/modules/<modulo>/<modulo>.component.ts`
3. **Si es nuevo endpoint**, agregar método en `core/services/api.service.ts` y la interface en `core/models/auth.models.ts`
4. **Si es nueva ruta**, agregar en `app.routes.ts` y crear archivo `<modulo>.routes.ts`
5. **Si es nuevo módulo**, crear carpeta en `modules/` con `*.routes.ts` y `*.component.ts`
6. **Ejecutar `npm start`** y verificar en http://localhost:4200
7. **Si hay tests**, ejecutar `npm test`

## Checklist de "terminado"

- [ ] Compila sin errores (`npm run build`)
- [ ] Proxy funciona en desarrollo (`npm start`)
- [ ] Docker build exitoso (`docker build -t test .`)
- [ ] No se rompen rutas existentes (probar navegación entre módulos)
- [ ] Si agregaste dependencia: `package.json` actualizado, `npm install` ejecutado

## Deploy

### Desarrollo local

```bash
npm start
# http://localhost:4200
```

### Build producción

```bash
npm run build
# Resultado en dist/laundry-pos-frontend/
```

### Docker (frontend solo)

```bash
docker compose up
# http://localhost:80
```

### Docker + backend

Levantar primero el backend, luego el frontend:

```bash
# Terminal 1
cd ~/Documentos/laundry/laundry-pos-backend
docker compose up -d

# Terminal 2
cd ~/Documentos/laundry/laundry-pos-frontend
docker compose up
```

[PENDIENTE: No hay pipeline CI/CD configurado]
[PENDIENTE: No hay script de deploy a producción]
