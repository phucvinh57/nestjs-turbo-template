import { Env } from './common.interface';

export const uploadConfig = () => ({
	attachFieldsToBody: true,
	limits: {
		fieldNameSize: 100, // Max field name size in bytes
		fieldSize: 100, // Max field value size in bytes
		fields: 10, // Max number of non-file fields
		fileSize: 2 * 1024 * 1024 * 1024, // 2GB
		files: 10, // Max number of file fields
		headerPairs: 2000, // Max number of header key=>value pairs
		parts: 1000, // For multipart forms, the max number of parts (fields + files)
	},
});

export const helmetConfig = () => ({
	contentSecurityPolicy:
		process.env.NODE_ENV === Env.PRODUCTION
			? {
					directives: {
						defaultSrc: [`'self'`, 'unpkg.com'],
						styleSrc: [`'self'`, `'unsafe-inline'`, 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'unpkg.com'],
						fontSrc: [`'self'`, 'fonts.gstatic.com', 'data:'],
						imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
						scriptSrc: [`'self'`, `https: 'unsafe-inline'`, 'cdn.jsdelivr.net', `'unsafe-eval'`],
					},
				}
			: false,
});
