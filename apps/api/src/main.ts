

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: 'http://localhost:4200',
      credentials: true,
    });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
// import { Logger } from '@nestjs/common';
// import { HttpAdapterHost, NestFactory } from '@nestjs/core';
// import { ConfigService } from '@nestjs/config';
// import {
//   ExpressAdapter,
//   NestExpressApplication,
// } from '@nestjs/platform-express';
// import helmet from 'helmet';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { apiReference } from '@scalar/nestjs-api-reference';
// import cookieParser from 'cookie-parser';
// import { AppModule } from './app/app.module';
// import { getCorsOptions } from './app/common/security/cors.config';
// import { UnhandledExceptionLoggerFilter } from './common/http/unhandled-exception-logger.filter';

// const processLogger = new Logger('Process');

// process.on('uncaughtException', (error) => {
//   processLogger.error('Uncaught exception', error.stack);
// });

// process.on('unhandledRejection', (reason) => {
//   processLogger.error(
//     'Unhandled promise rejection',
//     reason instanceof Error ? reason.stack : String(reason),
//   );
// });

// async function bootstrap() {
//   const adapter = new ExpressAdapter();

//   // accede al servidor Express subyacente antes de Nest
//   adapter.getInstance().use((req, res, next) => {
//     if (req.headers['public'] === 'guest') {
//       req.url = req.url.replace('/api/', '/api/guest/');
//     }
//     next();
//   });

//   const app = await NestFactory.create<NestExpressApplication>(
//     AppModule,
//     adapter, // pasa el adapter en lugar del server de express
//   );
//   const configService = app.get(ConfigService);
//   const httpAdapterHost = app.get(HttpAdapterHost);

//   app.setGlobalPrefix('api');
//   app.useGlobalFilters(new UnhandledExceptionLoggerFilter(httpAdapterHost));

//   // OpenAPI / Swagger Configuration
//   const config = new DocumentBuilder()
//     .setTitle('Ecommerce MA API')
//     .setDescription('Full documentation for the Ecommerce MA backend services.')
//     .setVersion('1.0')
//     .addBearerAuth()
//     .build();

//   const document = SwaggerModule.createDocument(app, config);

//   // Scalar UI Documentation
//   app.use(
//     '/docs',
//     apiReference({
//       content: document,
//     }),
//   );

//   // Security Hardening
//   app.use(helmet());

//   // Dynamic CORS
//   app.enableCors(getCorsOptions(configService));

//   // Cookie Support
//   app.use(cookieParser());

//   // Accept base64 image payloads for store settings and similar form flows.
//   app.useBodyParser('json', { limit: '8mb' });
//   app.useBodyParser('urlencoded', { limit: '8mb', extended: true });

//   const port = configService.get<number>('API_PORT') || 3002;
//   await app.listen(port);
//   Logger.log(`🚀 Application is running on: http://localhost:${port}`);
// }

// bootstrap();
