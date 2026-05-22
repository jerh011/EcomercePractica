import { of, lastValueFrom } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { SuccessResponseInterceptor } from './success-response.interceptor';

describe('SuccessResponseInterceptor', () => {
  it('passes data through when no success message metadata is present', async () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(undefined),
    } as unknown as Reflector;
    const interceptor = new SuccessResponseInterceptor(reflector);
    const next = {
      handle: jest.fn().mockReturnValue(of({ id: '123' })),
    };

    await expect(
      lastValueFrom(
        interceptor.intercept(
          {
            getHandler: jest.fn(),
            getClass: jest.fn(),
          } as never,
          next,
        ),
      ),
    ).resolves.toEqual({ id: '123' });
  });

  it('wraps responses in the legacy success envelope when metadata exists', async () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue('Saved successfully'),
    } as unknown as Reflector;
    const interceptor = new SuccessResponseInterceptor(reflector);
    const next = {
      handle: jest.fn().mockReturnValue(of({ id: '123' })),
    };

    await expect(
      lastValueFrom(
        interceptor.intercept(
          {
            getHandler: jest.fn(),
            getClass: jest.fn(),
          } as never,
          next,
        ),
      ),
    ).resolves.toEqual({
      success: true,
      message: 'Saved successfully',
      data: { id: '123' },
    });
  });
});
