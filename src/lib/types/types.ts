import type {
	Ratesheet,
	Row,
	Option,
	DisclosuresSet,
	Disclosure,
	CoveragesSet,
	Coverage
} from '@prisma/client';

// export type Output = {
// 	cardTypes: string[];
// 	markup: string;
// 	customLogo?: string;
// };

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
