import { type ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppException } from '@sample/common';
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import type { Observable } from 'rxjs';
import { GUARD_ERROR } from '../guard.exception';
import { GuardType, JwtInfo } from '../guard.interface';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(GuardType.REFRESH_JWT) {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		return super.canActivate(context);
	}
	// !Warning NotBeforeError alway highest priority
	handleRequest<TUser = JwtInfo>(err: Error, user: JwtInfo, info: NotBeforeError | TokenExpiredError | JsonWebTokenError): TUser {
		if (info instanceof NotBeforeError) throw new AppException(GUARD_ERROR.REFRESH_TOKEN_CLAIMS_BEFORE);
		if (info instanceof TokenExpiredError) throw new AppException(GUARD_ERROR.REFRESH_TOKEN_EXPIRED);
		if (info instanceof JsonWebTokenError) throw new AppException(GUARD_ERROR.REFRESH_TOKEN_INVALID);
		if (err || !user || !user.sub) throw new AppException(GUARD_ERROR.REFRESH_TOKEN_REQUIRE);

		return user as TUser;
	}
}
