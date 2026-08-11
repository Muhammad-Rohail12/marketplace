-- AlterTable
ALTER TABLE "users" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "deactivatedAt" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "lastPasswordChangeAt" TIMESTAMP(3),
ADD COLUMN     "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "timeZone" TEXT;
