import { createHash, randomBytes } from 'node:crypto';

const DEFAULT_EMAIL_CHANGE_TOKEN_TTL_HOURS = 24;

export function generateEmailChangeToken(size = 32): string {
  return randomBytes(size).toString('base64url');
}

export function hashEmailChangeToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function resolveEmailChangeTokenTtlHours(): number {
  const value = Number(process.env['USER_EMAIL_CHANGE_TOKEN_TTL_HOURS']);

  return Number.isFinite(value) && value > 0
    ? Math.trunc(value)
    : DEFAULT_EMAIL_CHANGE_TOKEN_TTL_HOURS;
}

export function resolveEmailChangeTokenExpiry(): Date {
  const expiresAt = new Date();
  expiresAt.setHours(
    expiresAt.getHours() + resolveEmailChangeTokenTtlHours(),
  );

  return expiresAt;
}

export function resolveEmailChangeExpirationText(): string {
  const hours = resolveEmailChangeTokenTtlHours();
  return hours === 1 ? '1 hora' : `${hours} horas`;
}

export function buildEmailChangeConfirmationUrl(token: string): string {
  const explicitUrl = process.env['ADMIN_EMAIL_CHANGE_CONFIRMATION_URL']?.trim();

  if (explicitUrl) {
    return appendTokenQuery(explicitUrl, token);
  }

  const accessUrl = process.env['ADMIN_ACCESS_URL']?.trim();

  if (accessUrl) {
    try {
      const url = new URL(accessUrl);
      url.pathname = '/confirm-email-change';
      url.search = '';
      return appendTokenQuery(url.toString(), token);
    } catch {
      return appendTokenQuery(accessUrl, token);
    }
  }

  const adminPort = process.env['ADMIN_PORT']?.trim() || '4200';
  return `http://localhost:${adminPort}/confirm-email-change?token=${encodeURIComponent(token)}`;
}

function appendTokenQuery(baseUrl: string, token: string): string {
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}token=${encodeURIComponent(token)}`;
}
