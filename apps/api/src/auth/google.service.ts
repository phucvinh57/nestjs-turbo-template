import { Injectable, OnModuleInit } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ApiService } from '@/api/api.service';
import { GoogleUser } from './auth.type';

@Injectable()
export class GoogleService extends ApiService implements OnModuleInit {
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: <init in onModuleInit hook>
	private googleOAuth: OAuth2Client;

	onModuleInit(): void {
		this.googleOAuth = new OAuth2Client({
			clientId: this.config.get<string>('api.auth.google.clientId'),
			clientSecret: this.config.get<string>('api.auth.google.clientSecret'),
		});
	}

	async getUserInfo(accessToken: string): Promise<GoogleUser> {
		const user: GoogleUser = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`).then((res) =>
			res.json(),
		);
		return user;
	}

	async createUser(user: GoogleUser, refreshToken?: string): Promise<string> {
		const {
			user: { id },
		} = await this.db.oAuthAccount.upsert({
			select: { user: { select: { id: true } } },
			create: {
				externalId: user.sub,
				externalUserInfo: user,
				provider: 'GOOGLE',
				refreshToken,
				user: {
					connectOrCreate: {
						where: { email: user.email },
						create: {
							email: user.email,
							name: user.name,
						},
					},
				},
			},
			update: {
				externalUserInfo: user,
				refreshToken,
			},
			where: { externalId_provider: { externalId: user.sub, provider: 'GOOGLE' } },
		});
		return id;
	}
}
