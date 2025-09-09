/*
  Warnings:

  - You are about to drop the `_AnalysisToPreset` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `presetId` to the `Analysis` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_AnalysisToPreset" DROP CONSTRAINT "_AnalysisToPreset_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AnalysisToPreset" DROP CONSTRAINT "_AnalysisToPreset_B_fkey";

-- AlterTable
ALTER TABLE "public"."Analysis" ADD COLUMN     "presetId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."_AnalysisToPreset";

-- AddForeignKey
ALTER TABLE "public"."Analysis" ADD CONSTRAINT "Analysis_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "public"."Preset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
