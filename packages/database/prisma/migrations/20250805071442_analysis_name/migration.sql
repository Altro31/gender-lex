-- CreateEnum
CREATE TYPE "InputSource" AS ENUM ('manual', 'file');

-- AlterTable
ALTER TABLE "Analysis" ADD COLUMN     "inputSource" "InputSource" NOT NULL DEFAULT 'manual',
ADD COLUMN     "name" TEXT;
