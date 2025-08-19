/** biome-ignore-all lint/complexity/noBannedTypes: <ignore> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <ignore> */
import { Message } from '@aws-sdk/client-sqs';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { LFG_SQS_METADATA_KEY } from './sqs.constant';
import type { ISqsOption, SqsMessageFilter } from './sqs.interface';
import { SqsService } from './sqs.service';
import { extract } from './sqs.util';

@Injectable()
export class SqsRegistry implements OnModuleInit, OnModuleDestroy {
	private intervalMap: Map<string, NodeJS.Timeout> = new Map();

	private logger = new Logger(SqsRegistry.name);

	constructor(
		private readonly config: ConfigService,
		private readonly discovery: DiscoveryService,
		private readonly metadataScanner: MetadataScanner,
		private readonly reflector: Reflector,
		private readonly sqs: SqsService,
	) {}

	onModuleInit() {
		const instanceWrappers = this.discovery.getProviders();
		for (const wrapper of instanceWrappers) {
			if (!wrapper.isDependencyTreeStatic()) continue;
			const { instance } = wrapper;
			if (!instance || !Object.getPrototypeOf(instance)) continue;

			const providerMethodNames = this.metadataScanner.getAllMethodNames(Object.getPrototypeOf(instance));
			for (const methodName of providerMethodNames) this.wrapMessageHandler(instance, methodName);
		}
	}

	onModuleDestroy() {
		for (const timer of this.intervalMap.values()) {
			clearInterval(timer);
		}
	}

	private wrapMessageHandler(instance: any, key: string) {
		const methodRef = instance[key] as Function;
		const metadata = this.getMethodMetadata(methodRef);
		if (!metadata) return;

		const queue = metadata.queue ?? this.getQueueFromInstance(instance);
		if (!queue) throw new Error(`Queue is not defined for ${instance.constructor.name}`);

		const sqsUrl = `https://sqs.${this.config.getOrThrow('sqs.region')}.amazonaws.com/${queue}`;
		const pollingInterval = metadata.pollingInterval ?? 2000;

		const handlerKey = `${instance.constructor.name}.${key}`;
		const interval = this.intervalMap.get(handlerKey);
		if (interval) throw new Error(`Duplicate handler key ${handlerKey}`);

		const timer = setInterval(async () => {
			const messages = await this.sqs.receiveMessage(sqsUrl, metadata).catch((error) => {
				this.logger.error(error, `[${handlerKey}] Error while receiving messages`);
				return [];
			});

			const consumedMessages: Message[] = [];
			for (const msg of messages) {
				msg.Body = msg.Body ?? '{}';

				const msgBody = JSON.parse(msg.Body);
				if (metadata.matchingAttributes && !this.matchFilter(msgBody, metadata.matchingAttributes)) continue;

				try {
					const successConsumed = await Promise.resolve(methodRef.call(instance, msgBody));
					if (successConsumed) consumedMessages.push(msg);
				} catch (error) {
					this.logger.error(error, `[${handlerKey}] Error while processing message`);
				}
			}

			await this.sqs.deleteMessages(sqsUrl, consumedMessages);
		}, pollingInterval);

		this.intervalMap.set(handlerKey, timer);
	}

	private matchFilter(obj: any, filters: SqsMessageFilter[]) {
		for (const [op, path, comparedValue] of filters) {
			const value = extract(obj, path);
			if (value === undefined) return false;
			if (op === 'eq' && value !== comparedValue) return false;
			if (op === 'starts-with') {
				if (typeof value !== 'string' || !value.startsWith(comparedValue)) return false;
			}
			if (op === 'matches') {
				if (typeof value !== 'string' || !new RegExp(comparedValue).test(value)) return false;
			}
		}
		return true;
	}

	private getQueueFromInstance(instance: any): string | undefined {
		const getQueue = instance.getQueue as Function | undefined;
		return getQueue ? getQueue.call(instance) : instance.queue;
	}

	private getMethodMetadata(fn: Function): ISqsOption | undefined {
		if (typeof fn !== 'function') return;
		return this.reflector.get(LFG_SQS_METADATA_KEY, fn);
	}
}
