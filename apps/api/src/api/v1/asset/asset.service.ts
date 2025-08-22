import { randomUUID } from 'node:crypto';
import { basename, extname } from 'node:path';
import { Injectable } from '@nestjs/common';
import { AppException, BasedUploadDto, BaseUploadRequestDto, CONTENT_TYPE, SIZE } from '@packages/common';
import { ApiService } from '@/api/api.service';
import { APP_ERROR } from '@/app/app.exception';

@Injectable()
export class AssetService extends ApiService {
	async createSignedUploadUrls(userId: string, data: BaseUploadRequestDto[]): Promise<BasedUploadDto[]> {
		const assets = data.map((item) => {
			const extension = extname(item.filename);
			const filename = basename(item.filename);

			const mimeType = CONTENT_TYPE.IMAGE[extension] ?? item.contentType;
			if (!mimeType) throw new AppException(APP_ERROR.INVALID_CONTENT_TYPE);

			return {
				ownerId: userId,
				id: `${randomUUID()}${extension}`,
				mimeType,
				name: filename,
				extension,
				isPublic: item.type === 'public',
			};
		});

		await this.db.asset.createMany({
			data: assets,
		});

		const signedUploadRequests = await Promise.all(
			assets.map(async (asset, index) => {
				// biome-ignore lint/style/noNonNullAssertion: <ensure data[index] is defined>
				const isLargeFile = data[index]!.requestSize > SIZE.GB * 5;
				const objectKey = asset.id;
				const bucketType = asset.isPublic ? 'public' : 'private';

				const signedUploadRequest = !isLargeFile
					? await this.s3.signPutRequest({
							bucketType,
							contentType: asset.mimeType,
							originName: asset.name,
							key: objectKey,
						})
					: await this.s3.signPostRequest({
							bucketType,
							contentType: asset.mimeType,
							originName: asset.name,
							key: objectKey,
							// biome-ignore lint/style/noNonNullAssertion: <ensure data[index] is defined>
							fileSize: data[index]!.requestSize,
						});

				return {
					cdn: this.s3.getImageUrl(objectKey, true),
					objectKey,
					url: signedUploadRequest.url,
					fields: signedUploadRequest.fields,
				};
			}),
		);

		return signedUploadRequests;
	}
}
