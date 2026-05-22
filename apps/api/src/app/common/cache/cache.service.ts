import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { createClient, type RedisClientType } from 'redis';

interface CacheEntry {
  value: string;
  expiresAt: number;
}

interface CacheSetOptions {
  ttlSeconds?: number;
}

interface CacheIncrementOptions {
  ttlSeconds?: number;
}

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private readonly fallbackStore = new Map<string, CacheEntry>();
  private client: RedisClientType | null = null;
  private connectPromise: Promise<void> | null = null;

  async set(
    key: string,
    value: string,
    options: CacheSetOptions = {},
  ): Promise<void> {
    const ttlSeconds = Math.max(options.ttlSeconds ?? 60 * 60 * 24 * 7, 1);
    const client = await this.getClient();

    if (!client) {
      this.fallbackStore.set(key, {
        value,
        expiresAt: Date.now() + ttlSeconds * 1000,
      });
      return;
    }

    await client.set(key, value, {
      EX: ttlSeconds,
    });
  }

  async get(key: string): Promise<string | null> {
    const fallbackEntry = this.fallbackStore.get(key);

    if (fallbackEntry) {
      if (fallbackEntry.expiresAt <= Date.now()) {
        this.fallbackStore.delete(key);
      } else {
        return fallbackEntry.value;
      }
    }

    const client = await this.getClient();

    if (!client) {
      return null;
    }

    return (await client.get(key)) as string | null;
  }

  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  async delete(key: string): Promise<void> {
    this.fallbackStore.delete(key);

    const client = await this.getClient();

    if (client) {
      await client.del(key);
    }
  }

  async increment(
    key: string,
    options: CacheIncrementOptions = {},
  ): Promise<number> {
    const ttlSeconds = Math.max(options.ttlSeconds ?? 60 * 60, 1);
    const fallbackEntry = this.fallbackStore.get(key);

    if (fallbackEntry && fallbackEntry.expiresAt <= Date.now()) {
      this.fallbackStore.delete(key);
    }

    const currentFallbackValue = Number(this.fallbackStore.get(key)?.value ?? 0);

    const client = await this.getClient();

    if (!client) {
      const nextValue = currentFallbackValue + 1;
      this.fallbackStore.set(key, {
        value: String(nextValue),
        expiresAt:
          this.fallbackStore.get(key)?.expiresAt ??
          Date.now() + ttlSeconds * 1000,
      });
      return nextValue;
    }

    const nextValue = await client.incr(key);

    if (nextValue === 1) {
      await client.expire(key, ttlSeconds);
    }

    return nextValue;
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client?.isOpen) {
      await this.client.quit();
    }
  }

  private async getClient(): Promise<RedisClientType | null> {
    if (this.client?.isOpen) {
      return this.client;
    }

    if (!this.connectPromise) {
      this.connectPromise = this.connectToValkey();
    }

    await this.connectPromise;
    return this.client?.isOpen ? this.client : null;
  }

  private async connectToValkey(): Promise<void> {
    const address = process.env['REDIS_CACHE_ADDR'];

    if (!address) {
      this.logger.warn(
        'REDIS_CACHE_ADDR is not set. Using in-memory cache fallback.',
      );
      return;
    }

    try {
      this.client = createClient({
        url: address.startsWith('redis://') ? address : `redis://${address}`,
      });

      this.client.on('error', (error) => {
        this.logger.warn(`Valkey cache client error: ${error.message}`);
      });

      await this.client.connect();
    } catch (error) {
      this.logger.warn(
        'Failed to connect to Valkey. Using in-memory cache fallback.',
      );
      this.client = null;
    }
  }
}
