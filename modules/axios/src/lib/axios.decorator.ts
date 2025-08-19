export const AxiosRetry = (retry = 3, delay = 0, error?: (e: Error) => void | Promise<void>): MethodDecorator => {
	return (_target: object, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: unknown[]) {
			let callCount = 0;
			while (callCount < retry) {
				try {
					return await originalMethod.apply(this, args);
				} catch (e: unknown) {
					callCount++;

					if (callCount >= retry) {
						if (error) return error(e as Error);
						throw e;
					}
					if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
				}
			}
		};

		return descriptor;
	};
};
