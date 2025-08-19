import { BadRequestException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { ApiService } from '@/api/api.service';
import { LoginDto, RegisterDto } from './auth.dto';

const SALT_ROUNDS = 10;

export class AuthService extends ApiService {
	async login({ email, password }: LoginDto): Promise<string> {
		const user = await this.db.user.findUnique({
			where: { email },
			select: { id: true, password: true },
		});

		if (!user || !user.password) {
			throw new BadRequestException('Invalid email or password');
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new BadRequestException('Invalid email or password');
		}

		return user.id;
	}

	async register(payload: RegisterDto): Promise<string> {
		const { email, password, firstName, lastName, phone } = payload;
		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
		const user = await this.db.user.create({
			data: {
				email,
				password: hashedPassword,
				name: `${firstName} ${lastName}`,
				phone,
				saltRound: SALT_ROUNDS,
			},
			select: { id: true },
		});
		return user.id;
	}
}
