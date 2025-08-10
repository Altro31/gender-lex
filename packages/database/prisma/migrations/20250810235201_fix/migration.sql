/*
  Warnings:

  - Made the column `lang` on table `session` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "session" ALTER COLUMN "lang" SET NOT NULL;
