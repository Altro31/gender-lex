-- CreateEnum
CREATE TYPE "ModelStatus" AS ENUM ('active', 'connecting', 'error', 'inactive');

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "status" "ModelStatus" NOT NULL DEFAULT 'inactive';

-- DropEnum
DROP TYPE "ConnectionStatus";
