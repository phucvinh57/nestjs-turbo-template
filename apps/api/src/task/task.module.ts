import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BookingTask } from './booking.task';

@Module({
	controllers: [BookingTask],
	imports: [ScheduleModule.forRoot()],
})
export class TaskModule {}
