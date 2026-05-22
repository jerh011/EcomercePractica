export function requireBoolean(
  value: unknown,
  field: string,
  issues: string[],
) {
  if (typeof value !== 'boolean') {
    issues.push(`${field} must be a boolean`);
  }
}

export function optionalNullableBoolean(
  value: unknown,
  field: string,
  issues: string[],
) {
  if (value === undefined || value === null) {
    return;
  }
  if (typeof value !== 'boolean') {
    issues.push(`${field} must be a boolean`);
  }
}

export function optionalBoolean(
  value: unknown,
  field: string,
  issues: string[],
) {
  if (value === undefined) {
    return;
  }
  requireBoolean(value, field, issues);
}

export function optionalQueryBoolean(
  value: unknown,
  field: string,
  issues: string[],
): boolean | undefined {
  if (value === undefined || value === '') {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.toLowerCase();
    if (normalized === 'true') {
      return true;
    }
    if (normalized === 'false') {
      return false;
    }
  }

  issues.push(`${field} must be true or false`);
  return undefined;
}

export function legacyCoerceBoolean(value: unknown): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    if (value === 1) {
      return true;
    }
    if (value === 0) {
      return false;
    }
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();

    if (normalized === 'true' || normalized === '1') {
      return true;
    }

    if (
      normalized === 'false' ||
      normalized === '0' ||
      normalized === ''
    ) {
      return false;
    }
  }

  return Boolean(value);
}
