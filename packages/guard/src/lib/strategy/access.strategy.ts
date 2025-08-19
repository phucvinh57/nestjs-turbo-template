import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GuardConfig } from '../guard.config';
import { GuardCookie, GuardType, type JwtInfo } from '../guard.interface';

/**
 *! Not using Redis to make a blacklist token, why -> The number of invalid tokens increases over time
 */
@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, GuardType.ACCESS_JWT) {
	constructor(config: ConfigService<{ guard: GuardConfig }, true>) {
		const guard = config.get<GuardConfig>('guard');
		const accessConfig = guard.access;
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies[GuardCookie.ACCESS_TOKEN], ExtractJwt.fromAuthHeaderAsBearerToken()]),
			ignoreExpiration: false,
			secretOrKey: accessConfig.public,
			algorithms: [accessConfig.algorithm],
		});
	}
	async validate(payload: JwtInfo) {
		return payload;
	}
}
