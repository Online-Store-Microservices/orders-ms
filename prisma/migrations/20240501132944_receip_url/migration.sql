/*
  Warnings:

  - You are about to drop the column `receipUrl` on the `OrderReceipt` table. All the data in the column will be lost.
  - Added the required column `receip_url` to the `OrderReceipt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderReceipt" DROP COLUMN "receipUrl",
ADD COLUMN     "receip_url" TEXT NOT NULL;
