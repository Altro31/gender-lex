-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Preset" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;
