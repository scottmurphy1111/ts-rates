export const rawData = {
	class_8: {
		header: {
			title: 'Class 8 Diesel - Commercial Truck'
			// subtitle: 'Pricing'
		},
		body: {
			standards: {
				preheader:
					'Engine, Critical Components, and Aftertreatment Coverage <br />with Uptime Benefit & Towing Included',
				standardHeaders: [
					{
						main: 'Term & Mileage Limit'
					},
					{
						main: 'newer',
						span: 2,
						subHeaders: ['up to 600k miles', 'over 600k miles']
					},
					{
						main: 'older',
						span: 2,
						subHeaders: ['up to 600k miles', 'over 600k miles']
					},
					{
						main: 'Deductible'
					}
				]
			},
			options: {
				preheader: 'Optional<br />Coverages',
				optionalHeaders: [
					{
						main: 'Trans & Diff'
					},
					{
						main: 'HVAC'
					},
					{
						main: 'APU'
					}
				]
			},
			data: {
				'12 months/125k miles': {
					pricing: [4000, 4300, 4600, 5000],
					deductible: 350,
					options: [475, 450, 500]
				},
				'24 months/250k miles': {
					pricing: [6100, 6500, 7000, 7500],
					deductible: 250,
					options: [675, 650, 500]
				},
				'36 months/400k miles': {
					pricing: [8300, 9200, 9900, 10800],
					deductible: 150,
					options: [875, 850, 500]
				},
				'48 months/500k miles': {
					pricing: [9100, 10100, 10900, 11900],
					deductible: 0,
					options: [975, 950, 500]
				}
			},
			contentSections: [
				{
					title: 'Eligibility',
					content:
						'Class 8 vehicles up to 10 years old (current model year plus 9 years) are eligible for service contract coverage. Coverage expires upon either expiration of the time from the date of purchase or exceeding themileage limit for the coverage selected, whichever occurs first or when the odometer reaches 1,000,000 miles. The term of any Transmission & Differential or HVAC must match the service contract term'
				},
				{
					title: 'Uptime Benefit',
					content:
						'In the event a service contract claim has been approved and all diagnostics have been completed and a truck is under repair for that claim for more than 15 days, we will pay $1,000. If the repair takes longer than 30 days the payment is $2,000. All payments are made to the lienholder or, in the event there is no lienholder, directly to the service contract holder.'
				},
				{
					title: 'Towing',
					content:
						'Towing expenses from the breakdown site to the nearest repair location are covered.'
				},
				{
					title: 'Deductible',
					content: 'per occurence'
				}
			]
		}
	}
};
