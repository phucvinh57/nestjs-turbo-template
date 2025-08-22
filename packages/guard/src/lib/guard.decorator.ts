import { applyDecorators, Controller, createParamDecorator, ExecutionContext, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { IReq } from '@sample/common';

import { JwtAccessGuard } from './guard/access.guard';
import { GuardType, JwtInfo } from './guard.interface';

export const Roles = (...roles: string[]) => SetMetadata(GuardType.ROLE, roles);

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export type FmvControllerOptions = {
	path: string;
	auth?: boolean;
	tag: string;
	version?: string;
};
//! The order of guard is important, which will be execute first
export const FmvController = ({ path, auth = true, tag = 'default', version }: FmvControllerOptions) => {
	const decorators = [Controller({ path, version }), ApiTags(tag)];
	if (auth) {
		decorators.push(UseGuards(JwtAccessGuard), ApiBearerAuth(), ApiCookieAuth());
	}
	return applyDecorators(...decorators);
};

export const User = createParamDecorator((_: unknown, ctx: ExecutionContext): JwtInfo => {
	const request = ctx.switchToHttp().getRequest<IReq<JwtInfo>>();
	return request.user;
});
