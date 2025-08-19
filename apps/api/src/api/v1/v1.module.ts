import { Module } from '@nestjs/common';
import { AssetModule } from './asset/asset.module';
import { PublicModule } from './public/public.module';
@Module({
	imports: [PublicModule, AssetModule],
})
export class ApiV1Module {}
