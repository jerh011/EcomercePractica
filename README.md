```bash
$ pnpm dlx create-nx-workspace@22.6.0 EcomercePractica
```

#### - ? Which stack?      →  None (Minimal)
#### - ? Package manager?  →  pnpm
#### - ? Nx Cloud?         →  No

```bash
$ cd EcomercePractica
```

```bash
$ pnpm add -D -w @nx/nest @nx/angular @nx/webpack @nx/eslint @nx/jest @nx/playwright @nx/js
```
```bash
$ pnpm nx g @nx/nest:application --name=api --directory=apps/api
```
#### - ? Linter?     →  eslint
#### - ? Unit test?  →  jest

```bash
$ $env:NX_IGNORE_UNSUPPORTED_TS_SETUP="true" pnpm nx g @nx/angular:application --name=admin-web --directory=apps/admin-web
```
#### - ? Stylesheet?  →  css
#### - ? Unit test?   →  jest
#### - ? E2E?         →  playwright
#### - ? Bundler?     →  esbuild
#### - ? SSR?         →  N

```bash
$ pnpm nx serve api
```
```bash
$ pnpm nx serve admin-web
```
```bash
$ pnpm add -w @fortawesome/angular-fontawesome @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons
```

```bash
$ pnpm add -w tailwindcss @tailwindcss/postcss autoprefixer
```

```bash
$ pnpm nx g @nx/angular:setup-tailwind --project=admin-web
```

```bash
$ Remove-Item apps/admin-web/postcss.config.cjs
```

```bash
$ Set-Content apps/admin-web/.postcssrc.json '{"plugins": {"@tailwindcss/postcss": {}}}'
```

```bash
$ pnpm add -w tailwind-merge
```

```bash
$ pnpm nx g @nx/js:library --name=shared --directory=libs/shared
```

#### - ? Bundler?  →  none
#### - ? Linter?   →  eslint

```bash
$ pnpm add -w prisma @prisma/client
```

```bash
$ $env:NX_IGNORE_UNSUPPORTED_TS_SETUP="true"; pnpm nx g @nx/js:library --name=db --directory=libs/db
```


#### - ? bundler → vite
#### - ? linter  → eslint
#### - ? test → vitest

```bash
$ cd libs/db
```

```bash
$ npx prisma init --datasource-provider postgresql
```

```bash
$ pnpm add -w prisma@6 @prisma/client@6
```

pnpm add -w dotenv


pnpm add -w prisma@latest @prisma/client@latest

pnpm add -w --save-dev @types/node


$env:NX_IGNORE_UNSUPPORTED_TS_SETUP="true"; pnpm nx g @nx/js:library --name=contracts --directory=libs/shared/contracts

pnpm add -w @nestjs/swagger

pnpm add -w @prisma/adapter-pg pg

pnpm prisma generate --schema=libs/db/prisma/schema.prisma

pnpm prisma generate --schema=libs/db/prisma/schema.prisma

pnpm add -w @nestjs/config helmet @scalar/nestjs-api-reference cookie-parser @types/cookie-parser

pnpm nx serve api verificar datos 
pnpm nx serve admin-web
