import { DeleteMessageBatchCommand, DeleteMessageCommand, Message, ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { AWSConfig } from '@fmv/config';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ISqsOption } from './sqs.interface';

@Injectable()
export class SqsService {
	private readonly client: SQSClient;
	private readonly logger = new Logger(SqsService.name);

	constructor(config: ConfigService<{ aws: AWSConfig }, true>) {
		const awsConfig = config.get<AWSConfig>('aws');
		this.client = new SQSClient({
			region: awsConfig.region,
			credentials: {
				accessKeyId: awsConfig.accessKeyId,
				secretAccessKey: awsConfig.secretAccessKey,
			},
		});
	}

	async receiveMessage(url: string, opts: Omit<ISqsOption, 'pollingInterval' | 'queue'>): Promise<Message[]> {
		const command = new ReceiveMessageCommand({
			QueueUrl: url,
			MaxNumberOfMessages: opts.maxNumberOfMessages,
			VisibilityTimeout: opts.visibilityTimeout,
			WaitTimeSeconds: opts.waitTimeSeconds,
		});

		const { Messages } = await this.client.send(command);
		return Messages ?? [];
	}

	async deleteMessages(queueUrl: string, messages: Message[]) {
		if (messages.length === 0) return;

		try {
			const entries = messages.map((message) => ({
				Id: message.MessageId,
				ReceiptHandle: message.ReceiptHandle,
			}));
			if (messages.length === 1)
				await this.client.send(
					new DeleteMessageCommand({
						QueueUrl: queueUrl,
						ReceiptHandle: entries[0]?.ReceiptHandle,
					}),
				);
			else
				await this.client.send(
					new DeleteMessageBatchCommand({
						QueueUrl: queueUrl,
						Entries: entries,
					}),
				);
			this.logger.debug(entries, `Deleted ${messages.length} messages`);
		} catch (error) {
			this.logger.error(error, 'Error while deleting messages');
		}
	}
}
