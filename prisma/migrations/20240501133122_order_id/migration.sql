/*
  Warnings:

  - You are about to drop the column `orderId` on the `OrderReceipt` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_id]` on the table `OrderReceipt` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order_id` to the `OrderReceipt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderReceipt" DROP CONSTRAINT "OrderReceipt_orderId_fkey";

-- DropIndex
DROP INDEX "OrderReceipt_orderId_key";

-- AlterTable
ALTER TABLE "OrderReceipt" DROP COLUMN "orderId",
ADD COLUMN     "order_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OrderReceipt_order_id_key" ON "OrderReceipt"("order_id");

-- AddForeignKey
ALTER TABLE "OrderReceipt" ADD CONSTRAINT "OrderReceipt_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
