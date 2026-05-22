import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

export const getCorsOptions = (configService: ConfigService): CorsOptions => {
  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS', '');
  const whitelist = allowedOrigins.split(',').map((origin) => origin.trim()).filter(Boolean);

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    maxAge: 86400, // 24 hours
  };
};
