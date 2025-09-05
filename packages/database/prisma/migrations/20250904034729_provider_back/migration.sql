/*
  Warnings:

  - You are about to drop the column `provider` on the `Model` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Model" DROP COLUMN "provider";

-- DropEnum
DROP TYPE "Provider";
