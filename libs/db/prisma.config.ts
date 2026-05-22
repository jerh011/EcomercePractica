import 'dotenv/config';
import { defineConfig } from 'prisma/config';

console.log("DATABASE_URL:", process.env["DATABASE_URL"]); // 👈 agregar esto


export default defineConfig({
  schema: 'prisma/',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL']!,
  },
});
