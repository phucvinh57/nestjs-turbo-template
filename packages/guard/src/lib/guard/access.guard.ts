import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AppException } from '@packages/common';
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import type { Observable } from 'rxjs';
import { GUARD_ERROR } from '../guard.exception';
import { GuardType, JwtInfo } from '../guard.interface';

@Injectable()
export class JwtAccessGuard extends AuthGuard(GuardType.ACCESS_JWT) {
	constructor(private reflector: Reflector) {
		super();
	}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [context.getHandler(), context.getClass()]);
		if (isPublic) return true;

		return super.canActivate(context);
	}
	// !Warning NotBeforeError alway highest priority
	handleRequest<TUser = JwtInfo>(err: Error, user: JwtInfo, info: NotBeforeError | TokenExpiredError | JsonWebTokenError): TUser {
		if (info instanceof NotBeforeError) throw new AppException(GUARD_ERROR.ACCESS_TOKEN_CLAIMS_BEFORE);
		if (info instanceof TokenExpiredError) throw new AppException(GUARD_ERROR.ACCESS_TOKEN_EXPIRED);
		if (info instanceof JsonWebTokenError) throw new AppException(GUARD_ERROR.ACCESS_TOKEN_INVALID);
		if (err || !user || !user.sub) throw new AppException(GUARD_ERROR.ACCESS_TOKEN_REQUIRE);

		return user as TUser;
	}
}
