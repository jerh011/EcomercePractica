```bash
$ pnpm dlx create-nx-workspace@22.6.0 EcomercePractica
```

#### ? Which stack?      →  None (Minimal)
#### ? Package manager?  →  pnpm
#### ? Nx Cloud?         →  No

```bash
$ cd EcomercePractica
```

```bash
$ pnpm add -D -w @nx/nest @nx/angular @nx/webpack @nx/eslint @nx/jest @nx/playwright @nx/js
```
```bash
$ pnpm nx g @nx/nest:application --name=api --directory=apps/api
```
#### ? Linter?     →  eslint
#### ? Unit test?  →  jest

```bash
$ $env:NX_IGNORE_UNSUPPORTED_TS_SETUP="true" pnpm nx g @nx/angular:application --name=admin-web --directory=apps/admin-web
```
#### ? Stylesheet?  →  css
#### ? Unit test?   →  jest
#### ? E2E?         →  playwright
#### ? Bundler?     →  esbuild
#### ? SSR?         →  N

```bash
$ pnpm nx serve api
```
```bash
$ pnpm nx serve admin-web
```

pnpm add -w @fortawesome/angular-fontawesome @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons

pnpm add -w tailwindcss @tailwindcss/postcss autoprefixer

pnpm nx g @nx/angular:setup-tailwind --project=admin-web

Remove-Item apps/admin-web/postcss.config.cjs

Set-Content apps/admin-web/.postcssrc.json '{"plugins": {"@tailwindcss/postcss": {}}}'

pnpm add -w tailwind-merge
