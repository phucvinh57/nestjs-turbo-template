import { HttpStatus } from '@nestjs/common';
import type { AppError } from '@sample/common';

export type S3Code = 'GET_PRESIGNED_FAILED' | 'REMOVE_FAILED';

export const S3_ERROR: Record<S3Code, AppError> = {
	GET_PRESIGNED_FAILED: {
		code: '0900',
		message: 'Generate presigned url has been failed',
		status: HttpStatus.FAILED_DEPENDENCY,
	},
	REMOVE_FAILED: {
		code: '0902',
		message: 'Delete file & folder in s3 has been failed',
		status: HttpStatus.FAILED_DEPENDENCY,
	},
};
