import { createHash, randomBytes } from 'node:crypto';

const DEFAULT_PASSWORD_RESET_TOKEN_TTL_HOURS = 2;

export function generatePasswordResetToken(size = 32): string {
  return randomBytes(size).toString('base64url');
}

export function hashPasswordResetToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function resolvePasswordResetTokenTtlHours(): number {
  const value = Number(process.env['USER_PASSWORD_RESET_TOKEN_TTL_HOURS']);

  return Number.isFinite(value) && value > 0
    ? Math.trunc(value)
    : DEFAULT_PASSWORD_RESET_TOKEN_TTL_HOURS;
}

export function resolvePasswordResetTokenExpiry(): Date {
  const expiresAt = new Date();
  expiresAt.setHours(
    expiresAt.getHours() + resolvePasswordResetTokenTtlHours(),
  );

  return expiresAt;
}

export function resolvePasswordResetExpirationText(): string {
  const hours = resolvePasswordResetTokenTtlHours();
  return hours === 1 ? '1 hora' : `${hours} horas`;
}

export function buildPasswordResetUrl(token: string): string {
  return `${buildPasswordResetRequestUrl()}?token=${encodeURIComponent(token)}`;
}

export function buildPasswordResetRequestUrl(): string {
  const explicitUrl = process.env['ADMIN_PASSWORD_RESET_URL']?.trim();

  if (explicitUrl) {
    return stripTokenQuery(explicitUrl);
  }

  const accessUrl = process.env['ADMIN_ACCESS_URL']?.trim();

  if (accessUrl) {
    try {
      const url = new URL(accessUrl);
      url.pathname = '/reset-password';
      url.search = '';
      return url.toString();
    } catch {
      return stripTokenQuery(accessUrl);
    }
  }

  const adminPort = process.env['ADMIN_PORT']?.trim() || '4200';
  return `http://localhost:${adminPort}/reset-password`;
}

function stripTokenQuery(urlValue: string): string {
  return urlValue
    .replace(/([?&])token=[^&#]*(&)?/iu, (_match, prefix, suffix) => {
      if (prefix === '?' && suffix) {
        return '?';
      }

      return '';
    })
    .replace(/[?&]$/u, '');
}
