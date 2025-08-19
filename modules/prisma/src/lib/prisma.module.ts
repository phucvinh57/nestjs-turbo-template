import { DynamicModule, Global, Module } from '@nestjs/common';
import { createPaginator } from 'prisma-extension-pagination';
import type { PrismaConstructor, PrismaProvider } from './prisma.interface';
import { PrismaService } from './prisma.service';

@Global()
@Module({})
// biome-ignore lint/complexity/noStaticOnlyClass: <Allowing static method for module configuration>
export class PrismaModule {
	static forRoot<T extends PrismaConstructor>(clients: PrismaProvider<T>[]): DynamicModule {
		const providers = clients.map(({ provide, client }) => ({
			provide,
			useFactory: async () => {
				const PrismaClient = PrismaService(client);
				const paginate = createPaginator({
					pages: {
						includePageCount: true,
					},
				});
				return new PrismaClient().$extends({
					name: 'pagination',
					model: {
						$allModels: {
							paginate,
						},
					},
				});
			},
		}));
		return {
			module: PrismaModule,
			exports: providers,
			providers,
		};
	}
}
