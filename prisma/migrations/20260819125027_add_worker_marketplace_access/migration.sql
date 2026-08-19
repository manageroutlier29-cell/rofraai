-- CreateTable
CREATE TABLE "WorkerAccess" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "freeTaskLimit" INTEGER NOT NULL DEFAULT 3,
    "tasksClaimed" INTEGER NOT NULL DEFAULT 0,
    "tasksCompleted" INTEGER NOT NULL DEFAULT 0,
    "isUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "unlockFee" DECIMAL(12,2) NOT NULL DEFAULT 5.00,
    "unlockedAt" TIMESTAMP(3),
    "unlockTransactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkerAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkerAccess_workerId_key" ON "WorkerAccess"("workerId");

-- CreateIndex
CREATE INDEX "WorkerAccess_workerId_idx" ON "WorkerAccess"("workerId");

-- CreateIndex
CREATE INDEX "WorkerAccess_isUnlocked_idx" ON "WorkerAccess"("isUnlocked");

-- AddForeignKey
ALTER TABLE "WorkerAccess" ADD CONSTRAINT "WorkerAccess_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
