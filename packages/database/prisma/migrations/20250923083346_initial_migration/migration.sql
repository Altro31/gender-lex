-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('superadmin', 'admin', 'authenticated');

-- CreateEnum
CREATE TYPE "public"."AuthProvider" AS ENUM ('local', 'google');

-- CreateEnum
CREATE TYPE "public"."Visibility" AS ENUM ('public', 'private');

-- CreateEnum
CREATE TYPE "public"."InputSource" AS ENUM ('manual', 'file');

-- CreateEnum
CREATE TYPE "public"."AnalysisStatus" AS ENUM ('pending', 'analyzing', 'done', 'error');

-- CreateEnum
CREATE TYPE "public"."BiasedTermCategory" AS ENUM ('paternalistic', 'stereotypical', 'reproductiveExclusion');

-- CreateEnum
CREATE TYPE "public"."ModelRole" AS ENUM ('primary', 'secondary');

-- CreateEnum
CREATE TYPE "public"."ModelStatus" AS ENUM ('active', 'connecting', 'error', 'inactive');

-- CreateEnum
CREATE TYPE "public"."ModelError" AS ENUM ('INVALID_API_KEY', 'INVALID_IDENTIFIER', 'INVALID_CONNECTION_URL', 'INACTIVE_MODEL', 'MAX_ATTEMPTS_REACHED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "isAnonymous" BOOLEAN DEFAULT false,
    "loggedAt" TIMESTAMP(3),
    "role" "public"."Role" NOT NULL DEFAULT 'authenticated',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "lang" TEXT NOT NULL DEFAULT 'en',
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Analysis" (
    "originalText" TEXT NOT NULL,
    "modifiedTextAlternatives" JSONB NOT NULL,
    "biasedTerms" JSONB NOT NULL,
    "biasedMetaphors" JSONB NOT NULL,
    "additionalContextEvaluation" JSONB,
    "impactAnalysis" JSONB,
    "conclusion" TEXT,
    "id" TEXT NOT NULL,
    "name" TEXT,
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'private',
    "status" "public"."AnalysisStatus" NOT NULL DEFAULT 'pending',
    "inputSource" "public"."InputSource" NOT NULL DEFAULT 'manual',
    "presetId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Preset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "Preset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PresetModel" (
    "id" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "role" "public"."ModelRole" NOT NULL,
    "presetId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,

    CONSTRAINT "PresetModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Model" (
    "id" TEXT NOT NULL,
    "connection" JSONB NOT NULL,
    "settings" JSONB NOT NULL,
    "name" TEXT NOT NULL,
    "apiKey" TEXT,
    "status" "public"."ModelStatus" NOT NULL DEFAULT 'inactive',
    "error" "public"."ModelError",
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "public"."session"("token");

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Analysis" ADD CONSTRAINT "Analysis_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "public"."Preset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Analysis" ADD CONSTRAINT "Analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Preset" ADD CONSTRAINT "Preset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PresetModel" ADD CONSTRAINT "PresetModel_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "public"."Preset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PresetModel" ADD CONSTRAINT "PresetModel_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "public"."Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Model" ADD CONSTRAINT "Model_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
