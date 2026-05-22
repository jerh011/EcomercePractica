import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const prismaGlobalKey = '__repoPrisma';

function findWorkspaceEnvFile() {
  const candidates = [
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), '..', '.env'),
    resolve(process.cwd(), '..', '..', '.env'),
    resolve(__dirname, '..', '..', '..', '.env'),
  ];

  return candidates.find((candidate) => existsSync(candidate));
}

function expandEnvValue(value: string) {
  return value.replace(/\$\{([^}]+)\}/g, (_, key: string) => {
    return process.env[key] ?? '';
  });
}

const envFile = findWorkspaceEnvFile();

if (envFile) {
  loadEnv({ path: envFile, override: false });
}

const rawConnectionString =
  process.env['NODE_ENV'] === 'production'
    ? process.env['DB_URL']
    : process.env['LOCAL_DB_URL'];
const connectionString = rawConnectionString
  ? expandEnvValue(rawConnectionString)
  : undefined;

if (!connectionString) {
  throw new Error(
    'Database connection string is missing. Set LOCAL_DB_URL for development or DB_URL for production.',
  );
}

const existingPrisma = Reflect.get(globalThis, prismaGlobalKey);

export const prisma =
  existingPrisma ??
  new PrismaClient({
    adapter: new PrismaPg(connectionString),
  });

if (process.env['NODE_ENV'] !== 'production') {
  Reflect.set(globalThis, prismaGlobalKey, prisma);
}

export * from '@prisma/client';
