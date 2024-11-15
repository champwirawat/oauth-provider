import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import commonConfig from './common.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        commonConfig
      ],
      isGlobal: true,
    }),
  ],
})
export class AppConfigModule {}
