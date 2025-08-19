export interface IAWSConfig {
	region: string;
	accessKeyId: string;
	secretAccessKey: string;
}

export type SqsMessageFilter = ['eq', string, number | string | boolean] | ['starts-with', string, string] | ['matches', string, string];
export interface ISqsOption {
	// If not provided, it will use config from instance provider
	queue?: string;
	/** In milliseconds */
	pollingInterval?: number;

	/** Default 10 */
	maxNumberOfMessages?: number;
	visibilityTimeout?: number;
	waitTimeSeconds?: number;
	matchingAttributes?: SqsMessageFilter[];
}
