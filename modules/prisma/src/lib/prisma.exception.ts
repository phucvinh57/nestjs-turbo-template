import { HttpStatus } from '@nestjs/common';

export type PrismaKnowCode = 'P2000' | 'P2001' | 'P2002' | 'P2006' | 'P2015' | 'P2020' | 'P2025' | 'P2034' | 'P2003';
export type PrismaAppError = {
	http: HttpStatus;
	code: string;
	message: string;
};
export const PRISMA_KNOW_ERROR: Record<PrismaKnowCode, PrismaAppError> = {
	P2000: {
		http: HttpStatus.BAD_REQUEST,
		code: 'P2000',
		message: 'Value is too long',
	},
	P2001: {
		http: HttpStatus.NOT_FOUND,
		code: 'P2001',
		message: 'Data not found',
	},
	P2002: {
		http: HttpStatus.CONFLICT,
		code: 'P2002',
		message: 'Data already exists',
	},
	P2006: {
		http: HttpStatus.BAD_REQUEST,
		code: 'P2006',
		message: 'Invalid data value',
	},
	P2003: {
		http: HttpStatus.BAD_REQUEST,
		code: 'P2003',
		message: 'Invalid data value',
	},
	P2015: {
		http: HttpStatus.NOT_FOUND,
		code: 'P2015',
		message: 'Related record not found',
	},
	P2020: {
		http: HttpStatus.BAD_REQUEST,
		code: 'P2020',
		message: 'Value out of range',
	},
	P2025: {
		http: HttpStatus.NOT_FOUND,
		code: 'P2025',
		message: 'Related data not found',
	},
	P2034: {
		http: HttpStatus.UNPROCESSABLE_ENTITY,
		code: 'P2034',
		message: 'Please retry your transaction',
	},
};
