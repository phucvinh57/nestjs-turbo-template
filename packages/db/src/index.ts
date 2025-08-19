import { PrismaClient } from '@prisma/fmv-client';
import { pagination } from 'prisma-extension-pagination';

export { PrismaClientExtends } from '@prisma/client/extension';
export * from '@prisma/fmv-client';
export {
	Decimal,
	PrismaClientKnownRequestError,
	PrismaClientUnknownRequestError,
} from '@prisma/fmv-client/runtime/library';

export const PrismaFMV = 'PrismaFMV';

function createPaginateClient() {
	return new PrismaClient().$extends(pagination());
}

export type TemporalClose = {
	from: Date;
	to: Date;
};

export type PaginatedPrismaClient = ReturnType<typeof createPaginateClient>;
