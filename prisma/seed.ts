import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	console.log(`Start seeding ...`);

	const ratesheet1 = await prisma.ratesheet.create({
		data: {
			id: 'class_8',
			createdAt: new Date(),
			updatedAt: new Date(),
			name: 'class_8',
			title: 'Class 8',
			subtitle: 'Aftermarket Warranty Pricing',
			lowMileageCutoff: '600',
			rows: {
				create: [
					{
						termValue: '12',
						termUnit: 'months',
						mileageValue: '125',
						costNewerLowMiles: '4000',
						costNewerHighMiles: '4300',
						costOlderLowMiles: '4600',
						costOlderHighMiles: '5000',
						deductible: '350',
						aggregateLimit: '30000'
					},
					{
						termValue: '24',
						termUnit: 'months',
						mileageValue: '250',
						costNewerLowMiles: '6100',
						costNewerHighMiles: '6500',
						costOlderLowMiles: '7000',
						costOlderHighMiles: '7500',
						deductible: '250',
						aggregateLimit: '32500'
					},
					{
						termValue: '36',
						termUnit: 'months',
						mileageValue: '400',
						costNewerLowMiles: '8300',
						costNewerHighMiles: '9200',
						costOlderLowMiles: '9900',
						costOlderHighMiles: '10800',
						deductible: '150',
						aggregateLimit: '35000'
					},
					{
						termValue: '48',
						termUnit: 'months',
						mileageValue: '550',
						costNewerLowMiles: '9100',
						costNewerHighMiles: '10100',
						costOlderLowMiles: '10900',
						costOlderHighMiles: '11900',
						deductible: '0',
						aggregateLimit: '35000'
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
						packageName: 'Trans&Diff',
						termValue: '24',
						termUnit: 'months',
						cost: '675'
					},
					{
						packageName: 'Trans&Diff',
						termValue: '36',
						termUnit: 'months',
						cost: '875'
					},
					{
						packageName: 'Trans&Diff',
						termValue: '48',
						termUnit: 'months',
						cost: '975'
					},
					{
						packageName: 'HVAC',
						termValue: '12',
						termUnit: 'months',
						cost: '450'
					},
					{
						packageName: 'HVAC',
						termValue: '24',
						termUnit: 'months',
						cost: '650'
					},
					{
						packageName: 'HVAC',
						termValue: '36',
						termUnit: 'months',
						cost: '850'
					},
					{
						packageName: 'HVAC',
						termValue: '48',
						termUnit: 'months',
						cost: '950'
					},
					{
						packageName: 'APU',
						termValue: '12',
						termUnit: 'months',
						cost: '500'
					},
					{
						packageName: 'APU',
						termValue: '24',
						termUnit: 'months',
						cost: '500'
					},
					{
						packageName: 'APU',
						termValue: '36',
						termUnit: 'months',
						cost: '500'
					},
					{
						packageName: 'APU',
						termValue: '48',
						termUnit: 'months',
						cost: '500'
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
								title: 'Eligibility',
								description:
									'Class 8 vehicles up to 10 years old (current model year plus 9 years) are eligible for service contract coverage. Coverage expires upon either expiration of the time from the date of purchase or exceeding the mileage limit for the coverage selected, whichever occurs first or when the odometer reaches 1,000,000 miles. The term of any Transmission & Differential or HVAC must match the service contract term.',
								order: '0'
							},
							{
								title: 'Uptime Benefit',
								description:
									'In the event a service contract claim has been approved and all diagnostics have been completed and a truck is under repair for that claim for more than 15 days, we will pay $1,000. If the repair takes longer than 30 days the payment is $2,000. All payments are made to the lienholder or, in the event there is no lienholder, directly to the service contract holder.',
								order: '1'
							},
							{
								title: 'Towing',
								description:
									'Towing expenses from the breakdown site to the nearest repair location are covered.',
								order: '2'
							},
							{
								title: 'Deductible',
								description: 'Per occurence.',
								order: '3'
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
								title: 'Engine',
								description:
									'Camshaft and cam bearings, cam followers, connecting rods, connecting rod bearings, connecting rod caps and screws, crankshaft, cylinder block casting, cylinder head and head gasket, cylinder liners, cylinder head bolts, engine air compressor, hydraulic lifters, injector cups, intake and exhaust valves, intake and exhaust valve guides, knock sensors, main bearings, manifold absolute pressure (map) sensor, oil cooler and housing, oil pan, oil pump gears and housing, oil pump pick up screen and tube, oil pump pressure relief springs and valves, pistons, piston rings and piston oil cooling jets, pushrods, rocker arms and rocker arm shafts, thrust washers, timing gears and housing, timing gear cover, valve cover, valve retainers and keepers (locks), valve seats and valve springs, water pump and wrist pins.',
								order: '0'
							},
							{
								title: 'Engine fuel injectors, fuel pump & ECMs',
								description:
									'Complete Injector, fuel injector hard lines, fuel injection pump, fuel pump and engine control module (ECM).',
								order: '1'
							},
							{
								title: 'Aftertreatment',
								description:
									'Aftertreatment electronic control module (ACM), back pressure control valve (BPV), diesel exhaust fluid, (DEF) module with injection nozzle, DEF heater control relay, DEF dosing module - wiring harness, DEF heated lines (3), DEF heater coolant control valve, DEF heating elements, DEF heating fittings (3 on supply module), DEF pump and module, DEF solution level/temperature sensor, DEF tank, diesel oxidation catalyst (DOC), diesel particulate filter (DPF), DPF air, fuel and coolant lines, DPF manifold assembly, DPF dosing module, exhaust gas recirculation (EGR) valves, EGR actuator, EGR connecting bellows and clamps, EGR cooler(s), exhaust piping, exhaust clamps, exhaust gaskets, exhaust throttle valve, hydrocarbon doser injector (HC doser, 7th injector, ARD, AHI module), hydrocarbon doser valve - Air, Fuel, and coolant lines; and inline air filter, hydrocarbon doser valve (Voss valve), selective catalytic reduction (SCR) catalyst and SCR decomposition pipe and pipe elbows.',
								order: '2'
							},
							{
								title: 'Sensors',
								description:
									'BPV Pressure, Delta P (DPF pressure), DOC inlet pressure, DOC (post) temperature, DOC (pre) temperature, DPF air supply pressure, DPF back pressure, DPF fuel pressure, lambda (O2 sensor), NH3, NOx (2), pressure after exhaust throttle valve, SCR (Post) temperature, SCR (Pre) temperature, wiring harness - emission systems (including overlay).',
								order: '3'
							},
							{
								title: 'Engine Accessories',
								description:
									'Alternator, charge air cooler, exhaust manifold, fan clutch & hub, flywheel housing, intake manifold, radiator, starter and starter solenoid, thermostat housing and vibration dampener.',
								order: '4'
							},
							{
								title: 'Turbocharger',
								description:
									'Bearings, internal variable vane assembly, turbine and turbine shaft, turbo housing and VVT actuator.',
								order: '5'
							},
							{
								title: 'Option: Transmission (manual or automatic)',
								description:
									'Bands, bearings, blockers, bushings, control module (TCM), drums, gear sets, governor, oil pump, shaft(s), shift forks, synchronizers, thrust washers, torque converter, valve body and transmission case.',
								order: '6'
							},
							{
								title: 'Option: Differential',
								description:
									'Axle Housing, axle shafts, bearings, bushings, carrier case, gear sets, limited slip clutch pack and power divider.',
								order: '7'
							},
							{
								title: 'Option: HVAC',
								description:
									'HVAC air compressor & clutch, HVAC blower motor & resistor, HVAC heater core, HVAC temperature controls, HVAC control head and HVAC control valves.',
								order: '8'
							},
							{
								title: 'Option: APU Engine',
								description:
									'Internally Lubricated Covered Components. Does not include electrical generator unit or other electrical components or wiring. No damage resulting from a seal leak or blown head gasket is covered.',
								order: '9'
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
			id: 'class_8_FTL',
			createdAt: new Date(),
			updatedAt: new Date(),
			name: 'class_8_FTL',
			title: 'Class 8 Freightliner',
			subtitle: 'Freightliner Exclusive',
			lowMileageCutoff: '125',
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

	const rateOutput = await prisma.rateOutput.create({
		data: {
			id: '1',
			userId: '1',
			ratesheetId: 'class_8',
			color: 'sky',
			label: 'Test Output',
			logoUrl:
				'https://logos-download.com/wp-content/uploads/2016/02/Freightliner-logo-original.png',
			markups: {
				create: [
					{
						termValue: '12',
						markupValue: '500'
					},
					{
						termValue: '24',
						markupValue: '1000'
					},
					{
						termValue: '36',
						markupValue: '1500'
					},
					{
						termValue: '48',
						markupValue: '2000'
					}
				]
			}
		}
	});

	console.log(`Created the Following Disclosures Set: ${disclosuresSet.name}`);
	console.log(`Created the Following Coverages Set: ${coveragesSet.name}`);
	console.log(`Created the Following Rate Output: ${rateOutput.id}`);
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
