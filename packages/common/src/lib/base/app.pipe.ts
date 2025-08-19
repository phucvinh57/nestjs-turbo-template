import { applyDecorators, Type as TypeClass } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsBoolean,
	IsDate,
	IsDefined,
	IsEnum,
	IsEthereumAddress,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsNumberOptions,
	IsNumberString,
	IsOptional,
	IsString,
	IsUrl,
	Max,
	MaxLength,
	Min,
	MinLength,
	ValidateNested,
	ValidationOptions,
} from 'class-validator';

type ApiOptions = ApiPropertyOptions;

const ApiArrayData = (options: ApiOptions): ValidationOptions | undefined => (options.isArray ? { each: true } : undefined);
const ApiDecorator = (type: NonNullable<ApiOptions['type']>, validators: PropertyDecorator[], options: ApiOptions = { required: true }) => {
	// biome-ignore lint/suspicious/noExplicitAny: <ignore>
	const decorators: PropertyDecorator[] = [ApiProperty({ ...options, type: type as any }), ...validators];

	options.required // VALIDATION
		? decorators.push(IsDefined(), IsNotEmpty())
		: decorators.push(IsOptional());

	if (options.isArray) {
		if (options.minItems) decorators.push(ArrayMinSize(options.minItems));
		if (options.maxItems) decorators.push(ArrayMaxSize(options.maxItems));
	}
	return applyDecorators(...decorators) as PropertyDecorator;
};

export const ApiAddress = (options: ApiOptions = { required: true }) => {
	options.required = options.required !== false;

	const validators: PropertyDecorator[] = [
		IsEthereumAddress(ApiArrayData(options)),
		Transform(({ value }) => (Array.isArray(value) ? value.map((v) => v.toLowerCase()) : value?.toLowerCase())),
	];
	return ApiDecorator('string', validators, options);
};

export const ApiString = (options: ApiOptions = { required: true }) => {
	options.required = options.required !== false;
	const arrOpts = ApiArrayData(options);

	const validators: PropertyDecorator[] = [
		options.format === 'url' ? IsUrl({ require_tld: false, require_host: true, require_protocol: true }, arrOpts) : IsString(arrOpts),
		...(options.maxLength ? [MaxLength(options.maxLength)] : []),
		...(options.minLength ? [MinLength(options.minLength)] : []),
	];
	return ApiDecorator('string', validators, options);
};

export const ApiStringNumber = (options: ApiOptions = { required: true }) => {
	options.required = options.required !== false;

	const validators: PropertyDecorator[] = [
		IsNumberString({}, ApiArrayData(options)),
		...(options.maxLength ? [MaxLength(options.maxLength)] : []),
		...(options.minLength ? [MinLength(options.minLength)] : []),
	];
	return ApiDecorator('string', validators, options);
};

export const ApiDate = (options: ApiOptions = { required: true }) => {
	options.required = options.required !== false;

	const validators: PropertyDecorator[] = [
		IsDate(ApiArrayData(options)),
		Transform(({ value }) => (Array.isArray(value) ? value.map((v) => new Date(v)) : value && new Date(value))),
	];
	options.format = 'date-time';
	return ApiDecorator('string', validators, options);
};

export const ApiEnum = <T extends object>(enumData: T, options: ApiOptions = { required: true }) => {
	options.enum = enumData;
	options.required = options.required !== false;

	const validators: PropertyDecorator[] = [IsEnum(enumData, ApiArrayData(options))];
	return ApiDecorator('string', validators, options);
};

export const ApiObject = <T>(typeClass: TypeClass<T>, options: ApiOptions = { required: true }) => {
	options.required = options.required !== false;

	const validators: PropertyDecorator[] = [ValidateNested(ApiArrayData(options)), Type(() => typeClass)];
	return ApiDecorator(typeClass, validators, options);
};

//TODO: REVIEW AGAIN TO KNOW WHY WE NEED USING THIS
const parseNumber = (value: unknown) => {
	const num = Number(value);
	return Number.isNaN(num) ? value : num;
};
export const ApiNumber = (options: ApiOptions = { required: true }, config: IsNumberOptions = { allowNaN: false }) => {
	options.required = options.required !== false;

	const validators: PropertyDecorator[] = [
		options.format === 'integer' ? IsInt(ApiArrayData(options)) : IsNumber(config, ApiArrayData(options)),
		...(options.minimum ? [Min(options.minimum)] : []),
		...(options.maximum ? [Max(options.maximum)] : []),
		Transform(({ value }) => (Array.isArray(value) ? value.map(parseNumber) : parseNumber(value))),
	];
	return ApiDecorator('number', validators, options);
};

const parseBool = (value: unknown) => {
	if (typeof value === 'boolean') return value;
	return value === 'true' || value === '1' || value === 1;
};
export const ApiBoolean = (options: ApiOptions = { required: true }) => {
	const validators: PropertyDecorator[] = [
		IsBoolean(ApiArrayData(options)),
		Transform(({ value }) => {
			return Array.isArray(value) ? value.map(parseBool) : parseBool(value);
		}),
	];
	return ApiDecorator('boolean', validators, options);
};
