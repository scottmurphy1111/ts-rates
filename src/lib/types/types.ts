import type {
	Ratesheet,
	Row,
	RatesheetDisclosures,
	RatesheetCoverages,
	Option,
	OptionDetails
} from '@prisma/client';

export type Output = {
	cardTypes: string[];
	markup: string;
	customLogo?: string;
};

export type RatesheetsWithIncludes = Ratesheet & {
	rows: Row[];
	options: OptionWithIncludes[];
	disclosures: RatesheetDisclosures[];
	coverages: RatesheetCoverages[];
};

export type OptionWithIncludes = Option & {
	details: OptionDetails[];
};
