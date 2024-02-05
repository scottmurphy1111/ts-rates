/*
  Warnings:

  - You are about to alter the column `isVocational` on the `Ratesheet` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Ratesheet` MODIFY `isVocational` VARCHAR(191) NULL DEFAULT '';
