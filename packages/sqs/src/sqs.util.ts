// biome-ignore lint/suspicious/noExplicitAny: <object>
export function extract<T = unknown>(obj: any, path: string): T | undefined {
	const keys = path.split('.');
	let result = obj;
	for (const key of keys) {
		result = result[key];
		if (result === undefined) return undefined;
	}
	return result;
}
