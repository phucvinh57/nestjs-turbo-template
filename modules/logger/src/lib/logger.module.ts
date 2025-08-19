import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoModule } from 'nestjs-pino';

import { loggerConfig } from './logger.config';

@Global()
@Module({
	imports: [PinoModule.forRootAsync(loggerConfig)],
})
export class LoggerModule {}
