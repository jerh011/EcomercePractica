import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { SUCCESS_RESPONSE_MESSAGE } from './success-response.decorator';

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const message = this.reflector.getAllAndOverride<string>(
      SUCCESS_RESPONSE_MESSAGE,
      [context.getHandler(), context.getClass()],
    );

    if (!message) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        success: true as const,
        message,
        data,
      })),
    );
  }
}
