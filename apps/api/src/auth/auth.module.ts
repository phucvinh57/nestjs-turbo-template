import { Module } from '@nestjs/common';
import { GuardModule } from '@packages/guard';
import { AppleService } from './apple.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleService } from './google.service';

@Module({
	imports: [GuardModule],
	providers: [AppleService, GoogleService, AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
