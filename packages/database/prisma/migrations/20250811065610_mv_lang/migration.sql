/*
  Warnings:

  - You are about to drop the column `lang` on the `session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lang" TEXT NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "session" DROP COLUMN "lang";
