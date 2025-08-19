export const PAGINATION = {
	DEFAULT_PAGE: 1,
	DEFAULT_SIZE: 10,
	MAXIMUM_PAGE: 100,
	MAXIMUM_SIZE: 100,
};

export enum SortOrder {
	ASC = 'asc',
	DESC = 'desc',
}

export interface IPaginationParams<T, E extends string> {
	page: number;
	size: number;
	sort?: { [data in keyof E]: SortOrder | undefined };
	filter?: Partial<T>;
	search?: string;
	export?: string;
}
