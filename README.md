# EcomercePractica — Guía de Setup

Monorepo Nx con NestJS (API), Angular (admin-web) y Prisma (PostgreSQL).

---

## 1. Crear workspace Nx

```bash
pnpm dlx create-nx-workspace@22.6.0 EcomercePractica
```

| Prompt | Selección |
|---|---|
| Which stack? | None (Minimal) |
| Package manager? | pnpm |
| Nx Cloud? | No |

```bash
cd EcomercePractica
```

Instalar plugins Nx como dependencias de desarrollo:

```bash
pnpm add -D -w @nx/nest @nx/angular @nx/webpack @nx/eslint @nx/jest @nx/playwright @nx/js
```

---

## 2. Aplicaciones

### API — NestJS

```bash
pnpm nx g @nx/nest:application --name=api --directory=apps/api
```

| Prompt | Selección |
|---|---|
| Linter? | eslint |
| Unit test? | jest |

### Frontend — Angular (admin-web)

```bash
$env:NX_IGNORE_UNSUPPORTED_TS_SETUP="true" pnpm nx g @nx/angular:application --name=admin-web --directory=apps/admin-web
```

| Prompt | Selección |
|---|---|
| Stylesheet? | css |
| Unit test? | jest |
| E2E? | playwright |
| Bundler? | esbuild |
| SSR? | No |

---

## 3. UI: FontAwesome + Tailwind CSS

```bash
pnpm add -w @fortawesome/angular-fontawesome @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons
```

```bash
pnpm add -w tailwindcss @tailwindcss/postcss autoprefixer
```

```bash
pnpm nx g @nx/angular:setup-tailwind --project=admin-web
```

> **Nota:** Nx genera un `postcss.config.cjs` incompatible con Tailwind v4.
> Se reemplaza por `.postcssrc.json` con el plugin correcto:

```powershell
Remove-Item apps/admin-web/postcss.config.cjs
Set-Content apps/admin-web/.postcssrc.json '{"plugins": {"@tailwindcss/postcss": {}}}'
```

```bash
pnpm add -w tailwind-merge
```

---

## 4. Librerías compartidas

### shared — utilidades compartidas

```bash
pnpm nx g @nx/js:library --name=shared --directory=libs/shared
```

| Prompt | Selección |
|---|---|
| Bundler? | none |
| Linter? | eslint |

### contracts — DTOs y tipos de API

```bash
$env:NX_IGNORE_UNSUPPORTED_TS_SETUP="true"; pnpm nx g @nx/js:library --name=contracts --directory=libs/shared/contracts
```

---

## 5. Base de datos — Prisma + PostgreSQL

### Instalar Prisma

```bash
pnpm add -w prisma@latest @prisma/client@latest
```

### Generar librería db

```bash
$env:NX_IGNORE_UNSUPPORTED_TS_SETUP="true"; pnpm nx g @nx/js:library --name=db --directory=libs/db
```

| Prompt | Selección |
|---|---|
| Bundler? | vite |
| Linter? | eslint |
| Test? | vitest |

### Inicializar Prisma

```bash
cd libs/db
npx prisma init --datasource-provider postgresql
```

### Instalar dependencias adicionales de DB

```bash
pnpm add -w @prisma/adapter-pg pg dotenv @types/node
```

### Generar cliente Prisma

```bash
pnpm prisma generate --schema=libs/db/prisma/schema.prisma
```

### Introspección — sincronizar schema desde DB existente

```bash
pnpm prisma db pull --schema=libs/db/prisma/schema.prisma
```

### Primera migración

Ejecutar desde `libs/db`:

```bash
cd libs/db
pnpm prisma migrate dev --config=prisma.config.ts --name init
```

---

## 6. Dependencias extra de API

```bash
pnpm add -w @nestjs/swagger @nestjs/config helmet @scalar/nestjs-api-reference cookie-parser @types/cookie-parser redis
pnpm add -D @types/express -w
```

---

## 7. Levantar en desarrollo

### API (NestJS)

```bash
pnpm nx serve api
```

### Frontend (Angular)

```bash
pnpm nx serve admin-web
```

> **Tip:** Si hay conflictos de dependencias, ejecutar desde la raíz:
> ```bash
> pnpm install --force
> ```

---

## Estructura del monorepo

```
EcomercePractica/
├── apps/
│   ├── api/              # NestJS — REST API
│   └── admin-web/        # Angular — Panel de administración
└── libs/
    ├── shared/
    │   └── contracts/    # DTOs y tipos compartidos entre API y frontend
    └── db/
        └── prisma/       # Schema y migraciones de Prisma
```
