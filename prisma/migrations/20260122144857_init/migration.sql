/*
  Warnings:

  - You are about to drop the column `note` on the `StockMovement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StockMovement" DROP COLUMN "note",
ADD COLUMN     "reason" TEXT;
