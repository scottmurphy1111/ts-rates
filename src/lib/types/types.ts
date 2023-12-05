import type {
	Ratesheet,
	Row,
	RatesheetCoverages,
	Option,
	OptionDetails,
	OptionPackage,
	DisclosuresSet,
	Disclosure
} from '@prisma/client';

export type Output = {
	cardTypes: string[];
	markup: string;
	customLogo?: string;
};

export type RatesheetsWithIncludes = Ratesheet & {
	rows: Row[];
	options: OptionWithIncludes[];
	disclosuresSet: DisclosuresSetWithIncludes;
	coverages: RatesheetCoverages[];
};

export type DisclosuresSetWithIncludes = DisclosuresSet & {
	disclosures: Disclosure[];
};

export type OptionWithIncludes = Option & {
	package: OptionPackage;
	details: OptionDetails;
};
