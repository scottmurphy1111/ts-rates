-- CreateTable
CREATE TABLE `Ratesheet` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NOT NULL,
    `lowMileageCutoff` VARCHAR(191) NULL,
    `disclosuresSetId` VARCHAR(191) NULL,
    `coveragesSetId` VARCHAR(191) NULL,

    UNIQUE INDEX `Ratesheet_name_key`(`name`),
    INDEX `Ratesheet_name_idx`(`name`),
    INDEX `Ratesheet_disclosuresSetId_idx`(`disclosuresSetId`),
    INDEX `Ratesheet_coveragesSetId_idx`(`coveragesSetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Row` (
    `id` VARCHAR(191) NOT NULL,
    `termValue` VARCHAR(191) NOT NULL,
    `termUnit` VARCHAR(191) NOT NULL,
    `mileageValue` VARCHAR(191) NOT NULL,
    `costNewerLowMiles` VARCHAR(191) NOT NULL,
    `costNewerHighMiles` VARCHAR(191) NOT NULL,
    `costOlderLowMiles` VARCHAR(191) NOT NULL,
    `costOlderHighMiles` VARCHAR(191) NOT NULL,
    `deductible` VARCHAR(191) NOT NULL,
    `aggregateLimit` VARCHAR(191) NOT NULL,
    `ratesheetId` VARCHAR(191) NOT NULL,

    INDEX `Row_ratesheetId_idx`(`ratesheetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Option` (
    `id` VARCHAR(191) NOT NULL,
    `packageName` VARCHAR(191) NOT NULL,
    `termValue` VARCHAR(191) NOT NULL,
    `termUnit` VARCHAR(191) NOT NULL,
    `cost` VARCHAR(191) NOT NULL,
    `ratesheetId` VARCHAR(191) NOT NULL,

    INDEX `Option_ratesheetId_idx`(`ratesheetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DisclosuresSet` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Disclosure` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `order` VARCHAR(191) NOT NULL,
    `disclosuresSetId` VARCHAR(191) NOT NULL,

    INDEX `Disclosure_disclosuresSetId_idx`(`disclosuresSetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoveragesSet` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coverage` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `order` VARCHAR(191) NOT NULL,
    `coveragesSetId` VARCHAR(191) NOT NULL,

    INDEX `Coverage_coveragesSetId_idx`(`coveragesSetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
