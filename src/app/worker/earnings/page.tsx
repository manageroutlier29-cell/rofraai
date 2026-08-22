"use client";

import { useEffect, useState } from "react";

type Earning = {
  id: string;
  amount: string;
  status: "PENDING" | "AVAILABLE" | "PAID" | "REVERSED";
  description: string | null;
  assignmentId: string;
  task: {
    id: string;
    title: string;
    category: string;
    reward: string;
  };
  project: {
    id: string;
    title: string;
  };
  availableAt: string | null;
  paidAt: string | null;
  reversedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type Withdrawal = {
  id: string;
  amount: string;
  status: "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "CANCELLED";
  paymentMethod: string | null;
  requestedAt: string;
};

type PaymentAccount = {
  id: string;
  type: "MPESA" | "BANK";
  status: "ACTIVE" | "INACTIVE";
  isDefault: boolean;
  accountName: string | null;
  phoneNumber: string | null;
  bankName: string | null;
  accountNumber: string | null;
  bankCode: string | null;
  country: string;
  currency: string;
};

type PaymentAccountsResponse = {
  success: boolean;
  accounts: PaymentAccount[];
};

type EarningsResponse = {
  success: boolean;
  balance: {
    available: string;
    pending: string;
    paidOut: string;
    totalEarned: string;
    pendingWithdrawals: string;
  };
  earnings: Earning[];
};
type WithdrawalsResponse = {
  success: boolean;
  withdrawals: Withdrawal[];
};

export default function EarningsPage() {
  const [data, setData] = useState<EarningsResponse | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentAccountId, setPaymentAccountId] = useState("");

  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");

  async function loadEarnings() {
    try {
      setLoading(true);
      setError("");

      const [
        earningsResponse,
        withdrawalsResponse,
        paymentAccountsResponse,
      ] = await Promise.all([
        fetch("/api/worker/earnings"),
        fetch("/api/worker/withdrawals"),
        fetch("/api/worker/payment-accounts"),
      ]);

      const earningsJson = await earningsResponse.json();
      const withdrawalsJson = await withdrawalsResponse.json();
      const paymentAccountsJson =
        await paymentAccountsResponse.json();

      if (!earningsResponse.ok) {
        throw new Error(
          earningsJson.error || "Unable to load earnings."
        );
      }

      if (!withdrawalsResponse.ok) {
        throw new Error(
          withdrawalsJson.error || "Unable to load withdrawals."
        );
      }

      if (!paymentAccountsResponse.ok) {
        throw new Error(
          paymentAccountsJson.error ||
            "Unable to load payment accounts."
        );
      }

      setData(earningsJson as EarningsResponse);

      setWithdrawals(
        (withdrawalsJson as WithdrawalsResponse).withdrawals || []
      );

      const accounts =
        (paymentAccountsJson as PaymentAccountsResponse).accounts || [];

      setPaymentAccounts(accounts);

      const defaultAccount =
        accounts.find(
          (account) => account.status === "ACTIVE" && account.isDefault
        ) ||
        accounts.find(
          (account) => account.status === "ACTIVE"
        );

      setPaymentAccountId((current) =>
        current ||
        defaultAccount?.id ||
        ""
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load earnings."
      );
    } finally {
      setLoading(false);
    }
  }

useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadEarnings();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const balance = data?.balance ?? {
    available: "0.00",
    pending: "0.00",
    paidOut: "0.00",
    totalEarned: "0.00",
  };

  const earnings = data?.earnings ?? [];

  const withdrawableBalance = Number(balance.available);

  async function requestWithdrawal() {
    setWithdrawError("");
    setWithdrawSuccess("");

    const amount = Number(withdrawAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setWithdrawError("Enter a valid withdrawal amount.");
      return;
    }

    if (amount < 10) {
      setWithdrawError(
        "The minimum withdrawal amount is $10.00."
      );
      return;
    }

    if (!paymentAccountId) {
      setWithdrawError(
        "Please select a payment account before withdrawing."
      );
      return;
    }

    const selectedAccount = paymentAccounts.find(
      (account) => account.id === paymentAccountId
    );

    if (!selectedAccount || selectedAccount.status !== "ACTIVE") {
      setWithdrawError(
        "The selected payment account is unavailable."
      );
      return;
    }

    if (amount > withdrawableBalance) {
      setWithdrawError(
        "The withdrawal amount exceeds your available balance."
      );
      return;
    }

    try {
      setWithdrawLoading(true);

      const response = await fetch("/api/worker/withdrawals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          paymentAccountId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to submit withdrawal."
        );
      }

      setWithdrawSuccess(
        "Withdrawal request submitted successfully."
      );

      setWithdrawAmount("");

      await loadEarnings();

      setTimeout(() => {
        setShowWithdraw(false);
        setWithdrawSuccess("");
      }, 1200);
    } catch (err) {
      setWithdrawError(
        err instanceof Error
          ? err.message
          : "Unable to submit withdrawal."
      );
    } finally {
      setWithdrawLoading(false);
    }
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  }

  function statusLabel(status: Earning["status"]) {
    switch (status) {
      case "AVAILABLE":
        return "Available";
      case "PENDING":
        return "Pending";
      case "PAID":
        return "Paid";
      case "REVERSED":
        return "Reversed";
    }
  }

  function statusClass(status: Earning["status"]) {
    switch (status) {
      case "AVAILABLE":
        return "text-green-400";
      case "PENDING":
        return "text-yellow-400";
      case "PAID":
        return "text-cyan-400";
      case "REVERSED":
        return "text-red-400";
    }
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-wide text-cyan-400">
              WORKSPACE
            </p>

            <h1 className="mt-2 text-4xl font-black md:text-5xl">
              Earnings
            </h1>

            <p className="mt-3 max-w-2xl text-gray-400">
              Track your task income, pending rewards and payment history.
            </p>
          </div>

          <button
            onClick={() => {
              setWithdrawError("");
              setWithdrawSuccess("");
              setShowWithdraw(true);
            }}
            disabled={withdrawableBalance < 1}
            className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-[#06101d] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Withdraw Funds →
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-gray-500">
            Loading your earnings...
          </div>
        ) : (
          <>
            {/* BALANCE HERO */}
            <section className="relative mt-10 overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-8 md:p-10">
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="relative grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <p className="text-sm text-gray-400">
                    Available balance
                  </p>

                  <div className="mt-2 flex items-end gap-3">
                    <h2 className="text-5xl font-black md:text-6xl">
                      ${balance.available}
                    </h2>

                    <span className="mb-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs font-semibold text-green-400">
                      Available
                    </span>
                  </div>

                  <p className="mt-4 max-w-lg text-gray-500">
                    Funds become available after your submitted work is
                    approved by the review team.
                  </p>
                </div>

                <div className="lg:border-l lg:border-white/10 lg:pl-8">
                  <p className="text-sm text-gray-500">
                    Pending earnings
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    ${balance.pending}
                  </p>

                  <p className="mt-2 text-sm text-yellow-400">
                    Awaiting review
                  </p>
                </div>
              </div>
            </section>

            {/* STAT CARDS */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Earned"
                value={`$${balance.totalEarned}`}
                subtitle="All time"
                icon="$"
              />

              <StatCard
                title="This Month"
                value={`$${balance.totalEarned}`}
                subtitle="Current earnings"
                icon="↗"
              />

              <StatCard
                title="Pending"
                value={`$${balance.pending}`}
                subtitle="Awaiting approval"
                icon="◐"
              />

              <StatCard
                title="Paid Out"
                value={`$${balance.paidOut}`}
                subtitle="Completed payments"
                icon="✓"
              />
            </div>

            {/* WITHDRAWAL HISTORY */}
            {withdrawals.length > 0 && (
              <section className="mt-10">
                <div className="mb-5">
                  <h2 className="text-2xl font-bold">
                    Withdrawal history
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Track your requested and completed withdrawals.
                  </p>
                </div>

                <div className="space-y-3">
                  {withdrawals.map((withdrawal) => (
                    <div
                      key={withdrawal.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-400/10 font-bold text-purple-400">
                          $
                        </div>

                        <div className="flex-1">
                          <p className="font-semibold">
                            Withdrawal request
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {withdrawal.paymentMethod || "Payment method"}{" "}
                            · {formatDate(withdrawal.requestedAt)}
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-lg font-bold">
                            ${withdrawal.amount}
                          </p>

                          <p
                            className={`text-xs ${
                              withdrawal.status === "PAID"
                                ? "text-green-400"
                                : withdrawal.status === "FAILED"
                                  ? "text-red-400"
                                  : "text-yellow-400"
                            }`}
                          >
                            {withdrawal.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* EARNINGS HISTORY */}
            <section className="mt-10">
              <div className="mb-5">
                <h2 className="text-2xl font-bold">
                  Earnings history
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Payments generated from completed tasks.
                </p>
              </div>

              {earnings.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
                  <p className="text-lg font-semibold">
                    No earnings yet
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Complete and pass your first task review to start earning.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {earnings.map((earning) => (
                    <div
                      key={earning.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.05]"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 font-bold text-cyan-400">
                          $
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {earning.task.title}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {earning.project.title}
                          </p>

                          <p className="mt-1 text-xs text-gray-600">
                            {earning.task.category}
                          </p>
                        </div>

                        <div className="text-sm text-gray-500">
                          {formatDate(earning.createdAt)}
                        </div>

                        <div className="lg:w-32">
                          <p className="text-lg font-bold">
                            ${earning.amount}
                          </p>

                          <span
                            className={`text-xs ${statusClass(
                              earning.status
                            )}`}
                          >
                            {statusLabel(earning.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* WITHDRAW MODAL */}
      {showWithdraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b1728] p-7 shadow-2xl">

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-cyan-400">
                  PAYMENTS
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Withdraw funds
                </h2>
              </div>

              <button
                onClick={() => setShowWithdraw(false)}
                className="text-xl text-gray-500 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-gray-500">
                Withdrawable balance
              </p>

              <p className="mt-1 text-3xl font-bold">
                ${withdrawableBalance.toFixed(2)}
              </p>
            </div>

            {withdrawError && (
              <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">
                {withdrawError}
              </div>
            )}

            {withdrawSuccess && (
              <div className="mt-4 rounded-xl border border-green-400/20 bg-green-400/10 p-3 text-sm text-green-300">
                {withdrawSuccess}
              </div>
            )}

            <label className="mt-6 block">
              <span className="text-sm text-gray-400">
                Payment account
              </span>

              {paymentAccounts.length === 0 ? (
                <div className="mt-2 rounded-xl border border-yellow-400/20 bg-yellow-400/10 p-4 text-sm text-yellow-300">
                  No payment account is available. Please add a
                  payment account in Settings before requesting a
                  withdrawal.
                </div>
              ) : (
                <select
                  value={paymentAccountId}
                  onChange={(e) =>
                    setPaymentAccountId(e.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#101d30] px-4 py-3 text-white outline-none focus:border-cyan-400/40"
                >
                  <option value="">
                    Select payment account
                  </option>

                  {paymentAccounts
                    .filter(
                      (account) => account.status === "ACTIVE"
                    )
                    .map((account) => (
                      <option
                        key={account.id}
                        value={account.id}
                      >
                        {account.type === "MPESA"
                          ? `M-Pesa • ${account.phoneNumber ?? ""}`
                          : `Bank • ${account.bankName ?? ""} • ${account.accountNumber ?? ""}`}
                        {account.isDefault ? " (Default)" : ""}
                      </option>
                    ))}
                </select>
              )}
            </label>

            <label className="mt-5 block">
              <span className="text-sm text-gray-400">
                Withdrawal amount
              </span>

              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>

                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-9 pr-4 outline-none focus:border-cyan-400/40"
                />
              </div>
            </label>

            <p className="mt-3 text-xs text-gray-600">
              Minimum withdrawal: $10.00
            </p>

            <div className="mt-7 flex gap-3">
              <button
                onClick={() => setShowWithdraw(false)}
                disabled={withdrawLoading}
                className="flex-1 rounded-xl border border-white/10 px-5 py-3 text-gray-400 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
              >
                Cancel
              </button>

              <button
                onClick={requestWithdrawal}
                disabled={withdrawLoading}
                className="flex-1 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-[#06101d] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {withdrawLoading
                  ? "Submitting..."
                  : "Request Withdrawal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {title}
        </p>

        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold">
        {value}
      </p>

      <p className="mt-2 text-xs text-gray-600">
        {subtitle}
      </p>
    </div>
  );
}
