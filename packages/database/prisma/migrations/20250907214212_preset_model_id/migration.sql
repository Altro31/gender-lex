/*
  Warnings:

  - The primary key for the `PresetModel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `PresetModel` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "public"."PresetModel" DROP CONSTRAINT "PresetModel_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "PresetModel_pkey" PRIMARY KEY ("id");
