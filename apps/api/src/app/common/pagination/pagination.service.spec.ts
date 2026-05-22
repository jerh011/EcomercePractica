import { BadRequestException } from '@nestjs/common';
import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  let service: PaginationService;

  beforeEach(() => {
    service = new PaginationService();
  });

  it('calculates offset pagination windows and metadata', () => {
    expect(service.offsetWindow(undefined, 25)).toEqual({
      page: 1,
      pageSize: 25,
      offset: 0,
    });
    expect(service.offsetWindow(3, 10)).toEqual({
      page: 3,
      pageSize: 10,
      offset: 20,
    });
    expect(service.offsetMetadata(51, 25)).toEqual({
      totalCount: 51,
      totalPages: 3,
    });
  });

  it('slices cursor rows to the requested page size', () => {
    const rows = ['a', 'b', 'c'];

    expect(service.cursorWindow(rows, 2, false)).toEqual({
      rows: ['a', 'b'],
      hasMore: true,
    });
    expect(rows).toEqual(['a', 'b', 'c']);
  });

  it('reverses backward cursor windows after trimming the lookahead row', () => {
    expect(service.cursorWindow(['c', 'b', 'a'], 2, true)).toEqual({
      rows: ['b', 'c'],
      hasMore: true,
    });
  });

  it('builds cursor metadata for first, anchored, and backward pages', () => {
    const createCursor = (row: string, direction: 'after' | 'before') =>
      `${direction}:${row}`;

    expect(
      service.cursorMetadata(['a', 'b'], {
        isBackward: false,
        hasAnchor: false,
        hasMore: true,
        createCursor,
      }),
    ).toEqual({ nextCursor: 'after:b' });

    expect(
      service.cursorMetadata(['c', 'd'], {
        isBackward: false,
        hasAnchor: true,
        hasMore: false,
        createCursor,
      }),
    ).toEqual({ prevCursor: 'before:c' });

    expect(
      service.cursorMetadata(['b', 'c'], {
        isBackward: true,
        hasAnchor: true,
        hasMore: true,
        createCursor,
      }),
    ).toEqual({ nextCursor: 'after:c', prevCursor: 'before:b' });
  });

  it('does not build cursor metadata for empty pages', () => {
    expect(
      service.cursorMetadata([], {
        isBackward: false,
        hasAnchor: false,
        hasMore: false,
        createCursor: (row) => String(row),
      }),
    ).toEqual({});
  });

  it('fingerprints stable filter payloads', () => {
    expect(service.fingerprint({ name: 'Brand', page: 1 })).toBe(
      service.fingerprint({ name: 'Brand', page: 1 }),
    );
    expect(service.fingerprint({ name: 'Brand', page: 1 })).not.toBe(
      service.fingerprint({ name: 'Other', page: 1 }),
    );
  });

  it('encodes and decodes signed cursor tokens', () => {
    const filterHash = service.fingerprint({ name: 'Brand' });
    const token = service.encodeCursorToken({
      direction: 'after',
      keys: { name: 'Brand', id: 'brand-id' },
      filterHash,
      nowMs: Date.now(),
    });

    expect(
      service.decodeCursorToken<{ name: string; id: string }>(
        token,
        filterHash,
      ),
    ).toMatchObject({
      v: 'v1',
      dir: 'after',
      keys: { name: 'Brand', id: 'brand-id' },
      fh: filterHash,
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });

  it('resolves cursor positions from after and before tokens', () => {
    const filterHash = service.fingerprint({ name: 'Brand' });
    const after = service.encodeCursorToken({
      direction: 'after',
      keys: { name: 'Brand', id: 'after-id' },
      filterHash,
    });
    const before = service.encodeCursorToken({
      direction: 'before',
      keys: { name: 'Brand', id: 'before-id' },
      filterHash,
    });

    expect(
      service.cursorPosition<{ name: string; id: string }>({
        after,
        filterHash,
      }),
    ).toEqual({
      keys: { name: 'Brand', id: 'after-id' },
      isBackward: false,
    });
    expect(
      service.cursorPosition<{ name: string; id: string }>({
        before,
        filterHash,
      }),
    ).toEqual({
      keys: { name: 'Brand', id: 'before-id' },
      isBackward: true,
    });
  });

  it('builds signed cursor metadata directly from rows and cursor keys', () => {
    const filterHash = service.fingerprint({ name: 'Brand' });
    const metadata = service.cursorMetadataFromRows(
      [
        { name: 'A', id: 'a' },
        { name: 'B', id: 'b' },
      ],
      {
        isBackward: false,
        hasAnchor: false,
        hasMore: true,
        filterHash,
        getKeys: (row) => ({ name: row.name, id: row.id }),
      },
    );

    expect(metadata.prevCursor).toBeUndefined();
    expect(
      service.cursorPosition<{ name: string; id: string }>({
        after: metadata.nextCursor,
        filterHash,
      }),
    ).toEqual({
      keys: { name: 'B', id: 'b' },
      isBackward: false,
    });
  });

  it('rejects invalid and expired cursor tokens', () => {
    expect(() => service.decodeCursorToken('not-a-token', 'hash')).toThrow(
      new BadRequestException('invalid cursor token'),
    );

    const filterHash = service.fingerprint({ name: 'Brand' });
    const token = service.encodeCursorToken({
      direction: 'after',
      keys: { name: 'Brand', id: 'brand-id' },
      filterHash,
      ttlMs: 1,
      nowMs: Date.now() - 10_000,
    });

    expect(() => service.decodeCursorToken(token, filterHash)).toThrow(
      new BadRequestException('expired cursor token'),
    );
  });
});
