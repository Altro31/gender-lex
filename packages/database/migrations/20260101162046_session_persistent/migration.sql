/*
  Warnings:

  - You are about to drop the column `isAnonymous` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lang` on the `session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isAnonymous";

-- AlterTable
ALTER TABLE "session" DROP COLUMN "lang";

-- DropEnum
DROP TYPE "AuthProvider";
