import { Body, ParseArrayPipe, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { BasedUploadDto, BaseUploadRequestDto, CreatedResponse } from '@packages/common';
import { AppController, JwtInfo, User } from '@packages/guard';
import { ApiRoute } from '@/api/api.service';
import { AssetService } from './asset.service';

@AppController(ApiRoute.ASSET)
export class AssetController {
	constructor(private readonly asset: AssetService) {}

	@Post()
	@ApiBody({ type: [BaseUploadRequestDto] })
	@CreatedResponse(BasedUploadDto, { isArray: true })
	async createAsset(
		@User() user: JwtInfo,
		@Body(new ParseArrayPipe({ items: BaseUploadRequestDto })) data: BaseUploadRequestDto[],
	): Promise<BasedUploadDto[]> {
		return this.asset.createSignedUploadUrls(user.sub, data);
	}
}
