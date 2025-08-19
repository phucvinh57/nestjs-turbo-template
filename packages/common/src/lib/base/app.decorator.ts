import {
	ArgumentMetadata,
	applyDecorators,
	BadRequestException,
	createParamDecorator,
	ExecutionContext,
	PipeTransform,
	Type,
} from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiResponse, ApiResponseMetadata, getSchemaPath } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import type { ReferenceObject, SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { unflatten } from 'flat';
import { ApiMeta } from './app.dto';

const queryDecorator = ((target: Record<string, object>, key: string, index: number) => {
	const queryParamsType = Reflect.getMetadata('design:paramtypes', target, key);
	Reflect.defineMetadata(
		DECORATORS.API_PARAMETERS,
		[
			{
				in: 'query',
				type: queryParamsType[index],
				style: 'deepObject',
				required: false,
			},
		],
		// biome-ignore lint/style/noNonNullAssertion: <ignore>
		target[key]!,
	);
	return target[key];
}) as ParameterDecorator;

class QueryValidationPipe implements PipeTransform {
	async transform(value: object, { metatype }: ArgumentMetadata) {
		if (!metatype || !this.toValidate(metatype)) return value;
		value = plainToInstance(metatype, value);

		const errors = await validate(value, {
			forbidNonWhitelisted: true,
			whitelist: true,
		});
		if (errors.length > 0) {
			throw new BadRequestException(errors[0]?.constraints);
		}
		return value;
	}

	private toValidate(metadata: Type): boolean {
		const types: Type[] = [String, Boolean, Number, Array, Object];
		return !types.includes(metadata);
	}
}
const CustomQuery = createParamDecorator(
	(data: string | undefined, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		const q = data ? request.query[data] : request.query;
		const result = unflatten(q, { delimiter: '.' });
		return result;
	},
	[queryDecorator],
);

export const FlatQuery = () => CustomQuery(QueryValidationPipe);

type FmvResponseMetadata = ApiResponseMetadata & { status?: number };

export const FmvResponse = <ResDTO extends Type<unknown>>(resDTO: ResDTO, params?: FmvResponseMetadata) => {
	let items: SchemaObject | ReferenceObject;
	if (resDTO.name === 'String' || resDTO.name === 'Number' || resDTO.name === 'Boolean') {
		items = { type: resDTO.name.toLowerCase() };
	} else {
		items = { $ref: getSchemaPath(resDTO) };
	}
	const properties: Record<string, SchemaObject | ReferenceObject> = {
		message: { type: 'string', example: 'Success' },
		data: params?.isArray ? { type: 'array', items } : items,
	};
	return applyDecorators(
		ApiExtraModels(resDTO),
		ApiResponse({
			status: params?.status ?? 200,
			schema: {
				type: 'object',
				properties,
				required: ['status', 'data'],
			},
		}),
	);
};

export const FmvOkResponse = <ResDTO extends Type<unknown>>(resDTO: ResDTO, params?: FmvResponseMetadata) => {
	return FmvResponse(resDTO, { ...params, status: 200 });
};

export const FmvCreatedResponse = <ResDTO extends Type<unknown>>(resDTO: ResDTO, params?: FmvResponseMetadata) => {
	return FmvResponse(resDTO, { ...params, status: 201 });
};

export const FmvPaginateResponse = <ResDTO extends Type<unknown>>(resDTO: ResDTO) => {
	let items: SchemaObject | ReferenceObject;
	if (resDTO.name === 'String' || resDTO.name === 'Number' || resDTO.name === 'Boolean') {
		items = { type: resDTO.name.toLowerCase() };
	} else {
		items = { $ref: getSchemaPath(resDTO) };
	}
	const properties: SchemaObject = {
		type: 'object',
		properties: {
			status: { type: 'number', example: 1 },
			data: { type: 'array', items },
			meta: { $ref: getSchemaPath(ApiMeta) },
		},
		required: ['status', 'data', 'meta'],
	};
	return applyDecorators(ApiExtraModels(resDTO, ApiMeta), ApiOkResponse({ schema: properties }));
};
