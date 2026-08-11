-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED', 'CANCELLED');

-- CreateTable
CREATE TABLE "seller_applications" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "businessDescription" TEXT,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "stateProvince" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "taxInformation" TEXT,
    "businessRegistrationNumber" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "rejectionReason" TEXT,
    "adminNotes" TEXT,
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" INTEGER,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "seller_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_application_audit_events" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "actorId" INTEGER,
    "action" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seller_application_audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "seller_applications_userId_idx" ON "seller_applications"("userId");

-- CreateIndex
CREATE INDEX "seller_applications_status_idx" ON "seller_applications"("status");

-- CreateIndex
CREATE INDEX "seller_application_audit_events_applicationId_idx" ON "seller_application_audit_events"("applicationId");

-- AddForeignKey
ALTER TABLE "seller_applications" ADD CONSTRAINT "seller_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_applications" ADD CONSTRAINT "seller_applications_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_application_audit_events" ADD CONSTRAINT "seller_application_audit_events_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "seller_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
