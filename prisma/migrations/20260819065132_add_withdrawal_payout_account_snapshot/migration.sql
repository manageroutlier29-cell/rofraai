-- AlterTable
ALTER TABLE "Withdrawal" ADD COLUMN     "payoutAccountName" TEXT,
ADD COLUMN     "payoutAccountNumber" TEXT,
ADD COLUMN     "payoutBankCode" TEXT,
ADD COLUMN     "payoutBankName" TEXT,
ADD COLUMN     "payoutCountry" TEXT,
ADD COLUMN     "payoutCurrencyCode" TEXT,
ADD COLUMN     "payoutPhoneNumber" TEXT;
