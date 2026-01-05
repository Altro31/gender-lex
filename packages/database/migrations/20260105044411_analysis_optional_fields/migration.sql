-- AlterTable
ALTER TABLE "Analysis" ALTER COLUMN "modifiedTextAlternatives" DROP NOT NULL,
ALTER COLUMN "biasedTerms" DROP NOT NULL,
ALTER COLUMN "biasedMetaphors" DROP NOT NULL;
