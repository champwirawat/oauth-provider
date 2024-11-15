import { registerAs } from '@nestjs/config';

const pjson = require('../../package.json');

export default registerAs('common', () => ({
  appStart: new Date(),
  name: pjson.name,
  version: pjson.version,
  environment: process.env.NODE_ENV || 'development',
  port: +process.env.PORT || 3000,
  cors: process.env.CORS === 'true',
}));
