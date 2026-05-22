import { GuestProxyMiddleware } from './guest-proxy.middleware';

describe('GuestProxyMiddleware', () => {
  it('should be defined', () => {
    expect(new GuestProxyMiddleware()).toBeDefined();
  });
});
