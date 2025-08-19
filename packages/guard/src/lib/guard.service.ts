import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GuardConfig, JwtConfig } from './guard.config';
import { JwtInfo } from './guard.interface';

@Injectable()
export class GuardService {
	private readonly JWT_ACCESS: JwtConfig;
	private readonly JWT_REFRESH: JwtConfig;
	constructor(
		private readonly jwt: JwtService,
		private readonly config: ConfigService<{ guard: GuardConfig }, true>,
	) {
		const guardConfig = this.config.get<GuardConfig>('guard');
		this.JWT_ACCESS = guardConfig.access;
		this.JWT_REFRESH = guardConfig.refresh;
	}
	get maxAgeAccess(): number {
		return this.JWT_ACCESS.maxAge;
	}
	get maxAgeRefresh(): number {
		return this.JWT_REFRESH.maxAge;
	}

	async verifyAccess(token: string): Promise<JwtInfo> {
		return this.jwt.verifyAsync(token, {
			algorithms: [this.JWT_ACCESS.algorithm],
			secret: this.JWT_ACCESS.public,
			ignoreExpiration: false,
			ignoreNotBefore: false,
		});
	}

	async verifyRefresh(token: string): Promise<JwtInfo> {
		return this.jwt.verifyAsync(token, {
			algorithms: [this.JWT_REFRESH.algorithm],
			secret: this.JWT_REFRESH.public,
			ignoreExpiration: false,
			ignoreNotBefore: false,
		});
	}

	async signedAccess(info: JwtInfo, maxAge?: number): Promise<string> {
		return this.jwt.signAsync(info, {
			expiresIn: maxAge ?? this.JWT_ACCESS.maxAge,
			algorithm: this.JWT_ACCESS.algorithm,
			secret: this.JWT_ACCESS.secret,
		});
	}

	async signedRefresh(info: JwtInfo, maxAge?: number): Promise<string> {
		return this.jwt.signAsync(info, {
			expiresIn: maxAge ?? this.JWT_REFRESH.maxAge,
			algorithm: this.JWT_REFRESH.algorithm,
			secret: this.JWT_REFRESH.secret,
		});
	}
}
