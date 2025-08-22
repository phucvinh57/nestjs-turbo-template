import { Get, UseGuards } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiHeader } from '@nestjs/swagger';
import { FmvOkResponse } from '@sample/common';
import { FmvController } from '@sample/guard';
import { ApiService } from '@/api/api.service';
import { TaskGuard } from './task.guard';

@FmvController({
	path: 'tasks',
	tag: 'Task',
	auth: false,
})
@ApiHeader({
	name: 'x-cron-secret',
	description: 'Secret key to access cron tasks',
	required: true,
})
@UseGuards(TaskGuard)
export class BookingTask extends ApiService {
	@Get('sample')
	@Cron(CronExpression.EVERY_HOUR)
	@FmvOkResponse(String)
	async sampleTask(): Promise<string> {
		const start = performance.now();
		await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a task
		const duration = performance.now() - start;
		return `Sample task completed in ${duration}ms`;
	}
}
