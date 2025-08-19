export enum S3Size {
	ONE_KB = 1024,
	ONE_MB = 1024 * 1024,
	ONE_GB = 1024 * 1024 * 1024,
	ONE_TB = 1024 * 1024 * 1024 * 1024,
}

export type S3BucketType = 'private' | 'public';
export type S3BucketMime = 'font' | 'audio' | 'image' | 'video' | 'application';

export type S3SignPutOption = {
	bucketType: S3BucketType;
	contentType: string;
	originName: string;
	key: string;
	metadata?: Record<string, string>;
};

export type S3SignPostOption = S3SignPutOption & {
	// For large files, use POST method with specified file size
	fileSize: number;
};

export type S3UploadRequest = {
	objectKey: string;
	url: string;
	fields?: Record<string, string>;
};

export type S3UploadedEvent = {
	Records: [
		{
			eventVersion: string;
			eventSource: string;
			awsRegion: string;
			eventTime: string;
			eventName: string;
			userIdentity: {
				principalId: string;
			};
			requestParameters: {
				sourceIPAddress: string;
			};
			responseElements: {
				'x-amz-request-id': string;
				'x-amz-id-2': string;
			};
			s3: {
				s3SchemaVersion: string;
				configurationId: string;
				bucket: {
					name: string;
					ownerIdentity: {
						principalId: string;
					};
					arn: string;
				};
				object: {
					key: string;
					size: number;
					eTag: string;
					sequencer: string;
				};
			};
		},
	];
};
