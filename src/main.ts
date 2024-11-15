import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpFormatInterceptor } from './helpers/interceptor/http-format.interceptor';
import { AppLogger } from './logs/app-logger';

if (process.env.NODE_ENV == 'dev') {
  const myEnv = dotenv.config({ path: `.env.example` });
  dotenvExpand.expand(myEnv);
}

async function bootstrap() {
  const logger = new Logger('NestApplication');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appLogger = app.get(AppLogger);

  const environment = configService.get('common.environment');
  const cors = configService.get('common.cors');
  const name = configService.get('common.name');
  const version = configService.get('common.version');
  const port = configService.get('common.port');

  if (cors) app.enableCors();
  app.use(helmet());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalInterceptors(new HttpFormatInterceptor(appLogger));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Swagger Document
  const config = new DocumentBuilder()
    .setTitle(name)
    .setDescription('The API description')
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port, () => {
    logger.log(`${name} - ${version}`);
    logger.log(`On '${environment}' environment`);
    logger.log(`Enable CORS ${cors}`);
    logger.log(`Started on port ${port}`);
  });
}
bootstrap();
