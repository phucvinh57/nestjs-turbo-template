import { db } from './db';
import { logger } from './logger';

const districts = [
	'Phra Nakhon',
	'Dusit',
	'Nong Chok',
	'Bang Rak',
	'Bang Khen',
	'Bang Kapi',
	'Pathum Wan',
	'Pom Prap Sattru Phai',
	'Phra Khanong',
	'Min Buri',
	'Lat Krabang',
	'Yan Nawa',
	'Samphanthawong',
	'Phaya Thai',
	'Thon Buri',
	'Bangkok Yai',
	'Huai Khwang',
	'Khlong San',
	'Taling Chan',
	'Bangkok Noi',
	'Bang Khun Thian',
	'Phasi Charoen',
	'Nong Khaem',
	'Rat Burana',
	'Bang Phlat',
	'Din Daeng',
	'Bueng Kum',
	'Sathon',
	'Bang Sue',
	'Chatuchak',
	'Bang Kho Laem',
	'Prawet',
	'Khlong Toei',
	'Suan Luang',
	'Chom Thong',
	'Don Mueang',
	'Ratchathewi',
	'Lat Phrao',
	'Watthana',
	'Bang Khae',
	'Lak Si',
	'Sai Mai',
	'Khan Na Yao',
	'Saphan Sung',
	'Wang Thonglang',
	'Khlong Sam Wa',
	'Bang Na',
	'Thawi Watthana',
	'Thung Khru',
	'Bang Bon',
];

async function main() {
	const foundCities = await db.city.findMany({
		where: {
			name: {
				in: districts,
			},
			stateId: 4188, // Bangkok
			countryId: 219, // Thailand
		},
		select: {
			name: true,
		},
	});

	const foundCityNames = foundCities.map((city) => city.name);
	const missingCities = districts.filter((city) => !foundCityNames.includes(city));

	if (missingCities.length > 0) {
		const { count } = await db.city.createMany({
			data: missingCities.map((name) => ({
				name,
				stateCode: '10',
				countryCode: 'TH',
				latitude: -1,
				longitude: -1,
				stateId: 4188, // Bangkok
				countryId: 219, // Thailand
			})),
			skipDuplicates: true,
		});
		logger.info(`Added ${count} missing districts to Bangkok.`);
	}
}

main().catch(logger.error);
