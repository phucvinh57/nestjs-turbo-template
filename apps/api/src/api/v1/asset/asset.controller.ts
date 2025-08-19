import { BasedUploadDto, BaseUploadRequestDto, FmvCreatedResponse } from '@fmv/common';
import { FmvController, JwtInfo, User } from '@fmv/guard';
import { Body, ParseArrayPipe, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
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
