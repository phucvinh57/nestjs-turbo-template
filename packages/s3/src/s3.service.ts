// Docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-cloudfront-signer/
import { DeleteObjectsCommand, DeleteObjectsCommandOutput, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl as getCloudFrontSignedUrl } from '@aws-sdk/cloudfront-signer';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import type { Conditions } from '@aws-sdk/s3-presigned-post/dist-types/types';
import { getSignedUrl as getS3SignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppCatch, SIZE, TTL } from '@packages/common';
import { AWSConfig } from '@packages/config';
import { CloudfrontConfig, S3Config } from 's3.config';
import { S3_ERROR } from './s3.exception';
import { type S3BucketType, S3SignPostOption, S3SignPutOption, S3UploadRequest } from './s3.interface';

@Injectable()
export class S3Service {
	private readonly client: S3Client;
	private readonly bucket: Record<S3BucketType, string>;
	private readonly cdn: CloudfrontConfig;

	constructor(config: ConfigService<{ s3: S3Config; aws: AWSConfig }, true>) {
		const awsConfig = config.get<AWSConfig>('aws');
		const s3Config = config.get<S3Config>('s3');

		this.client = new S3Client({
			region: awsConfig.region,
			credentials: {
				accessKeyId: awsConfig.accessKeyId,
				secretAccessKey: awsConfig.secretAccessKey,
			},
		});
		this.bucket = {
			private: s3Config.privateBucket,
			public: s3Config.publicBucket,
		};
		this.cdn = s3Config.cloudfront;
	}

	/**
	 * @param key object key
	 * @param isPublic
	 * @param ttl expiration time in milliseconds
	 * @returns
	 */
	getImageUrl(key: string, isPublic = true, ttl = 10 * 60000): string {
		const type = isPublic ? 'public' : 'private';

		let url = `${this.cdn.url}/${type}/${key}`;
		if (isPublic) return url;

		url = getCloudFrontSignedUrl({
			dateLessThan: new Date(Date.now() + ttl).toString(),
			url,
			keyPairId: this.cdn.keyId,
			privateKey: this.cdn.privateKey,
		});
		return url;
	}

	urlToAssetKey(url: string): string {
		const path = new URL(url).pathname;
		if (path.startsWith('/private')) return path.slice(9);
		if (path.startsWith('/public')) return path.slice(8);
		return path;
	}

	@AppCatch(S3_ERROR.GET_PRESIGNED_FAILED)
	async signPutRequest(option: S3SignPutOption): Promise<S3UploadRequest> {
		const objectKey = `${option.bucketType}/${option.key}`;
		const contentDisposition = `attachment; filename="${option.originName}"`;
		const command = new PutObjectCommand({
			Bucket: this.bucket[option.bucketType],
			Key: objectKey,
			ContentType: option.contentType,
			ContentDisposition: option.bucketType === 'private' ? contentDisposition : undefined,
			Metadata: option.metadata,
		});
		const url = await getS3SignedUrl(this.client, command, { expiresIn: TTL.ONE_MINUTE * 5 });
		return {
			url,
			objectKey,
			fields: {
				'Content-Type': option.contentType,
				...(option.bucketType === 'private' ? { 'Content-Disposition': contentDisposition } : {}),
				...option.metadata,
			},
		};
	}

	@AppCatch(S3_ERROR.GET_PRESIGNED_FAILED)
	async signPostRequest(option: S3SignPostOption): Promise<S3UploadRequest> {
		const objectKey = `${option.bucketType}/${option.key}`;
		const contentDisposition = `attachment; filename="${option.originName}"`;

		const conditions: Conditions[] = [
			['content-length-range', SIZE.KB, option.fileSize],
			['eq', '$Content-Type', option.contentType],
		];
		const isPrivate = option.bucketType === 'private';
		if (isPrivate) conditions.push(['eq', '$Content-Disposition', contentDisposition]);
		const metadata: Record<string, string> = {};
		if (option.metadata) {
			for (const key of Object.keys(option.metadata)) metadata[`x-amz-meta-${key}`] = option.metadata[key] as string;
		}
		for (const key of Object.keys(metadata)) conditions.push(['eq', `$${key}`, metadata[key] as string]);

		const post = await createPresignedPost(this.client, {
			Bucket: this.bucket[option.bucketType],
			Key: objectKey,
			Expires: TTL.ONE_MINUTE * 5,
			Conditions: conditions,
		});
		const result: S3UploadRequest = {
			url: post.url,
			objectKey,
			fields: {
				...post.fields,
				'Content-Type': option.contentType,
				...metadata,
			},
		};
		// biome-ignore lint/style/noNonNullAssertion: <Fields is always defined>
		if (isPrivate) result.fields!['Content-Disposition'] = contentDisposition;
		return result;
	}

	async signDeleteRequest(bucket: string, key: string): Promise<string> {
		const request = new DeleteObjectsCommand({
			Bucket: bucket,
			Delete: {
				Objects: [{ Key: key }],
				Quiet: false,
			},
		});
		const url = await getS3SignedUrl(this.client, request, { expiresIn: TTL.ONE_MINUTE * 5 });
		return url;
	}

	@AppCatch(S3_ERROR.REMOVE_FAILED)
	delete(Bucket: string, Key: string[]): Promise<DeleteObjectsCommandOutput> {
		const request = new DeleteObjectsCommand({
			Bucket,
			Delete: {
				Objects: Key.map((key) => ({ Key: key })),
				Quiet: false,
			},
		});
		return this.client.send(request);
	}
}
