import { BadRequestException, Body, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CacheService } from '@sample/cache';
import { CreatedResponse, FlatQuery, IReq, IRes } from '@sample/common';
import { AppController, GuardCookie, GuardService, JwtInfo } from '@sample/guard';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { ApiRoute } from '@/api/api.service';
import { LoginByOAuthTokenDto, LoginDto, LoginResp, OAuthParams, RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
import { GoogleService } from './google.service';

@AppController(ApiRoute.AUTH)
export class AuthController {
	constructor(
		private readonly adapterHost: HttpAdapterHost,
		private readonly guard: GuardService,
		private readonly google: GoogleService,
		private readonly auth: AuthService,
		private readonly cache: CacheService,
	) {}

	@Post('login')
	@CreatedResponse(LoginResp)
	async login(@Body() payload: LoginDto, @Res() res: IRes) {
		const userId = await this.auth.login(payload);
		return this._signTokens(res, { sub: userId }, payload.isWeb);
	}

	@Post('register')
	@CreatedResponse(LoginResp)
	async register(@Body() payload: RegisterDto, @Res() res: IRes) {
		const userId = await this.auth.register(payload);
		return this._signTokens(res, { sub: userId }, payload.isWeb);
	}

	@Get('google')
	async googleLogin(@Req() req: IReq, @Res() res: IRes, @FlatQuery() query: OAuthParams) {
		const app = this.adapterHost.httpAdapter.getInstance<FastifyInstance>();
		const redirectUri = await app.googleOAuth2.generateAuthorizationUri(req, res);

		const oauthUrlParam = new URL(redirectUri);
		const oauthStateKey = oauthUrlParam.searchParams.get('state');

		const cacheData = { redirectUri: query.redirect_uri };
		await this.cache.set(`oauth:google:${oauthStateKey}`, cacheData);
		return res.redirect(redirectUri, HttpStatus.FOUND);
	}
	@Get('google/callback')
	async googleCallback(@Req() req: FastifyRequest<{ Querystring: { state: string; code: string } }>, @Res() res: IRes) {
		const stateKey = `oauth:google:${req.query.state}`;
		const data = await this.cache.get<{ redirectUri: string }>(stateKey);
		if (!data) throw new BadRequestException('Invalid or expired state parameter');
		await this.cache.del(stateKey);

		const { token } = await this.app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);

		const uri = new URL(data.redirectUri);
		uri.searchParams.set('access_token', token.access_token);
		if (token.refresh_token) uri.searchParams.set('refresh_token', token.refresh_token);

		return res.redirect(uri.toString(), HttpStatus.FOUND);
	}

	@Post('google/token')
	@CreatedResponse(LoginResp)
	async exchangeGoogleCode(@Body() payload: LoginByOAuthTokenDto, @Res() res: IRes) {
		const userInfo = await this.google.getUserInfo(payload.accessToken);
		const userId = await this.google.createUser(userInfo, payload.refreshToken);

		return this._signTokens(res, { sub: userId }, payload.isWeb);
	}

	private async _signTokens(res: IRes, info: JwtInfo, setCookie: boolean) {
		const [accessToken, refreshToken] = await Promise.all([this.guard.signedAccess(info), this.guard.signedRefresh(info)]);
		if (setCookie) {
			res
				.setCookie(GuardCookie.ACCESS_TOKEN, accessToken, { maxAge: this.guard.maxAgeAccess })
				.setCookie(GuardCookie.REFRESH_TOKEN, refreshToken, { maxAge: this.guard.maxAgeRefresh });
		}
		return res.send({ status: 1, data: { userId: info.sub, accessToken, refreshToken } });
	}

	get app() {
		return this.adapterHost.httpAdapter.getInstance<FastifyInstance>();
	}
}
