/*
  Warnings:

  - Added the required column `provider` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConnectionStatus" AS ENUM ('active', 'inactive', 'error');

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "provider" "Provider" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usedAt" TIMESTAMP(3);
