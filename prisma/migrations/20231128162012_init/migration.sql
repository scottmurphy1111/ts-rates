-- CreateTable
CREATE TABLE "Ratesheet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL
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
    "package" TEXT NOT NULL,
    "ratesheetId" TEXT NOT NULL,
    CONSTRAINT "Option_ratesheetId_fkey" FOREIGN KEY ("ratesheetId") REFERENCES "Ratesheet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OptionDetails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "termValue" TEXT NOT NULL,
    "termUnit" TEXT NOT NULL,
    "cost" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    CONSTRAINT "OptionDetails_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RatesheetDisclosures" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ratesheetId" TEXT NOT NULL,
    CONSTRAINT "RatesheetDisclosures_ratesheetId_fkey" FOREIGN KEY ("ratesheetId") REFERENCES "Ratesheet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
