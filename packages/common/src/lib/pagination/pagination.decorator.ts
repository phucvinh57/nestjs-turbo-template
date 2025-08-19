import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional, ApiPropertyOptions } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min, registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

import { SortOrder } from './pagination.constant';

export const ApiLimits = (options: ApiPropertyOptions = {}, max = 10, min = 1) => {
	return applyDecorators(
		ApiPropertyOptional({ minimum: 1, maximum: max, ...options }),
		IsOptional(),
		Type(() => Number),
		IsInt(),
		Max(max),
		Min(min),
	);
};

export const ApiLarger = <T>(property: keyof T, options?: ValidationOptions) => {
	return (obj: object, propertyName: string) => {
		registerDecorator({
			name: 'apiLarger',
			target: obj.constructor,
			options,
			propertyName,
			constraints: [property],
			validator: {
				validate(value: string | number | Date, args: ValidationArguments) {
					// biome-ignore lint/suspicious/noExplicitAny: <ignore>
					return value > (args.object as Record<string, any>)[args.constraints[0] as string];
				},

				defaultMessage(args: ValidationArguments) {
					const [constraintProperty]: (() => unknown)[] = args.constraints;
					return `${args.property} must be large than ${constraintProperty}`;
				},
			},
		});
	};
};

export const ApiSorted = <T>(property: T[], options?: ValidationOptions) => {
	return (obj: object, propertyName: string) => {
		registerDecorator({
			name: 'apiSorted',
			target: obj.constructor,
			options,
			propertyName,
			constraints: [property],
			validator: {
				validate(object: { [data in keyof T]: SortOrder }, args: ValidationArguments) {
					for (const key in object) {
						const match = args.constraints[0].some((data: string) => data === key);
						if (!match) return false;
					}
					return true;
				},

				defaultMessage(args: ValidationArguments) {
					const [constraintProperty]: (() => T)[] = args.constraints;
					return `${args.property} must be in this list enum ${constraintProperty}`;
				},
			},
		});
	};
};
