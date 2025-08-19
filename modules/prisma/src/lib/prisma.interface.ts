export type PrismaProvider<T> = {
	provide: string | symbol;
	client: T;
};

export type PrismaQueryEvent = {
	query: string;
	params: string;
	target: string;
	duration: number;
	timestamp: Date;
};
// biome-ignore lint/suspicious/noExplicitAny: <ignore>
export type PrismaConstructor<R = any> = new (...args: any[]) => R;
