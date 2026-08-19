-- AlterTable
ALTER TABLE "Withdrawal" ADD COLUMN     "exchangeRate" DECIMAL(18,6),
ADD COLUMN     "paymentAccountId" TEXT,
ADD COLUMN     "payoutAmount" DECIMAL(12,2),
ADD COLUMN     "payoutCurrency" TEXT;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_paymentAccountId_fkey" FOREIGN KEY ("paymentAccountId") REFERENCES "PaymentAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
