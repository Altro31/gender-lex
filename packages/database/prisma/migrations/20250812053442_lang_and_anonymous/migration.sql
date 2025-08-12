/*
  Warnings:

  - You are about to drop the column `lang` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "lang",
ADD COLUMN     "isAnonymous" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "session" ADD COLUMN     "lang" TEXT NOT NULL DEFAULT 'en';
