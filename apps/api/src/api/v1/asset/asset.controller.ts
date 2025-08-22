import { Body, ParseArrayPipe, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { BasedUploadDto, BaseUploadRequestDto, FmvCreatedResponse } from '@sample/common';
import { FmvController, JwtInfo, User } from '@sample/guard';
import { ApiRoute } from '@/api/api.service';
import { AssetService } from './asset.service';

@FmvController(ApiRoute.ASSET)
export class AssetController {
	constructor(private readonly asset: AssetService) {}

	@Post()
	@ApiBody({ type: [BaseUploadRequestDto] })
	@FmvCreatedResponse(BasedUploadDto, { isArray: true })
	async createAsset(
		@User() user: JwtInfo,
		@Body(new ParseArrayPipe({ items: BaseUploadRequestDto })) data: BaseUploadRequestDto[],
	): Promise<BasedUploadDto[]> {
		return this.asset.createSignedUploadUrls(user.sub, data);
	}
}
