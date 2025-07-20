-- CreateEnum
CREATE TYPE "Role" AS ENUM ('superadmin', 'admin', 'authenticated');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('local', 'google');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('public', 'private');

-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('analyzing', 'done');

-- CreateEnum
CREATE TYPE "BiasedTermCategory" AS ENUM ('paternalistic', 'stereotypical', 'reproductiveExclusion');

-- CreateEnum
CREATE TYPE "ModelRole" AS ENUM ('primary', 'secondary');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('local', 'openai');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "provider" "AuthProvider" NOT NULL DEFAULT 'local',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'authenticated',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "originalText" TEXT NOT NULL,
    "modifiedTextAlternatives" JSONB NOT NULL,
    "biasedTerms" JSONB NOT NULL,
    "biasedMetaphors" JSONB NOT NULL,
    "additionalContextEvaluation" JSONB,
    "impactAnalysis" JSONB,
    "conclusion" TEXT,
    "visibility" "Visibility" NOT NULL DEFAULT 'private',
    "status" "AnalysisStatus" NOT NULL DEFAULT 'analyzing',
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Preset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresetModel" (
    "role" "ModelRole" NOT NULL,
    "presetId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,

    CONSTRAINT "PresetModel_pkey" PRIMARY KEY ("role","presetId")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "connection" JSONB NOT NULL,
    "settings" JSONB NOT NULL,
    "name" TEXT NOT NULL,
    "apiKey" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnalysisToPreset" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AnalysisToPreset_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "_AnalysisToPreset_B_index" ON "_AnalysisToPreset"("B");

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preset" ADD CONSTRAINT "Preset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresetModel" ADD CONSTRAINT "PresetModel_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "Preset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresetModel" ADD CONSTRAINT "PresetModel_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnalysisToPreset" ADD CONSTRAINT "_AnalysisToPreset_A_fkey" FOREIGN KEY ("A") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnalysisToPreset" ADD CONSTRAINT "_AnalysisToPreset_B_fkey" FOREIGN KEY ("B") REFERENCES "Preset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
