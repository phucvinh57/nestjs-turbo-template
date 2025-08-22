import { ApiString } from '@sample/common';

export class SampleDataDto {
	@ApiString()
	id: string;

	@ApiString({ nullable: true })
	name: string | null;
}
