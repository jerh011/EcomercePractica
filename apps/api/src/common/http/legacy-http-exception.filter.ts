import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { logUnhandledException } from './exception-logger';

export class LegacyHttpException extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly error?: object,
  ) {
    super(message);
  }
}

@Catch()
export class LegacyHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(LegacyHttpExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;

    if (exception instanceof LegacyHttpException) {
      httpAdapter.reply(
        http.getResponse(),
        {
          success: false,
          message: exception.message,
          data: null,
          ...(exception.error ? { error: exception.error } : {}),
        },
        exception.statusCode,
      );
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      httpAdapter.reply(
        http.getResponse(),
        {
          success: false,
          message: this.extractMessage(exception),
          data: null,
        },
        status,
      );
      return;
    }

    logUnhandledException(this.logger, httpAdapter, host, exception);

    httpAdapter.reply(
      http.getResponse(),
      {
        success: false,
        message: 'Internal Server Error',
        data: null,
      },
      500,
    );
  }

  private extractMessage(exception: HttpException): string {
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      const message = (exceptionResponse as { message: string | string[] })
        .message;

      return Array.isArray(message) ? message[0] : message;
    }

    return exception.message;
  }
}
