import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	console.log(`Start seeding ...`);

	const ratesheet1 = await prisma.ratesheet.create({
		data: {
			name: 'class_8',
			title: 'Class 8',
			rows: {
				create: [
					{
						termValue: '12',
						termUnit: 'months',
						mileageValue: '125',
						costNewerLowMiles: '4000',
						costNewerHighMiles: '5000',
						costOlderLowMiles: '6000',
						costOlderHighMiles: '7000',
						deductible: '350',
						aggregateLimit: '30000'
					},
					{
						termValue: '24',
						termUnit: 'months',
						mileageValue: '250',
						costNewerLowMiles: '4000',
						costNewerHighMiles: '5000',
						costOlderLowMiles: '6000',
						costOlderHighMiles: '7000',
						deductible: '350',
						aggregateLimit: '30000'
					}
				]
			},
			options: {
				create: [
					{
						package: 'Trans&Diff',
						details: {
							create: {
								termValue: '12',
								termUnit: 'months',
								cost: '475'
							}
						}
					},
					{
						package: 'Trans&Diff',
						details: {
							create: {
								termValue: '24',
								termUnit: 'months',
								cost: '575'
							}
						}
					}
				]
			},
			disclosures: {
				create: [
					{
						title: 'Eligibility',
						description: 'This is the eligibility disclosure'
					},
					{
						title: 'Uptime Benefit',
						description: 'This is the uptime benefit disclosure'
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
			title: 'Class 8 Freightliner',
			rows: {
				create: [
					{
						termValue: '12',
						termUnit: 'months',
						mileageValue: '125',
						costNewerLowMiles: '4000',
						costNewerHighMiles: '5000',
						costOlderLowMiles: '6000',
						costOlderHighMiles: '7000',
						deductible: '350',
						aggregateLimit: '30000'
					}
				]
			},
			options: {
				create: [
					{
						package: 'Trans&Diff',
						details: {
							create: {
								termValue: '12',
								termUnit: 'months',
								cost: '475'
							}
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
