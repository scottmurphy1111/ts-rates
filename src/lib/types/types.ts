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
	rows: Row[];
	options: Option[];
	disclosuresSet: DisclosuresSetWithIncludes;
	coveragesSet: CoveragesSetWithIncludes;
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
