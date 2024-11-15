import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoutesModule } from './routes/routes.module';
import { AppConfigModule } from './configs/app-config.module';
import { SessionIdMiddleware } from './helpers/middleware/session-id.middleware';
import { LogModule } from './logs/log.module';

@Module({
  imports: [AppConfigModule, LogModule, RoutesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionIdMiddleware).forRoutes('*');
  }
}
