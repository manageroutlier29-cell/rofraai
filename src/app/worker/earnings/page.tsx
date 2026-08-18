"use client";

import { useState } from "react";

type Transaction = {
  id: number;
  task: string;
  project: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending";
};

const transactions: Transaction[] = [
  {
    id: 1,
    task: "Financial Reasoning Review",
    project: "Finance AI Evaluation",
    date: "Aug 18, 2026",
    amount: "$24.00",
    status: "Paid",
  },
  {
    id: 2,
    task: "Data Quality Assessment",
    project: "Data Quality",
    date: "Aug 17, 2026",
    amount: "$12.75",
    status: "Paid",
  },
  {
    id: 3,
    task: "AI Response Evaluation",
    project: "General AI Quality",
    date: "Aug 18, 2026",
    amount: "$18.50",
    status: "Pending",
  },
  {
    id: 4,
    task: "Customer Support Classification",
    project: "Support AI Training",
    date: "Aug 15, 2026",
    amount: "$15.25",
    status: "Paid",
  },
  {
    id: 5,
    task: "Economic Forecast Evaluation",
    project: "Economic AI Research",
    date: "Aug 14, 2026",
    amount: "$31.00",
    status: "Paid",
  },
];

export default function EarningsPage() {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const paidTransactions = transactions.filter(
    (transaction) => transaction.status === "Paid"
  );

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === "Pending"
  );

  const requestWithdrawal = () => {
    if (!withdrawAmount) return;

    alert(
      `Withdrawal request of $${withdrawAmount} has been submitted for review.`
    );

    setWithdrawAmount("");
    setShowWithdraw(false);
  };

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

          <div>
            <p className="text-cyan-400 text-sm font-semibold tracking-wide">
              WORKSPACE
            </p>

            <h1 className="text-4xl md:text-5xl font-black mt-2">
              Earnings
            </h1>

            <p className="text-gray-400 mt-3 max-w-2xl">
              Track your task income, pending rewards and payment history.
            </p>
          </div>

          <button
            onClick={() => setShowWithdraw(true)}
            className="px-6 py-3 rounded-xl bg-cyan-400 text-[#06101d] font-bold hover:bg-cyan-300 transition"
          >
            Withdraw Funds →
          </button>

        </div>

        {/* BALANCE HERO */}
        <section className="relative overflow-hidden mt-10 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-8 md:p-10">

          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative grid lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2">

              <p className="text-gray-400 text-sm">
                Available balance
              </p>

              <div className="flex items-end gap-3 mt-2">

                <h2 className="text-5xl md:text-6xl font-black">
                  $36.75
                </h2>

                <span className="mb-2 px-3 py-1 rounded-full bg-green-400/10 border border-green-400/20 text-green-400 text-xs font-semibold">
                  Available
                </span>

              </div>

              <p className="text-gray-500 mt-4 max-w-lg">
                Your available balance can be withdrawn once you meet the
                platform's minimum withdrawal requirement.
              </p>

            </div>

            <div className="lg:border-l lg:border-white/10 lg:pl-8">

              <p className="text-gray-500 text-sm">
                Next payment
              </p>

              <p className="text-3xl font-bold mt-2">
                $18.50
              </p>

              <p className="text-yellow-400 text-sm mt-2">
                Pending review
              </p>

            </div>

          </div>

        </section>

        {/* STAT CARDS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

          <StatCard
            title="Total Earned"
            value="$101.50"
            subtitle="All time"
            icon="$"
          />

          <StatCard
            title="This Month"
            value="$101.50"
            subtitle="August 2026"
            icon="↗"
          />

          <StatCard
            title="Pending"
            value="$18.50"
            subtitle="Awaiting approval"
            icon="◐"
          />

          <StatCard
            title="Paid Out"
            value="$65.00"
            subtitle="Previous withdrawals"
            icon="✓"
          />

        </div>

        {/* EARNINGS OVERVIEW */}
        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h2 className="text-xl font-bold">
                Earnings overview
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Your earnings activity over the last 7 days
              </p>
            </div>

            <span className="text-cyan-400 text-sm font-semibold">
              August 2026
            </span>

          </div>

          <div className="mt-8 h-52 flex items-end gap-3 md:gap-6">

            {[
              ["Mon", 35],
              ["Tue", 52],
              ["Wed", 42],
              ["Thu", 68],
              ["Fri", 48],
              ["Sat", 82],
              ["Sun", 62],
            ].map(([day, height]) => (

              <div
                key={day}
                className="flex-1 h-full flex flex-col justify-end items-center gap-3"
              >

                <div
                  className="w-full max-w-12 rounded-t-xl bg-gradient-to-t from-cyan-500/30 to-cyan-400 transition hover:from-cyan-400/50 hover:to-cyan-300"
                  style={{ height: `${height}%` }}
                />

                <span className="text-xs text-gray-600">
                  {day}
                </span>

              </div>

            ))}

          </div>

        </section>

        {/* TRANSACTIONS */}
        <section className="mt-10">

          <div className="flex items-center justify-between mb-5">

            <div>
              <h2 className="text-2xl font-bold">
                Earnings history
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Payments generated from completed tasks
              </p>
            </div>

            <button className="text-cyan-400 text-sm font-semibold hover:text-cyan-300">
              View all
            </button>

          </div>

          <div className="space-y-3">

            {transactions.map((transaction) => (

              <div
                key={transaction.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.05] transition"
              >

                <div className="flex flex-col lg:flex-row lg:items-center gap-5">

                  <div className="w-11 h-11 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center font-bold">
                    $
                  </div>

                  <div className="flex-1">

                    <h3 className="font-semibold">
                      {transaction.task}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      {transaction.project}
                    </p>

                  </div>

                  <div className="text-sm text-gray-500">
                    {transaction.date}
                  </div>

                  <div className="lg:w-28">

                    <p className="text-lg font-bold">
                      {transaction.amount}
                    </p>

                    <span
                      className={`text-xs ${
                        transaction.status === "Paid"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {transaction.status}
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* PAYMENT INFO */}
        <section className="mt-10 grid md:grid-cols-2 gap-6">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

            <div className="w-11 h-11 rounded-xl bg-purple-400/10 text-purple-400 flex items-center justify-center">
              ◈
            </div>

            <h3 className="text-xl font-bold mt-5">
              Payment method
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              Choose where you want to receive your approved earnings.
            </p>

            <button className="mt-5 text-cyan-400 text-sm font-semibold hover:text-cyan-300">
              Manage payment method →
            </button>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

            <div className="w-11 h-11 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center">
              ?
            </div>

            <h3 className="text-xl font-bold mt-5">
              Need help?
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              Learn how task rewards, reviews and withdrawals work.
            </p>

            <button className="mt-5 text-cyan-400 text-sm font-semibold hover:text-cyan-300">
              Visit payment help →
            </button>

          </div>

        </section>

      </div>

      {/* WITHDRAW MODAL */}
      {showWithdraw && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">

          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b1728] p-7 shadow-2xl">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-cyan-400 text-sm font-semibold">
                  PAYMENTS
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  Withdraw funds
                </h2>
              </div>

              <button
                onClick={() => setShowWithdraw(false)}
                className="text-gray-500 hover:text-white text-xl"
              >
                ×
              </button>

            </div>

            <div className="mt-6 rounded-2xl bg-white/[0.04] border border-white/10 p-5">

              <p className="text-gray-500 text-sm">
                Available balance
              </p>

              <p className="text-3xl font-bold mt-1">
                $36.75
              </p>

            </div>

            <label className="block mt-6">

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
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-9 pr-4 outline-none focus:border-cyan-400/40"
                />

              </div>

            </label>

            <p className="text-xs text-gray-600 mt-3">
              Minimum withdrawal requirements will be applied when real
              payment processing is connected.
            </p>

            <div className="flex gap-3 mt-7">

              <button
                onClick={() => setShowWithdraw(false)}
                className="flex-1 px-5 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.05] transition"
              >
                Cancel
              </button>

              <button
                onClick={requestWithdrawal}
                className="flex-1 px-5 py-3 rounded-xl bg-cyan-400 text-[#06101d] font-bold hover:bg-cyan-300 transition"
              >
                Request Withdrawal
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

        <p className="text-gray-500 text-sm">
          {title}
        </p>

        <span className="w-9 h-9 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center">
          {icon}
        </span>

      </div>

      <p className="text-3xl font-bold mt-4">
        {value}
      </p>

      <p className="text-gray-600 text-xs mt-2">
        {subtitle}
      </p>

    </div>
  );
}
