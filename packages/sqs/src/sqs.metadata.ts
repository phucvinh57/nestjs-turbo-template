import { SetMetadata } from '@nestjs/common';

import { LFG_SQS_METADATA_KEY } from './sqs.constant';
import type { ISqsOption } from './sqs.interface';

export const ConsumeMessage = (opt: ISqsOption) => SetMetadata(LFG_SQS_METADATA_KEY, opt);
