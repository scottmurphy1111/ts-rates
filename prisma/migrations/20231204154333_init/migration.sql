-- CreateTable
CREATE TABLE "Ratesheet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "disclosuresSetId" TEXT NOT NULL,
    CONSTRAINT "Ratesheet_disclosuresSetId_fkey" FOREIGN KEY ("disclosuresSetId") REFERENCES "DisclosuresSet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Row" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "termValue" TEXT NOT NULL,
    "termUnit" TEXT NOT NULL,
    "mileageValue" TEXT NOT NULL,
    "costNewerLowMiles" TEXT NOT NULL,
    "costNewerHighMiles" TEXT NOT NULL,
    "costOlderLowMiles" TEXT NOT NULL,
    "costOlderHighMiles" TEXT NOT NULL,
    "deductible" TEXT NOT NULL,
    "aggregateLimit" TEXT NOT NULL,
    "ratesheetId" TEXT NOT NULL,
    CONSTRAINT "Row_ratesheetId_fkey" FOREIGN KEY ("ratesheetId") REFERENCES "Ratesheet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ratesheetId" TEXT NOT NULL,
    "optionPackageId" TEXT,
    "optionDetailsId" TEXT,
    CONSTRAINT "Option_optionPackageId_fkey" FOREIGN KEY ("optionPackageId") REFERENCES "OptionPackage" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Option_optionDetailsId_fkey" FOREIGN KEY ("optionDetailsId") REFERENCES "OptionDetails" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Option_ratesheetId_fkey" FOREIGN KEY ("ratesheetId") REFERENCES "Ratesheet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OptionPackage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "OptionDetails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "termValue" TEXT NOT NULL,
    "termUnit" TEXT NOT NULL,
    "cost" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DisclosuresSet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Disclosure" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" TEXT NOT NULL,
    "DisclosuresSetId" TEXT NOT NULL,
    CONSTRAINT "Disclosure_DisclosuresSetId_fkey" FOREIGN KEY ("DisclosuresSetId") REFERENCES "DisclosuresSet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RatesheetCoverages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ratesheetId" TEXT NOT NULL,
    CONSTRAINT "RatesheetCoverages_ratesheetId_fkey" FOREIGN KEY ("ratesheetId") REFERENCES "Ratesheet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Ratesheet_name_key" ON "Ratesheet"("name");

-- CreateIndex
CREATE INDEX "Ratesheet_name_idx" ON "Ratesheet"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Option_optionPackageId_key" ON "Option"("optionPackageId");

-- CreateIndex
CREATE UNIQUE INDEX "Option_optionDetailsId_key" ON "Option"("optionDetailsId");
