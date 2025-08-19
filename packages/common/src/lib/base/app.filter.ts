import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import type { AppErr, AppError } from './app.type';

export class AppException extends HttpException {
	constructor(private readonly error: AppError) {
		super(error, error.status);
	}
	get code(): string {
		return this.error.code;
	}
}

export const AppCatch = (error?: AppError) => {
	return (target: object, _propertyKey: string, propertyDescriptor: PropertyDescriptor) => {
		const originalMethod = propertyDescriptor.value;

		propertyDescriptor.value = async function (...args: unknown[]) {
			try {
				return await originalMethod.apply(this, args);
			} catch (err) {
				const logger = new Logger(target.constructor.name);
				if (err instanceof Error) logger.error(err.message, err.stack);
				else logger.error('An unknown error occurred', JSON.stringify(err));

				if (error) throw new AppException(error);
			}
		};
	};
};

@Catch(HttpException)
export class AppFilter implements ExceptionFilter {
	private readonly logger = new Logger(AppFilter.name);

	catch(exception: AppException | HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const req = ctx.getRequest();
		const res = ctx.getResponse();
		const err = this.formatError(exception);

		if (req.id || req.headers['x-request-id']) res.header('x-request-id', req.id || req.headers['x-request-id']);

		exception.getStatus() >= 500 ? this.logger.error(exception.getResponse(), exception.stack) : this.logger.warn(exception.getResponse());

		return res.status(exception.getStatus()).send(err);
	}

	private formatError(exception: AppException | HttpException): AppErr {
		const { code, message } =
			exception instanceof AppException ? { code: exception.code, message: exception.message } : this.getMsgCode(exception);

		return {
			status: 0,
			type: 'REST',
			code,
			message,
		};
	}

	private getMsgCode(exception: HttpException): { code: string; message: string } {
		// biome-ignore lint/complexity/useLiteralKeys: <to extract private property>
		const error: Error = exception['response'];

		return { code: '0000', message: Array.isArray(error.message) ? error.message[0] : error.message };
	}
}
