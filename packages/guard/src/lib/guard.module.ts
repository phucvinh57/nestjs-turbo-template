import { ConfigModule } from '@fmv/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GuardConfig } from './guard.config';
import { GuardService } from './guard.service';
import { JwtAccessStrategy } from './strategy/access.strategy';
import { JwtRefreshStrategy } from './strategy/refresh.strategy';

@Module({
	imports: [JwtModule.register({}), PassportModule.register({ session: false }), ConfigModule('guard', GuardConfig)],
	exports: [GuardService, JwtAccessStrategy, JwtRefreshStrategy],
	providers: [GuardService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class GuardModule {}
