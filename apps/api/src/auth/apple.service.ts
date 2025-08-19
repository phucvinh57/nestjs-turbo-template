import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import { ApiService } from '@/api/api.service';
import { AppleUser } from './auth.type';

@Injectable()
export class AppleService extends ApiService {
	async getUserInfo(idToken: string): Promise<AppleUser> {
		const decodedHeader = jwt.decode(idToken, { complete: true });
		if (!decodedHeader || typeof decodedHeader === 'string' || !decodedHeader.header.kid) {
			throw new Error('Invalid token header');
		}
		const kid = decodedHeader.header.kid;

		const response = await fetch('https://appleid.apple.com/auth/keys');
		if (!response.ok) {
			throw new Error('Failed to fetch Apple public keys');
		}
		const jwks = await response.json();
		const jwk = jwks.keys.find((k: Record<string, unknown>) => k.kid === kid);
		if (!jwk) {
			throw new Error('Matching key not found');
		}

		const pem = jwkToPem(jwk);
		return new Promise((resolve, reject) => {
			jwt.verify(idToken, pem, { algorithms: ['RS256'] }, (err, decoded) => {
				if (err) return reject(err);
				resolve(decoded as AppleUser);
			});
		});
	}
}
