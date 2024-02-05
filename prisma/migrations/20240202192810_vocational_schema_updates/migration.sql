-- AlterTable
ALTER TABLE `Ratesheet` ADD COLUMN `isVocational` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Row` ADD COLUMN `truckType` VARCHAR(191) NULL,
    MODIFY `costNewerHighMiles` VARCHAR(191) NULL,
    MODIFY `costOlderLowMiles` VARCHAR(191) NULL,
    MODIFY `costOlderHighMiles` VARCHAR(191) NULL;
