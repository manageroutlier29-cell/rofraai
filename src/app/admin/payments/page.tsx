"use client";

import { useEffect, useMemo, useState } from "react";

type WithdrawalStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "CANCELLED";

type Withdrawal = {
  id: string;
  amount: string;
  status: WithdrawalStatus;
  paymentMethod: string | null;
  paymentReference: string | null;
  failureReason: string | null;
  requestedAt: string;
  processedAt: string | null;
  createdAt: string;
  worker: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

type WithdrawalsResponse = {
  success: boolean;
  withdrawals: Withdrawal[];
};

export default function AdminPayments() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState<Withdrawal | null>(null);
  const [actionStatus, setActionStatus] =
    useState<WithdrawalStatus | null>(null);

  const [paymentReference, setPaymentReference] = useState("");
  const [failureReason, setFailureReason] = useState("");

  const [processing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  async function loadWithdrawals() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/withdrawals");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load withdrawals."
        );
      }

      setWithdrawals(
        (data as WithdrawalsResponse).withdrawals || []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load withdrawals."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  let cancelled = false;

  async function load() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/withdrawals");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load withdrawals."
        );
      }

      if (!cancelled) {
        setWithdrawals(
          (data as WithdrawalsResponse).withdrawals || []
        );
      }
    } catch (err) {
      if (!cancelled) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load withdrawals."
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  load();

  return () => {
    cancelled = true;
  };
}, []);

  const stats = useMemo(() => {
    return {
      pending: withdrawals.filter(
        (w) => w.status === "PENDING"
      ).length,

      processing: withdrawals.filter(
        (w) => w.status === "PROCESSING"
      ).length,

      paid: withdrawals.filter(
        (w) => w.status === "PAID"
      ).length,

      totalPaid: withdrawals
        .filter((w) => w.status === "PAID")
        .reduce(
          (total, w) => total + Number(w.amount),
          0
        ),
    };
  }, [withdrawals]);

  function openAction(
    withdrawal: Withdrawal,
    status: WithdrawalStatus
  ) {
    setSelected(withdrawal);
    setActionStatus(status);
    setPaymentReference(
      withdrawal.paymentReference || ""
    );
    setFailureReason(
      withdrawal.failureReason || ""
    );
    setActionError("");
    setActionSuccess("");
  }

  function closeAction() {
    if (processing) return;

    setSelected(null);
    setActionStatus(null);
    setPaymentReference("");
    setFailureReason("");
    setActionError("");
    setActionSuccess("");
  }

  async function submitAction() {
    if (!selected || !actionStatus) return;

    setActionError("");
    setActionSuccess("");

    if (
      actionStatus === "PAID" &&
      !paymentReference.trim()
    ) {
      setActionError(
        "Enter the payment reference before marking the withdrawal as paid."
      );
      return;
    }

    if (
      actionStatus === "FAILED" &&
      !failureReason.trim()
    ) {
      setActionError(
        "Enter a failure reason."
      );
      return;
    }

    try {
      setProcessing(true);

      const response = await fetch(
        `/api/admin/withdrawals/${selected.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: actionStatus,
            paymentReference:
              paymentReference.trim() || null,
            failureReason:
              failureReason.trim() || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to process withdrawal."
        );
      }

      setActionSuccess(
        `Withdrawal marked as ${actionStatus}.`
      );

      await loadWithdrawals();

      setTimeout(() => {
        closeAction();
      }, 900);
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Unable to process withdrawal."
      );
    } finally {
      setProcessing(false);
    }
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  }

  function statusClass(status: WithdrawalStatus) {
    switch (status) {
      case "PENDING":
        return "bg-yellow-400/10 text-yellow-400";

      case "PROCESSING":
        return "bg-blue-400/10 text-blue-400";

      case "PAID":
        return "bg-green-400/10 text-green-400";

      case "FAILED":
        return "bg-red-400/10 text-red-400";

      case "CANCELLED":
        return "bg-gray-400/10 text-gray-400";
    }
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">

        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Finance
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Payments
            </h1>

            <p className="mt-2 text-gray-400">
              Review and process worker withdrawal requests.
            </p>
          </div>

          <button
            onClick={loadWithdrawals}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/[0.05] hover:text-white"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-red-300">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Stat
            label="Pending"
            value={stats.pending.toString()}
          />

          <Stat
            label="Processing"
            value={stats.processing.toString()}
          />

          <Stat
            label="Paid"
            value={stats.paid.toString()}
          />

          <Stat
            label="Total Paid"
            value={`$${stats.totalPaid.toFixed(2)}`}
          />

        </div>

        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">

          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-xl font-bold">
              Withdrawal requests
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Process worker payment requests from oldest to newest.
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Loading payments...
            </div>
          ) : withdrawals.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-lg font-semibold">
                No withdrawal requests
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Worker payment requests will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">

              {withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="p-6 transition hover:bg-white/[0.02]"
                >

                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center">

                    <div className="flex-1">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-400/10 font-bold text-cyan-400">
                          {withdrawal.worker.firstName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold">
                            {withdrawal.worker.firstName}{" "}
                            {withdrawal.worker.lastName}
                          </p>

                          <p className="text-sm text-gray-500">
                            {withdrawal.worker.email}
                          </p>
                        </div>

                      </div>

                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Amount
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        ${withdrawal.amount}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Method
                      </p>

                      <p className="mt-1 font-medium">
                        {withdrawal.paymentMethod ||
                          "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Requested
                      </p>

                      <p className="mt-1 text-sm text-gray-300">
                        {formatDate(
                          withdrawal.requestedAt
                        )}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                          withdrawal.status
                        )}`}
                      >
                        {withdrawal.status}
                      </span>
                    </div>

                    <div className="flex gap-2">

                      {withdrawal.status === "PENDING" && (
                        <>
                          <button
                            onClick={() =>
                              openAction(
                                withdrawal,
                                "PROCESSING"
                              )
                            }
                            className="rounded-lg bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-400 hover:bg-blue-400/20"
                          >
                            Process
                          </button>

                          <button
                            onClick={() =>
                              openAction(
                                withdrawal,
                                "CANCELLED"
                              )
                            }
                            className="rounded-lg bg-gray-400/10 px-4 py-2 text-sm font-semibold text-gray-400 hover:bg-gray-400/20"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {withdrawal.status === "PROCESSING" && (
                        <>
                          <button
                            onClick={() =>
                              openAction(
                                withdrawal,
                                "PAID"
                              )
                            }
                            className="rounded-lg bg-green-400/10 px-4 py-2 text-sm font-semibold text-green-400 hover:bg-green-400/20"
                          >
                            Mark Paid
                          </button>

                          <button
                            onClick={() =>
                              openAction(
                                withdrawal,
                                "FAILED"
                              )
                            }
                            className="rounded-lg bg-red-400/10 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-400/20"
                          >
                            Failed
                          </button>
                        </>
                      )}

                    </div>

                  </div>

                  {(withdrawal.paymentReference ||
                    withdrawal.failureReason) && (
                    <div className="mt-5 rounded-xl border border-white/10 bg-black/10 p-4 text-sm">

                      {withdrawal.paymentReference && (
                        <p className="text-gray-400">
                          Payment reference:{" "}
                          <span className="text-white">
                            {withdrawal.paymentReference}
                          </span>
                        </p>
                      )}

                      {withdrawal.failureReason && (
                        <p className="mt-2 text-gray-400">
                          Failure reason:{" "}
                          <span className="text-red-300">
                            {withdrawal.failureReason}
                          </span>
                        </p>
                      )}

                    </div>
                  )}

                </div>
              ))}

            </div>
          )}

        </section>

      </div>

      {selected && actionStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0b1728] p-7 shadow-2xl">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
                  Payment action
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {actionStatus === "PROCESSING"
                    ? "Process withdrawal"
                    : actionStatus === "PAID"
                      ? "Confirm payment"
                      : actionStatus === "FAILED"
                        ? "Mark payment failed"
                        : "Cancel withdrawal"}
                </h2>
              </div>

              <button
                onClick={closeAction}
                disabled={processing}
                className="text-2xl text-gray-500 hover:text-white"
              >
                ×
              </button>

            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">

              <p className="text-sm text-gray-500">
                Worker
              </p>

              <p className="mt-1 font-semibold">
                {selected.worker.firstName}{" "}
                {selected.worker.lastName}
              </p>

              <p className="mt-3 text-sm text-gray-500">
                Withdrawal amount
              </p>

              <p className="mt-1 text-3xl font-black">
                ${selected.amount}
              </p>

            </div>

            {actionError && (
              <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">
                {actionError}
              </div>
            )}

            {actionSuccess && (
              <div className="mt-4 rounded-xl border border-green-400/20 bg-green-400/10 p-3 text-sm text-green-300">
                {actionSuccess}
              </div>
            )}

            {actionStatus === "PAID" && (
              <label className="mt-5 block">
                <span className="text-sm text-gray-400">
                  Payment reference
                </span>

                <input
                  value={paymentReference}
                  onChange={(e) =>
                    setPaymentReference(
                      e.target.value
                    )
                  }
                  placeholder="e.g. MPESA123456"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-cyan-400/40"
                />
              </label>
            )}

            {actionStatus === "FAILED" && (
              <label className="mt-5 block">
                <span className="text-sm text-gray-400">
                  Failure reason
                </span>

                <textarea
                  value={failureReason}
                  onChange={(e) =>
                    setFailureReason(e.target.value)
                  }
                  placeholder="Explain why the payment failed..."
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-cyan-400/40"
                />
              </label>
            )}

            <div className="mt-7 flex gap-3">

              <button
                onClick={closeAction}
                disabled={processing}
                className="flex-1 rounded-xl border border-white/10 px-5 py-3 text-gray-400 hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
              >
                Cancel
              </button>

              <button
                onClick={submitAction}
                disabled={processing}
                className="flex-1 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-[#06101d] hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {processing
                  ? "Processing..."
                  : actionStatus === "PAID"
                    ? "Confirm Payment"
                    : `Mark ${actionStatus}`}
              </button>

            </div>

          </div>

        </div>
      )}
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black">
        {value}
      </p>
    </div>
  );
}
