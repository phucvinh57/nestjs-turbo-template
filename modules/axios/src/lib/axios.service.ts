import { HttpModuleOptions, HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class AxiosService {
	private readonly CONTENT_TYPE = 'application/json';
	private readonly ENCODING_ZIP = 'gzip';
	private readonly MAX_TIME_OUT = 30_000;
	constructor(private readonly service: HttpService) {}

	private get headers() {
		return {
			'Content-Type': this.CONTENT_TYPE,
			'Content-Encoding': this.ENCODING_ZIP,
		};
	}

	async get<T>(url: string, config: HttpModuleOptions = {}): Promise<T> {
		const result = this.service
			.get(url, { timeout: this.MAX_TIME_OUT, headers: this.headers, ...config })
			.pipe(map((response) => response.data));

		return firstValueFrom(result);
	}

	async post<T, E = object>(url: string, data: E, config: HttpModuleOptions = {}): Promise<T> {
		const result = this.service
			.post(url, data, { timeout: this.MAX_TIME_OUT, headers: this.headers, ...config })
			.pipe(map((response) => response.data));

		return firstValueFrom(result);
	}

	async put<T, E = object>(url: string, data: E, config: HttpModuleOptions = {}): Promise<T> {
		const result = this.service
			.put(url, data, { timeout: this.MAX_TIME_OUT, headers: this.headers, ...config })
			.pipe(map((response) => response.data));

		return firstValueFrom(result);
	}

	async patch<T, E = object>(url: string, data: E, config: HttpModuleOptions = {}): Promise<T> {
		const result = this.service
			.patch(url, data, { timeout: this.MAX_TIME_OUT, headers: this.headers, ...config })
			.pipe(map((response) => response.data));

		return firstValueFrom(result);
	}

	async delete<T>(url: string, config: HttpModuleOptions = {}): Promise<T> {
		const result = this.service
			.delete(url, { timeout: this.MAX_TIME_OUT, headers: this.headers, ...config })
			.pipe(map((response) => response.data));

		return firstValueFrom(result);
	}
}
