import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	console.log(`Start seeding ...`);

	const ratesheet1 = await prisma.ratesheet.create({
		data: {
			name: 'class_8',
			title: 'Class 8',
			subtitle: 'Class 8 trucks are the largest on-road trucks',
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
						packageName: 'Trans&Diff',
						termValue: '12',
						termUnit: 'months',
						cost: '475'
					},
					{
						packageName: 'HVAC',
						termValue: '12',
						termUnit: 'months',
						cost: '475'
					}
				]
			},
			disclosuresSet: {
				create: {
					id: '1',
					name: 'Class 8 basic',

					disclosures: {
						create: [
							{
								title: 'Starting',
								description: 'This is the starting disclosure',
								order: '0'
							},
							{
								title: 'Eligibility',
								description: 'This is the eligibility disclosure',
								order: '1'
							},
							{
								title: 'Uptime Benefit',
								description: 'This is the uptime benefit disclosure',
								order: '2'
							}
						]
					}
				}
			},
			coveragesSet: {
				create: {
					id: '1',
					name: 'Class 8 coverages',

					coverages: {
						create: [
							{
								title: 'Starting',
								description: 'This is the starting coverage',
								order: '0'
							},
							{
								title: 'Engine',
								description: 'This is the engine coverage',
								order: '1'
							},
							{
								title: 'Aftertreatment',
								description: 'This is the aftertreatment coverage',
								order: '2'
							}
						]
					}
				}
			}
		}
	});
	console.log(`Created RateSheet with id: ${ratesheet1.name}`);

	const ratesheet2 = await prisma.ratesheet.create({
		data: {
			name: 'class_8_FTL',
			title: 'Class 8 Freightliner',
			subtitle: 'Freightliner Exclusive',
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
						packageName: 'Trans&Diff',
						termValue: '12',
						termUnit: 'months',
						cost: '475'
					}
				]
			},
			disclosuresSet: {
				connect: {
					id: '1'
				}
			},
			coveragesSet: {
				connect: {
					id: '1'
				}
			}
		}
	});
	console.log(`Created RateSheet with id: ${ratesheet2.name}`);

	const disclosuresSet = await prisma.disclosuresSet.create({
		data: {
			id: '2',
			name: 'Class 8 Advanced',

			disclosures: {
				create: [
					{
						title: 'Eligibility2',
						description: 'This is the eligibility disclosure',
						order: '0'
					},
					{
						title: 'Uptime Benefit2',
						description: 'This is the uptime benefit disclosure',
						order: '1'
					},
					{
						title: 'other',
						description: 'This is an other disclosure',
						order: '2'
					}
				]
			}
		}
	});
	const coveragesSet = await prisma.coveragesSet.create({
		data: {
			id: '2',
			name: 'Class 8 Advanced coverages',

			coverages: {
				create: [
					{
						title: 'Engine2',
						description: 'This is the engine coverage',
						order: '0'
					},
					{
						title: 'Trans&Diff2',
						description: 'This is the trans-diff coverage',
						order: '1'
					},
					{
						title: 'Turbo2',
						description: 'This is an turbo coverage',
						order: '2'
					}
				]
			}
		}
	});

	// const disclosure1 = await prisma.disclosure.create({
	// 	data: {
	// 		title: 'Eligibility',
	// 		description: 'This is the eligibility disclosure'
	// 	}
	// });
	// const disclosure2 = await prisma.disclosure.create({
	// 	data: {
	// 		title: 'Uptime Benefit',
	// 		description: 'This is the uptime benefit disclosure'
	// 	}
	// });

	console.log(`Created the Following Disclosures Set: ${disclosuresSet.name}`);
	console.log(`Created the Following Coverages Set: ${coveragesSet.name}`);
	console.log(`Seeding finished.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
