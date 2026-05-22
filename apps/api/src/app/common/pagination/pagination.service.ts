import { BadRequestException, Injectable } from '@nestjs/common';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

const DEFAULT_CURSOR_TTL_MS = 24 * 60 * 60 * 1000;

export type CursorDirection = 'after' | 'before';

interface CursorTokenClaims<Keys extends Record<string, unknown>> {
  v: string;
  dir: CursorDirection;
  keys: Keys;
  fh?: string;
  iat: number;
  exp: number;
}

export interface OffsetPaginationWindow {
  page: number;
  pageSize: number;
  offset: number;
}

export interface OffsetPaginationMetadata {
  totalCount: number;
  totalPages: number;
}

export interface CursorPaginationWindow<Row> {
  rows: Row[];
  hasMore: boolean;
}

export interface CursorPaginationMetadata {
  nextCursor?: string;
  prevCursor?: string;
}

export interface CursorPagePosition<Keys extends Record<string, unknown>> {
  keys: Keys;
  isBackward: boolean;
}

@Injectable()
export class PaginationService {
  offsetWindow(
    page: number | undefined,
    pageSize: number,
  ): OffsetPaginationWindow {
    const resolvedPage = page ?? 1;

    return {
      page: resolvedPage,
      pageSize,
      offset: (resolvedPage - 1) * pageSize,
    };
  }

  offsetMetadata(
    totalCount: number,
    pageSize: number,
  ): OffsetPaginationMetadata {
    return {
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }

  cursorWindow<Row>(
    rows: Row[],
    pageSize: number,
    isBackward: boolean,
  ): CursorPaginationWindow<Row> {
    const hasMore = rows.length > pageSize;
    const visibleRows = hasMore ? rows.slice(0, pageSize) : [...rows];

    if (isBackward) {
      visibleRows.reverse();
    }

    return {
      rows: visibleRows,
      hasMore,
    };
  }

  cursorMetadata<Row>(
    rows: Row[],
    options: {
      isBackward: boolean;
      hasAnchor: boolean;
      hasMore: boolean;
      createCursor: (row: Row, direction: CursorDirection) => string;
    },
  ): CursorPaginationMetadata {
    if (rows.length === 0) {
      return {};
    }

    const metadata: CursorPaginationMetadata = {};

    if ((!options.isBackward && options.hasMore) || options.isBackward) {
      metadata.nextCursor = options.createCursor(
        rows[rows.length - 1],
        'after',
      );
    }

    if (
      (options.isBackward && options.hasMore) ||
      (!options.isBackward && options.hasAnchor)
    ) {
      metadata.prevCursor = options.createCursor(rows[0], 'before');
    }

    return metadata;
  }

  cursorPosition<Keys extends Record<string, unknown>>(options: {
    after?: string;
    before?: string;
    filterHash: string;
  }): CursorPagePosition<Keys> | null {
    const token = options.after ?? options.before;

    if (!token) {
      return null;
    }

    const claims = this.decodeCursorToken<Keys>(token, options.filterHash);

    return {
      keys: claims.keys,
      isBackward: Boolean(options.before),
    };
  }

  cursorMetadataFromRows<Row, Keys extends Record<string, unknown>>(
    rows: Row[],
    options: {
      isBackward: boolean;
      hasAnchor: boolean;
      hasMore: boolean;
      filterHash: string;
      getKeys: (row: Row) => Keys;
    },
  ): CursorPaginationMetadata {
    return this.cursorMetadata(rows, {
      isBackward: options.isBackward,
      hasAnchor: options.hasAnchor,
      hasMore: options.hasMore,
      createCursor: (row, direction) =>
        this.encodeCursorToken({
          direction,
          keys: options.getKeys(row),
          filterHash: options.filterHash,
        }),
    });
  }

  fingerprint(value: unknown): string {
    return createHash('sha256').update(JSON.stringify(value)).digest('hex');
  }

  encodeCursorToken<Keys extends Record<string, unknown>>(options: {
    direction: CursorDirection;
    keys: Keys;
    filterHash: string;
    ttlMs?: number;
    nowMs?: number;
  }): string {
    const nowMs = options.nowMs ?? Date.now();
    const ttlMs = options.ttlMs ?? DEFAULT_CURSOR_TTL_MS;
    const payload = Buffer.from(
      JSON.stringify({
        v: 'v1',
        dir: options.direction,
        keys: options.keys,
        fh: options.filterHash,
        iat: Math.floor(nowMs / 1000),
        exp: Math.floor((nowMs + ttlMs) / 1000),
      }),
    );
    const signature = this.sign(payload);
    return `${this.base64url(payload)}.${this.base64url(signature)}`;
  }

  decodeCursorToken<Keys extends Record<string, unknown>>(
    token: string,
    filterHash: string,
  ): CursorTokenClaims<Keys> {
    const parts = token.split('.');
    if (parts.length !== 2) {
      throw new BadRequestException('invalid cursor token');
    }

    let payload: Buffer;
    let signature: Buffer;
    try {
      payload = Buffer.from(parts[0], 'base64url');
      signature = Buffer.from(parts[1], 'base64url');
    } catch {
      throw new BadRequestException('invalid cursor token');
    }

    const expected = this.sign(payload);
    if (
      signature.length !== expected.length ||
      !timingSafeEqual(signature, expected)
    ) {
      throw new BadRequestException('invalid cursor token');
    }

    let claims: CursorTokenClaims<Keys>;
    try {
      claims = JSON.parse(payload.toString('utf8')) as CursorTokenClaims<Keys>;
    } catch {
      throw new BadRequestException('invalid cursor token');
    }

    if (claims.v !== 'v1' || claims.fh !== filterHash) {
      throw new BadRequestException('invalid cursor token');
    }
    if (claims.exp <= Math.floor(Date.now() / 1000)) {
      throw new BadRequestException('expired cursor token');
    }

    return claims;
  }

  private sign(payload: Buffer): Buffer {
    return createHmac('sha256', this.getCursorSecret())
      .update(payload)
      .digest();
  }

  private base64url(value: Buffer): string {
    return value.toString('base64url');
  }

  private getCursorSecret(): string {
    return (
      process.env.JWT_SECRET ??
      process.env.JWT_SECRET_KEY ??
      'development-secret'
    );
  }
}
