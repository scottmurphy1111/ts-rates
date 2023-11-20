-- CreateTable
CREATE TABLE "Row" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "term" TEXT NOT NULL,
    "ageNewer" BOOLEAN NOT NULL,
    "odometerNewer" BOOLEAN NOT NULL,
    "cost" TEXT NOT NULL,
    "deductible" TEXT NOT NULL,
    "aggregateLimit" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "package" TEXT NOT NULL,
    "detailsId" TEXT NOT NULL,
    "rateId" TEXT NOT NULL,
    CONSTRAINT "Option_detailsId_fkey" FOREIGN KEY ("detailsId") REFERENCES "OptionDetails" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Option_rateId_fkey" FOREIGN KEY ("rateId") REFERENCES "Row" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OptionDetails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "term" TEXT NOT NULL,
    "cost" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Ratesheet" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "RatesheetDisclosures" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rateSheetId" TEXT,
    CONSTRAINT "RatesheetDisclosures_rateSheetId_fkey" FOREIGN KEY ("rateSheetId") REFERENCES "Ratesheet" ("name") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RatesheetCoverages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rateSheetId" TEXT,
    CONSTRAINT "RatesheetCoverages_rateSheetId_fkey" FOREIGN KEY ("rateSheetId") REFERENCES "Ratesheet" ("name") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_RatesheetToRow" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_RatesheetToRow_A_fkey" FOREIGN KEY ("A") REFERENCES "Ratesheet" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RatesheetToRow_B_fkey" FOREIGN KEY ("B") REFERENCES "Row" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Ratesheet_name_key" ON "Ratesheet"("name");

-- CreateIndex
CREATE INDEX "Ratesheet_name_idx" ON "Ratesheet"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_RatesheetToRow_AB_unique" ON "_RatesheetToRow"("A", "B");

-- CreateIndex
CREATE INDEX "_RatesheetToRow_B_index" ON "_RatesheetToRow"("B");
