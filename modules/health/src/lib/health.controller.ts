import { Controller, Get, Inject, Optional, VERSION_NEUTRAL } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, HttpHealthIndicator, MemoryHealthIndicator, PrismaHealthIndicator } from '@nestjs/terminus';
import { HealthConfig } from './health.config';
import type { IHealthPrisma } from './health.interface';
import { HealthcheckRes, HealthRes } from './health.res';

@Controller({ version: VERSION_NEUTRAL })
@ApiTags('health')
export class HealthController {
	constructor(
		private readonly http: HttpHealthIndicator,
		private readonly config: ConfigService,
		private readonly memory: MemoryHealthIndicator,
		private readonly health: HealthCheckService,
		private readonly prisma: PrismaHealthIndicator,
		@Optional() @Inject('PrismaFMV') private readonly database: IHealthPrisma,
	) {}

	@Get('health')
	@ApiOperation({ summary: 'Health check with all dependencies' })
	@ApiOkResponse({ type: HealthRes })
	@HealthCheck()
	check() {
		const { contacts, memory, ping } = this.config.getOrThrow<HealthConfig>('health');

		return this.health
			.check([
				() => this.http.pingCheck('internet', ping),
				() => this.memory.checkHeap('memory', memory),
				() => this.prisma.pingCheck('prisma', this.database, { timeout: 1000 }),
				...contacts.map((c) => () => this.http.responseCheck(c.name, c.url, (r) => r.status >= 200 && r.status <= 299)),
			])
			.catch((error) => error.response);
	}

	@Get('healthcheck')
	@ApiOperation({ summary: 'Health check to know server still alive' })
	@ApiOkResponse({ type: HealthcheckRes })
	healthcheck(): string {
		return 'ping!';
	}
}
