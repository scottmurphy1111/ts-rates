-- CreateTable
CREATE TABLE "Ratesheet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "disclosuresSetId" TEXT NOT NULL,
    "coveragesSetId" TEXT NOT NULL,
    CONSTRAINT "Ratesheet_disclosuresSetId_fkey" FOREIGN KEY ("disclosuresSetId") REFERENCES "DisclosuresSet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ratesheet_coveragesSetId_fkey" FOREIGN KEY ("coveragesSetId") REFERENCES "CoveragesSet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
    "packageName" TEXT NOT NULL,
    "termValue" TEXT NOT NULL,
    "termUnit" TEXT NOT NULL,
    "cost" TEXT NOT NULL,
    "ratesheetId" TEXT NOT NULL,
    CONSTRAINT "Option_ratesheetId_fkey" FOREIGN KEY ("ratesheetId") REFERENCES "Ratesheet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DisclosuresSet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Disclosure" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" TEXT NOT NULL,
    "disclosuresSetId" TEXT NOT NULL,
    CONSTRAINT "Disclosure_disclosuresSetId_fkey" FOREIGN KEY ("disclosuresSetId") REFERENCES "DisclosuresSet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CoveragesSet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Coverage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" TEXT NOT NULL,
    "coveragesSetId" TEXT NOT NULL,
    CONSTRAINT "Coverage_coveragesSetId_fkey" FOREIGN KEY ("coveragesSetId") REFERENCES "CoveragesSet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Ratesheet_name_key" ON "Ratesheet"("name");

-- CreateIndex
CREATE INDEX "Ratesheet_name_idx" ON "Ratesheet"("name");
