/*
  Warnings:

  - You are about to drop the column `modifiedText` on the `Request` table. All the data in the column will be lost.
  - Added the required column `modifiedTextAlternatives` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BiasedTermCategory" AS ENUM ('paternalistic', 'stereotypical', 'reproductiveExclusion');

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "modifiedText",
ADD COLUMN     "modifiedTextAlternatives" JSONB NOT NULL;
