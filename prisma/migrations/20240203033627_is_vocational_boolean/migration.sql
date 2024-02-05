/*
  Warnings:

  - You are about to alter the column `isVocational` on the `Ratesheet` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `Ratesheet` MODIFY `isVocational` BOOLEAN NULL DEFAULT false;
