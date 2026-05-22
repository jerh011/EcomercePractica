import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { logUnhandledException } from './exception-logger';

@Catch()
export class UnhandledExceptionLoggerFilter implements ExceptionFilter {
  private readonly logger = new Logger(UnhandledExceptionLoggerFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;

    if (!(exception instanceof HttpException)) {
      logUnhandledException(this.logger, httpAdapter, host, exception);
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    httpAdapter.reply(
      http.getResponse(),
      {
        success: false,
        message:
          exception instanceof HttpException
            ? this.extractMessage(exception)
            : 'Internal Server Error',
        data: null,
      },
      status,
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
