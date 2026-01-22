/*
  Warnings:

  - You are about to drop the column `quantity` on the `StockMovement` table. All the data in the column will be lost.
  - Added the required column `qty` to the `StockMovement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StockMovement" DROP COLUMN "quantity",
ADD COLUMN     "qty" INTEGER NOT NULL;
