import type { Ratesheet, Row, RatesheetDisclosures, RatesheetCoverages } from '@prisma/client';

export type Output = {
	cardTypes: string[];
	markup: string;
	customLogo?: string;
};

export type RatesheetsWithIncludes = Ratesheet & {
	rows: Row[];
	disclosures: RatesheetDisclosures[];
	coverages: RatesheetCoverages[];
};
