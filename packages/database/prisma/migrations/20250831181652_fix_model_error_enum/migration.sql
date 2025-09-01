/*
  Warnings:

  - The values [MISSING_API_KEY] on the enum `ModelError` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ModelError_new" AS ENUM ('INVALID_API_KEY', 'INVALID_IDENTIFIER', 'INVALID_CONNECTION_URL', 'INACTIVE_MODEL', 'MAX_ATTEMPTS_REACHED');
ALTER TABLE "Model" ALTER COLUMN "error" TYPE "ModelError_new" USING ("error"::text::"ModelError_new");
ALTER TYPE "ModelError" RENAME TO "ModelError_old";
ALTER TYPE "ModelError_new" RENAME TO "ModelError";
DROP TYPE "ModelError_old";
COMMIT;
