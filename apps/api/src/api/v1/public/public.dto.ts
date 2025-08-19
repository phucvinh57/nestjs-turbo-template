import { ApiNumber, ApiString } from '@fmv/common';

export class ChargerTypeDto {
	@ApiString()
	id: string;

	@ApiString()
	name: string;

	@ApiString({ format: 'url' })
	iconUrl: string;
}

export class LocationDto {
	@ApiNumber()
	id: number;

	@ApiString()
	name: string;

	@ApiString({ format: 'emoji', nullable: true, required: false })
	emoji?: string | null;
}
