import type {
	Ratesheet,
	Row,
	Option,
	DisclosuresSet,
	Disclosure,
	CoveragesSet,
	Coverage,
	Markup,
	RateOutput
} from '@prisma/client';

export type RatesheetWithIncludes = Ratesheet & {
	rows: RowWithOptionals[];
	options: Option[];
	disclosuresSet: DisclosuresSetWithIncludes;
	coveragesSet: CoveragesSetWithIncludes;
};

export type RowWithOptionals = Omit<
	Row,
	'truckType' | 'costNewerHighMiles' | 'costOlderLowMiles' | 'costOlderHighMiles'
> & {
	truckType?: string | null;
	costNewerHighMiles?: string | null;
	costOlderLowMiles?: string | null;
	costOlderHighMiles?: string | null;
};

export type DisclosuresSetWithIncludes = DisclosuresSet & {
	disclosures: Disclosure[];
};
export type CoveragesSetWithIncludes = CoveragesSet & {
	coverages: Coverage[];
};

export type RateOutputWithIncludes = RateOutput & {
	markups: Markup[];
};
