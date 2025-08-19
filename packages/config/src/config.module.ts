import { existsSync, readFileSync } from 'node:fs';
import * as path from 'node:path';
import { ConfigModule as NestConfigModule, registerAs } from '@nestjs/config';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import yaml from 'yaml';
/**
 * @param service namespace of the service
 * @param klass Constructor of the class to be validated
 * @param configFile name of the config file. If not provided, it will use the service name.
 * @returns
 */
export function ConfigModule<T extends object>(service: string, klass: ClassConstructor<T>, configFile?: string) {
	configFile = configFile ?? service;
	return NestConfigModule.forFeature(
		registerAs(service, () => {
			const configPath = path.resolve(__dirname, `../../../configs/${configFile}.yaml`);

			const fileExists = existsSync(configPath);
			const yamlConfig = fileExists ? yaml.parse(readFileSync(configPath, 'utf8')) : {};
			const instance = plainToInstance(klass, yamlConfig) ?? {};
			const errors = validateSync(instance);
			if (errors.length > 0) {
				throw new Error(`Config validation error of ${klass.name}: ${JSON.stringify(errors, null, 2)}`);
			}
			return instance;
		}),
	);
}
