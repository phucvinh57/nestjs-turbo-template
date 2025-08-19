import { createCipheriv, createDecipheriv, generateKeyPair, randomBytes, scrypt } from 'node:crypto';

type AsymmetricKey = { publicKey: string; privateKey: string };

export const hashed = async (text: string, size: number): Promise<string> => {
	const salt = randomBytes(size).toString('hex');
	return new Promise((resolve, reject) =>
		scrypt(text, salt, 64, (err, token) => (err ? reject(err) : resolve(`${salt}:${token.toString('hex')}`))),
	);
};

export const verify = async (text: string, hash: string): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		const [salt, token] = hash.split(':');
		if (!salt || !token) return reject(new Error('Invalid hash format'));

		return scrypt(text, salt, 64, (err, key) => (err ? reject(err) : resolve(key.toString('hex') === token)));
	});
};

export const encrypt = (text: string, key: Buffer, iv: Buffer): string => {
	const cipher = createCipheriv('aes-256-cbc', key, iv);
	let encrypted = cipher.update(text, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	return encrypted;
};

export const decrypt = (encryptedText: string, key: Buffer, iv: Buffer): string => {
	const decipher = createDecipheriv('aes-256-cbc', key, iv);
	let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	return decrypted;
};

export const generateRSA = (modulusLength: 2048 | 3072 | 4092): Promise<AsymmetricKey> => {
	return new Promise((resolve, reject) =>
		generateKeyPair(
			'rsa',
			{
				modulusLength,
				publicKeyEncoding: { type: 'spki', format: 'pem' },
				privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
			},
			(error, publicKey, privateKey) => (error ? reject(error) : resolve({ publicKey, privateKey })),
		),
	);
};
export const generateESA = (): Promise<AsymmetricKey> => {
	return new Promise((resolve, reject) => {
		generateKeyPair(
			'ec',
			{
				namedCurve: 'P-256',
				publicKeyEncoding: { type: 'spki', format: 'pem' },
				privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
			},
			(error, publicKey, privateKey) => (error ? reject(error) : resolve({ publicKey, privateKey })),
		);
	});
};

export const generateEDA = (): Promise<AsymmetricKey> => {
	return new Promise((resolve, reject) =>
		generateKeyPair(
			'ed25519',
			{ publicKeyEncoding: { type: 'spki', format: 'pem' }, privateKeyEncoding: { type: 'pkcs8', format: 'pem' } },
			(error, publicKey, privateKey) => (error ? reject(error) : resolve({ publicKey, privateKey })),
		),
	);
};
