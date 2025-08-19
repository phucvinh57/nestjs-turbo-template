import { ApiProperty } from '@nestjs/swagger';
import { SIZE } from '../common.constant';
import { ApiEnum, ApiNumber, ApiObject, ApiString } from './app.pipe';
import type { AppMeta } from './app.type';

export class ApiMeta implements AppMeta {
	@ApiProperty({ example: 10 })
	page: number;

	@ApiProperty({ example: true })
	isFirst: boolean;

	@ApiProperty({ example: false })
	isLast: boolean;

	@ApiProperty({ example: 10 })
	size: number;

	@ApiProperty({ example: 2 })
	next: number | null;

	@ApiProperty({ example: null, nullable: true })
	prev: number | null;

	@ApiProperty({ example: 100 })
	total: number;

	@ApiProperty({ example: 100, nullable: true, required: false })
	count?: number;
}

export class BaseUploadRequestDto {
	/**
	 * To increase request size, inherit this class, use `declare` to override `requestSize`
	 */
	@ApiNumber({
		description: 'Max file size',
		default: SIZE.MB * 10,
		maximum: SIZE.MB * 100,
		required: false,
	})
	requestSize: number = SIZE.MB * 10;

	@ApiString()
	filename: string;

	@ApiString({
		required: false,
		description: 'MIME type of the file. If not provided, it will be inferred from the filename extension',
	})
	contentType?: string;

	@ApiEnum(['private', 'public'])
	type: 'private' | 'public';
}

class UploadFormField {
	@ApiString()
	'X-Amz-Credential': string;

	@ApiString()
	'X-Amz-Algorithm': string;

	@ApiString()
	'X-Amz-Signature': string;

	@ApiString()
	'X-Amz-Date': string;

	@ApiString()
	Policy: string;

	@ApiString()
	key: string;
}

export class BasedUploadDto {
	@ApiString({ format: 'uri' })
	cdn: string;

	@ApiString({ format: 'uri' })
	url: string;

	@ApiString()
	objectKey: string;

	@ApiObject(UploadFormField, {
		required: false,
		additionalProperties: { type: 'string' },
	})
	fields?: Record<string, string>;
}
