-- CreateEnum
CREATE TYPE "PaymentAccountType" AS ENUM ('MPESA', 'BANK');

-- CreateEnum
CREATE TYPE "PaymentAccountStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "PaymentAccount" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "type" "PaymentAccountType" NOT NULL,
    "status" "PaymentAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "accountName" TEXT,
    "phoneNumber" TEXT,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "bankCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'KE',
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "provider" TEXT,
    "providerReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentAccount_workerId_idx" ON "PaymentAccount"("workerId");

-- CreateIndex
CREATE INDEX "PaymentAccount_type_idx" ON "PaymentAccount"("type");

-- CreateIndex
CREATE INDEX "PaymentAccount_status_idx" ON "PaymentAccount"("status");

-- AddForeignKey
ALTER TABLE "PaymentAccount" ADD CONSTRAINT "PaymentAccount_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
