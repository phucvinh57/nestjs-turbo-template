import { Type } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { ApiBoolean, ApiDate, ApiEnum, ApiNumber, ApiObject, ApiString } from '../base/app.pipe';
import { PAGINATION, SortOrder } from './pagination.constant';
import { ApiLarger, ApiLimits } from './pagination.decorator';

export class PaginationOptionsDto {
	@ApiLimits({ default: PAGINATION.DEFAULT_PAGE }, PAGINATION.MAXIMUM_PAGE)
	readonly page: number = PAGINATION.DEFAULT_PAGE;

	@ApiLimits({ default: PAGINATION.DEFAULT_SIZE }, PAGINATION.MAXIMUM_SIZE)
	readonly limit: number = PAGINATION.DEFAULT_SIZE;
}

export class DateComparisonDto {
	@ApiDate({ required: false })
	from?: Date;

	@ApiDate({ required: false })
	@ApiLarger<DateComparisonDto>('from')
	to?: Date;
}

export class NumberComparisonDto {
	@ApiNumber({ required: false })
	from?: number;

	@ApiLimits({ required: false })
	@ApiLarger<NumberComparisonDto>('from')
	to?: number;
}

export const SortOptionDto = <S extends string>(keys: S[]) => {
	class SortOption {}
	for (const key of keys) {
		ApiEnum(SortOrder, { required: false })(SortOption.prototype, key);
	}
	return SortOption as { new (): { [K in S]: SortOrder | undefined } };
};

export type PaginateQueryOptions<S extends string, E extends string, T = unknown> = {
	filter?: Type<T> | { type: Type<T>; required?: boolean };
	sorts?: S[];
	search?: boolean;
	exports?: E[];
};

export const PaginationQueryDto = <S extends string, E extends string, T = unknown>(opts?: PaginateQueryOptions<S, E, T>) => {
	class PaginationQuery {
		@ApiObject(PaginationOptionsDto, { required: false })
		pages: PaginationOptionsDto = new PaginationOptionsDto();
	}
	if (opts?.sorts) {
		class SortOption extends SortOptionDto(opts.sorts as string[]) {}
		Object.defineProperty(SortOption, 'name', { value: `SortOption_${opts.sorts.join('_')}` });
		ApiObject(SortOption, { required: false })(PaginationQuery.prototype, 'sort');
	}
	if (opts?.filter) {
		const FilterType = opts.filter instanceof Function ? opts.filter : opts.filter.type;
		const filterRequired = opts.filter instanceof Function ? false : (opts.filter.required ?? false);
		ApiObject(FilterType, { required: filterRequired })(PaginationQuery.prototype, 'filter');
	}
	if (opts?.search) {
		ApiString({ required: false, minLength: 1 })(PaginationQuery.prototype, 'search');
		Transform(({ value }: { value: string }) => value?.trim())(PaginationQuery.prototype, 'search');
	}
	if (opts?.exports) {
		class ExportOption {}
		for (const key of opts.exports) {
			ApiBoolean({ required: false })(ExportOption.prototype, key);
		}
		Object.defineProperty(ExportOption, 'name', { value: `ExportOption_${opts.exports.join('_')}` });
		ApiObject(ExportOption, { required: false })(PaginationQuery.prototype, 'exports');
	}

	return PaginationQuery as {
		new (): {
			sort?: InstanceType<{ new (): { [K in S]: SortOrder | undefined } }>;
			filter?: Partial<T>;
			search?: string;
			exports?: Partial<InstanceType<{ new (): { [K in E]: boolean | undefined } }>>;
		};
	} & Type<PaginationQuery>;
};
