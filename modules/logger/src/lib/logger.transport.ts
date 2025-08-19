export const prettyTransport = {
	targets: [
		{
			target: 'pino-pretty',
			level: 'info',
			options: {
				levelFirst: true,
				singleLine: true,
				colorize: true,
				translateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
				ignore: 'pid,hostname,req.headers,req.remoteAddress,req.query,req.remotePort,res',
				errorLikeObjectKeys: ['err', 'error'],
			},
		},
	],
};
