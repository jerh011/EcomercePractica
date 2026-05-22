import 'dotenv/config';
import { defineConfig } from 'prisma/config';

console.log("DATABASE_URL:", process.env["DATABASE_URL"]);


export default defineConfig({
  schema: 'prisma/schemas',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL']!,
  },
});
