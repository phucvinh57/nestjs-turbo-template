import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { GuardConfig } from 'lib/guard.config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GuardCookie, GuardType, type JwtInfo } from '../guard.interface';

/**
 *! Not using Redis to make a blacklist token, why -> The number of invalid tokens increases over time
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, GuardType.REFRESH_JWT) {
	constructor(config: ConfigService<{ guard: GuardConfig }, true>) {
		const refreshConfig = config.get('guard').refresh;
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req) => req.cookies[GuardCookie.REFRESH_TOKEN],
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			ignoreExpiration: false,
			secretOrKey: refreshConfig.secret,
			algorithms: [refreshConfig.algorithm],
		});
	}
	async validate(payload: JwtInfo) {
		return payload;
	}
}
