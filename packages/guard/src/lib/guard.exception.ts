import type { AppError } from '@fmv/common';
import { HttpStatus } from '@nestjs/common';

export type GuardCode =
	| 'FORBIDDEN_RESOURCE'
	| 'ACCESS_TOKEN_REQUIRE'
	| 'ACCESS_TOKEN_EXPIRED'
	| 'ACCESS_TOKEN_INVALID'
	| 'ACCESS_TOKEN_CLAIMS_BEFORE'
	| 'REFRESH_TOKEN_REQUIRE'
	| 'REFRESH_TOKEN_EXPIRED'
	| 'REFRESH_TOKEN_INVALID'
	| 'REFRESH_TOKEN_CLAIMS_BEFORE';

export const GUARD_ERROR: Record<GuardCode, AppError> = {
	FORBIDDEN_RESOURCE: {
		code: '0100',
		message: `Your don't have enough permission to access this resource`,
		status: HttpStatus.FORBIDDEN,
	},
	ACCESS_TOKEN_REQUIRE: {
		code: '0101',
		message: 'Require access token in header',
		status: HttpStatus.UNAUTHORIZED,
	},
	ACCESS_TOKEN_EXPIRED: {
		code: '0102',
		message: 'Your access token has been expired',
		status: HttpStatus.UNAUTHORIZED,
	},
	ACCESS_TOKEN_INVALID: {
		code: '0103',
		message: 'Your access token has been invalid',
		status: HttpStatus.UNAUTHORIZED,
	},
	ACCESS_TOKEN_CLAIMS_BEFORE: {
		code: '0104',
		message: 'Your access token has been claims before create',
		status: HttpStatus.UNAUTHORIZED,
	},
	REFRESH_TOKEN_REQUIRE: {
		code: '0105',
		message: 'Require refresh token in header',
		status: HttpStatus.UNAUTHORIZED,
	},
	REFRESH_TOKEN_EXPIRED: {
		code: '0106',
		message: 'Your refresh token has been expired',
		status: HttpStatus.UNAUTHORIZED,
	},
	REFRESH_TOKEN_INVALID: {
		code: '0107',
		message: 'Your refresh token has been invalid',
		status: HttpStatus.UNAUTHORIZED,
	},
	REFRESH_TOKEN_CLAIMS_BEFORE: {
		code: '0108',
		message: 'Your Refresh token has been claims before create',
		status: HttpStatus.UNAUTHORIZED,
	},
};
