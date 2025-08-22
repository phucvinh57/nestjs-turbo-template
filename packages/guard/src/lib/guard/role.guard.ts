import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppException, IReq } from '@sample/common';
import type { Observable } from 'rxjs';

import { GUARD_ERROR } from '../guard.exception';
import { GuardType, JwtInfo } from '../guard.interface';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const roles = this.reflector.getAllAndOverride<string[]>(GuardType.ROLE, [context.getHandler(), context.getClass()]);
		if (!roles) return true;

		const req: IReq<JwtInfo> = context.switchToHttp().getRequest();

		if (req.user?.type && roles.includes(req.user.type)) return true;

		throw new AppException(GUARD_ERROR.FORBIDDEN_RESOURCE);
	}
}
