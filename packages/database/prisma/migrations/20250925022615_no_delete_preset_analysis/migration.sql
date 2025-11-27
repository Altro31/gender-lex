-- DropForeignKey
ALTER TABLE "public"."Analysis" DROP CONSTRAINT "Analysis_presetId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Analysis" ADD CONSTRAINT "Analysis_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "public"."Preset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
