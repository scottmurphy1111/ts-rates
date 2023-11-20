import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	console.log(`Start seeding ...`);

	const ratesheet1 = await prisma.ratesheet.create({
		data: {
			name: 'class_8',
			rows: {
				create: [
					{
						term: '12/125',
						ageNewer: true,
						odometerNewer: true,
						cost: '4000',
						deductible: '350',
						aggregateLimit: '30000',
						options: {
							create: [
								{
									package: 'Trans&Diff',
									details: {
										create: {
											term: '12 months',
											cost: '475'
										}
									}
								}
							]
						}
					}
				]
			},
			disclosures: {
				create: [
					{
						title: 'Eligibility',
						description: 'This is the eligibility disclosure'
					}
				]
			},
			coverages: {
				create: [
					{
						title: 'Coverage',
						description: 'This is the coverage disclosure'
					}
				]
			}
		}
	});
	console.log(`Created RateSheet with id: ${ratesheet1.name}`);

	const ratesheet2 = await prisma.ratesheet.create({
		data: {
			name: 'class_8_FTL',
			rows: {
				create: [
					{
						term: '12/125',
						ageNewer: true,
						odometerNewer: true,
						cost: '4000',
						deductible: '350',
						aggregateLimit: '30000',
						options: {
							create: [
								{
									package: 'Trans&Diff',
									details: {
										create: {
											term: '12 months',
											cost: '475'
										}
									}
								}
							]
						}
					}
				]
			},
			disclosures: {
				create: [
					{
						title: 'Eligibility',
						description: 'This is the eligibility disclosure'
					}
				]
			},
			coverages: {
				create: [
					{
						title: 'Coverage',
						description: 'This is the coverage disclosure'
					}
				]
			}
		}
	});
	console.log(`Created RateSheet with id: ${ratesheet2.name}`);
}
console.log(`Seeding finished.`);

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
