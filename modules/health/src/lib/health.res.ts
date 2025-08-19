import { ApiProperty } from '@nestjs/swagger';

class HealthStatus {
	@ApiProperty({ example: 'up', enum: ['up', 'down'] })
	status: 'up' | 'down';
}

class HealthDetails {
	@ApiProperty({ type: HealthStatus })
	internet: HealthStatus;

	@ApiProperty({ type: HealthStatus })
	memory: HealthStatus;

	@ApiProperty({ type: HealthStatus })
	prisma: HealthStatus;

	@ApiProperty({ type: HealthStatus })
	subgraph: HealthStatus;
}

class HealthData {
	@ApiProperty({ example: 'ok', enum: ['ok', 'error'] })
	status: 'ok' | 'error';

	@ApiProperty({ type: HealthDetails })
	info: HealthDetails;

	@ApiProperty({ type: 'object', additionalProperties: true })
	error: Partial<HealthDetails>; // Only includes failing services

	@ApiProperty({ type: HealthDetails })
	details: HealthDetails;
}

export class HealthRes {
	@ApiProperty({ example: 1 })
	status: number;

	@ApiProperty({ type: HealthData })
	data: HealthData;
}

export class HealthcheckRes {
	@ApiProperty({ type: 'number', example: 1 })
	status: number;
	@ApiProperty({ type: 'string', example: 'ping' })
	data: string;
}
