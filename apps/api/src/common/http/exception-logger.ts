import { Logger } from '@nestjs/common';
import type { ArgumentsHost } from '@nestjs/common';
import type { AbstractHttpAdapter } from '@nestjs/core';

export function logUnhandledException(
  logger: Logger,
  httpAdapter: AbstractHttpAdapter,
  host: ArgumentsHost,
  exception: unknown,
) {
  const request = host.switchToHttp().getRequest();
  const method = httpAdapter.getRequestMethod(request);
  const path = httpAdapter.getRequestUrl(request);

  logger.error(
    `Unhandled exception while handling ${method} ${path}`,
    exception instanceof Error ? exception.stack : String(exception),
  );
}
