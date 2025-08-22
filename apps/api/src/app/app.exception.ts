import { HttpStatus } from '@nestjs/common';
import type { AppError } from '@packages/common';

export type GeneralCode = 'INVALID_CONTENT_TYPE';

export type AuthCode =
	| 'AUTH_TOKEN_EXPIRED'
	| 'AUTH_TOKEN_REVOKED'
	| 'AUTH_NEED_AT_LEAST_ONE_AUTH_METHOD'
	| 'AUTH_OAUTH2_PROVIDER_UNSUPPORTED'
	| 'AUTH_OAUTH2_INVALID_STATE'
	| 'AUTH_PASSWORD_INCORRECT'
	| 'AUTH_EMAIL_EXIST'
	| 'AUTH_ACCOUNT_DEACTIVATE';

export type UserCode =
	| 'USER_NOT_FOUND'
	| 'USER_PERMISSION_DENIED'
	| 'USER_HAS_BEEN_DEACTIVATED'
	| 'FRIEND_NOT_FOUND'
	| 'CANNOT_ADD_YOURSELF_AS_FRIEND'
	| 'USER_EXISTED'
	| 'USER_NAME_EXISTED'
	| 'USER_ITEM_NOT_FOUND'
	| 'USER_ITEM_AVAILABLE_NOT_ENOUGH';

export type GameCode =
	| 'GAME_NOT_FOUND'
	| 'GAME_FILE_UPLOAD_INVALID'
	| 'GAME_IMAGE_UPLOAD_INVALID'
	| 'GAME_VIDEO_UPLOAD_INVALID'
	| 'GAME_CATEGORY_DUPLICATED'
	| 'GAME_VERSION_NOT_FOUND'
	| 'GAME_RELEASE_NOT_READY'
	| 'GAME_RELEASE_NOTHING_TO_UPDATE'
	| 'GAME_IS_PLAYING'
	| 'GAME_ITEM_NOT_FOUND';

export type ListingCode =
	| 'LISTING_NOT_FOUND'
	| 'LISTING_QUANTITY_NOT_ENOUGH'
	| 'LISTING_ORDER_PRICE_FAILED'
	| 'LISTING_REQUIRE_WALLET_ADDR';

export type FeeCode = 'FEE_LISTING_NOT_FOUND';

export type AppCode = GeneralCode | UserCode | GameCode | AuthCode | ListingCode | FeeCode;

export const APP_ERROR: Record<AppCode, AppError> = {
	// 1xxx Bad request
	INVALID_CONTENT_TYPE: {
		code: '1000',
		message: 'Invalid content type',
		status: HttpStatus.BAD_REQUEST,
	},
	AUTH_TOKEN_EXPIRED: {
		code: '1000',
		message: 'Token expired',
		status: HttpStatus.UNAUTHORIZED,
	},
	AUTH_TOKEN_REVOKED: {
		code: '1002',
		message: 'This refresh token has been revoke!',
		status: HttpStatus.UNAUTHORIZED,
	},
	AUTH_NEED_AT_LEAST_ONE_AUTH_METHOD: {
		code: '1003',
		message: 'Require at least one auth method',
		status: HttpStatus.BAD_REQUEST,
	},
	AUTH_OAUTH2_PROVIDER_UNSUPPORTED: {
		code: '1100',
		message: 'Oauth2 Provider unsupported',
		status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
	},
	AUTH_OAUTH2_INVALID_STATE: {
		code: '1101',
		message: 'Invalid OAuth state',
		status: HttpStatus.BAD_REQUEST,
	},
	AUTH_PASSWORD_INCORRECT: {
		code: '1003',
		message: 'Your password incorrect!',
		status: HttpStatus.BAD_REQUEST,
	},
	AUTH_EMAIL_EXIST: {
		code: '1004',
		message: 'This email has already been registered',
		status: HttpStatus.BAD_REQUEST,
	},
	AUTH_ACCOUNT_DEACTIVATE: {
		code: '1005',
		message: 'Your account has been deactivate from admin! Please contact to admin.',
		status: HttpStatus.FORBIDDEN,
	},

	// 20xx USER AUTH
	USER_NOT_FOUND: {
		code: '2000',
		message: 'User not found',
		status: HttpStatus.NOT_FOUND,
	},
	USER_PERMISSION_DENIED: {
		code: '2001',
		message: 'Permission denied',
		status: HttpStatus.FORBIDDEN,
	},
	USER_HAS_BEEN_DEACTIVATED: {
		code: '2002',
		message: 'Your account has been deactivate from admin! Please contact to admin.',
		status: HttpStatus.FORBIDDEN,
	},
	USER_EXISTED: {
		code: '2003',
		message: 'User has existed',
		status: HttpStatus.CONFLICT,
	},
	USER_NAME_EXISTED: {
		code: '2004',
		message: 'Username has existed',
		status: HttpStatus.CONFLICT,
	},
	// 21xx USER Friend
	FRIEND_NOT_FOUND: {
		code: '2100',
		message: 'Friend not found',
		status: HttpStatus.NOT_FOUND,
	},
	CANNOT_ADD_YOURSELF_AS_FRIEND: {
		code: '2101',
		message: 'Cannot add yourself as a friend',
		status: HttpStatus.BAD_REQUEST,
	},
	USER_ITEM_NOT_FOUND: {
		code: '2200',
		message: 'User Item Not Found',
		status: HttpStatus.NOT_FOUND,
	},
	USER_ITEM_AVAILABLE_NOT_ENOUGH: {
		code: '2201',
		message: 'Item available is not enough to publish',
		status: HttpStatus.BAD_REQUEST,
	},
	// 3xxx GAME
	GAME_NOT_FOUND: {
		code: '3000',
		message: 'Game not found',
		status: HttpStatus.NOT_FOUND,
	},
	GAME_VERSION_NOT_FOUND: {
		code: '3001',
		message: 'Game version not found',
		status: HttpStatus.BAD_REQUEST,
	},
	GAME_RELEASE_NOT_READY: {
		code: '3003',
		message: 'Game release not ready',
		status: HttpStatus.BAD_REQUEST,
	},
	GAME_RELEASE_NOTHING_TO_UPDATE: {
		code: '3004',
		message: 'Nothing to update',
		status: HttpStatus.BAD_REQUEST,
	},
	GAME_IS_PLAYING: {
		code: '3100',
		message: 'Game is playing',
		status: HttpStatus.BAD_REQUEST,
	},
	GAME_FILE_UPLOAD_INVALID: {
		code: '3500',
		message: 'Game File should be format as .zip!',
		status: HttpStatus.BAD_REQUEST,
	},
	GAME_IMAGE_UPLOAD_INVALID: {
		code: '3501',
		message: 'Game Image should be format as .jpg, .jpeg, .png, .gif, .bmp, .webp!',
		status: HttpStatus.BAD_REQUEST,
	},
	GAME_VIDEO_UPLOAD_INVALID: {
		code: '3502',
		message: 'Game Trailer should be format as .mp4, .webm, .ogg!',
		status: HttpStatus.BAD_REQUEST,
	},
	GAME_CATEGORY_DUPLICATED: {
		code: '3503',
		message: 'Game categories create has been duplicated',
		status: HttpStatus.BAD_REQUEST,
	},
	GAME_ITEM_NOT_FOUND: {
		code: '3600',
		message: 'Game item not found!',
		status: HttpStatus.NOT_FOUND,
	},
	LISTING_NOT_FOUND: {
		code: '4000',
		message: 'Listing not found',
		status: HttpStatus.BAD_REQUEST,
	},
	LISTING_QUANTITY_NOT_ENOUGH: {
		code: '4001',
		message: 'Listing Quantity not enough',
		status: HttpStatus.BAD_REQUEST,
	},
	LISTING_ORDER_PRICE_FAILED: {
		code: '4002',
		message: 'Listing Get Price Token failed',
		status: HttpStatus.BAD_REQUEST,
	},
	LISTING_REQUIRE_WALLET_ADDR: {
		code: '4003',
		message: 'Listing you must connected wallet address before',
		status: HttpStatus.BAD_REQUEST,
	},
	FEE_LISTING_NOT_FOUND: {
		code: '5000',
		message: 'Fee Listing not found',
		status: HttpStatus.NOT_FOUND,
	},
};
