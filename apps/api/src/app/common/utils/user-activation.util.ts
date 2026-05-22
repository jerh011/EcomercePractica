import { createHash, randomBytes } from 'node:crypto';

const DEFAULT_ACTIVATION_TTL_HOURS = 24;

export function generateActivationToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashActivationToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function resolveActivationTokenTtlHours(): number {
  const rawValue = Number(process.env['USER_ACTIVATION_TOKEN_TTL_HOURS'] ?? 24);

  if (!Number.isFinite(rawValue) || rawValue <= 0) {
    return DEFAULT_ACTIVATION_TTL_HOURS;
  }

  return rawValue;
}

export function resolveActivationTokenExpiry(): Date {
  return new Date(
    Date.now() + resolveActivationTokenTtlHours() * 60 * 60 * 1000,
  );
}

export function resolveActivationExpirationText(): string {
  return `${resolveActivationTokenTtlHours()} horas`;
}

export function buildActivationUrl(token: string): string {
  const explicitUrl = process.env['ADMIN_ACTIVATION_URL'];

  if (explicitUrl) {
    return appendToken(explicitUrl, token);
  }

  const adminAccessUrl = process.env['ADMIN_ACCESS_URL'];

  if (adminAccessUrl) {
    try {
      const url = new URL(adminAccessUrl);
      url.pathname = '/activate';
      url.search = '';
      return appendToken(url.toString(), token);
    } catch {
      return appendToken(adminAccessUrl, token);
    }
  }

  const adminPort = process.env['ADMIN_PORT'] || '4200';
  return `http://localhost:${adminPort}/activate?token=${encodeURIComponent(token)}`;
}

export function resolveActivationResendLimitPerHour(): number {
  const rawValue = Number(
    process.env['USER_ACTIVATION_RESEND_LIMIT_PER_HOUR'] ?? 3,
  );

  if (!Number.isFinite(rawValue) || rawValue <= 0) {
    return 3;
  }

  return rawValue;
}

function appendToken(baseUrl: string, token: string): string {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set('token', token);
    return url.toString();
  } catch {
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}token=${encodeURIComponent(token)}`;
  }
}
