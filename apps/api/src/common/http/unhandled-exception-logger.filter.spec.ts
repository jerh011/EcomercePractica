import { ArgumentsHost, BadRequestException, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AuthExceptionFilter } from '../../app/auth/mappers/helper/auth-exception.filter';
import { LegacyHttpExceptionFilter } from './legacy-http-exception.filter';
import { UnhandledExceptionLoggerFilter } from './unhandled-exception-logger.filter';

describe('UnhandledExceptionLoggerFilter', () => {
  const response = {};
  const reply = jest.fn();
  const loggerError = jest.spyOn(Logger.prototype, 'error').mockImplementation();
  const httpAdapterHost = {
    httpAdapter: {
      getRequestMethod: jest.fn(() => 'GET'),
      getRequestUrl: jest.fn(() => '/api/products'),
      reply,
    },
  } as unknown as HttpAdapterHost;

  const createHost = (): ArgumentsHost =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          originalUrl: '/api/products',
          url: '/products',
        }),
        getResponse: () => response,
      }),
    }) as ArgumentsHost;

  beforeEach(() => {
    reply.mockReset();
    loggerError.mockClear();
  });

  afterAll(() => {
    loggerError.mockRestore();
  });

  it('logs unexpected exceptions and returns the generic error envelope', () => {
    const filter = new UnhandledExceptionLoggerFilter(httpAdapterHost);
    const exception = new Error('database unavailable');

    filter.catch(exception, createHost());

    expect(loggerError).toHaveBeenCalledWith(
      'Unhandled exception while handling GET /api/products',
      exception.stack,
    );
    expect(reply).toHaveBeenCalledWith(
      response,
      {
        success: false,
        message: 'Internal Server Error',
        data: null,
      },
      500,
    );
  });

  it('formats expected HTTP exceptions without logging them as unhandled', () => {
    const filter = new UnhandledExceptionLoggerFilter(httpAdapterHost);

    filter.catch(new BadRequestException('Invalid input'), createHost());

    expect(loggerError).not.toHaveBeenCalled();
    expect(reply).toHaveBeenCalledWith(
      response,
      {
        success: false,
        message: 'Invalid input',
        data: null,
      },
      400,
    );
  });

  it('logs unexpected exceptions handled by the legacy local filter', () => {
    const filter = new LegacyHttpExceptionFilter(httpAdapterHost);
    const exception = new Error('legacy controller failed');

    filter.catch(exception, createHost());

    expect(loggerError).toHaveBeenCalledWith(
      'Unhandled exception while handling GET /api/products',
      exception.stack,
    );
    expect(reply).toHaveBeenCalledWith(
      response,
      {
        success: false,
        message: 'Internal Server Error',
        data: null,
      },
      500,
    );
  });

  it('logs unexpected exceptions handled by the auth local filter', () => {
    const filter = new AuthExceptionFilter(httpAdapterHost);
    const exception = new Error('auth controller failed');

    filter.catch(exception, createHost());

    expect(loggerError).toHaveBeenCalledWith(
      'Unhandled exception while handling GET /api/products',
      exception.stack,
    );
    expect(reply).toHaveBeenCalledWith(
      response,
      {
        success: false,
        message: 'Internal Server Error',
        data: null,
      },
      500,
    );
  });
});
