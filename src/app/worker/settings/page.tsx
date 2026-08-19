"use client";

import { useCallback, useEffect, useState } from "react";

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
  provider?: string | null;
};

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskNotifications, setTaskNotifications] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [saved, setSaved] = useState(false);

  const [paymentAccounts, setPaymentAccounts] = useState<
    PaymentAccount[]
  >([]);

  const [paymentLoading, setPaymentLoading] = useState(true);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");

  const [showAddPayment, setShowAddPayment] = useState(false);
  const [paymentType, setPaymentType] = useState<
    "MPESA" | "BANK"
  >("MPESA");

  const [accountName, setAccountName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [makeDefault, setMakeDefault] = useState(true);

  const [paymentSaving, setPaymentSaving] = useState(false);

  const loadPaymentAccounts = useCallback(async () => {
    try {
      setPaymentLoading(true);
      setPaymentError("");

      const response = await fetch(
        "/api/worker/payment-accounts"
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to load payment accounts."
        );
      }

      setPaymentAccounts(result.accounts || []);
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Unable to load payment accounts."
      );
    } finally {
      setPaymentLoading(false);
    }
  }, []);

  // Load payment accounts once when the settings page mounts.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPaymentAccounts();
  }, [loadPaymentAccounts]);

  function resetPaymentForm() {
    setAccountName("");
    setPhoneNumber("");
    setBankName("");
    setAccountNumber("");
    setBankCode("");
    setMakeDefault(paymentAccounts.length === 0);
    setPaymentType("MPESA");
  }

  async function addPaymentAccount() {
    setPaymentError("");
    setPaymentSuccess("");

    if (paymentType === "MPESA" && !phoneNumber.trim()) {
      setPaymentError("Enter your M-Pesa phone number.");
      return;
    }

    if (paymentType === "BANK") {
      if (
        !accountName.trim() ||
        !bankName.trim() ||
        !accountNumber.trim()
      ) {
        setPaymentError(
          "Account name, bank name and account number are required."
        );
        return;
      }
    }

    try {
      setPaymentSaving(true);

      const response = await fetch(
        "/api/worker/payment-accounts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: paymentType,
            accountName:
              accountName.trim() || null,
            phoneNumber:
              paymentType === "MPESA"
                ? phoneNumber.trim()
                : null,
            bankName:
              paymentType === "BANK"
                ? bankName.trim()
                : null,
            accountNumber:
              paymentType === "BANK"
                ? accountNumber.trim()
                : null,
            bankCode:
              paymentType === "BANK"
                ? bankCode.trim() || null
                : null,
            isDefault: makeDefault,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to save payment account."
        );
      }

      setPaymentAccounts((current) => {
        const newAccount = result.account as PaymentAccount;

        if (newAccount.isDefault) {
          return [
            ...current.map((account) => ({
              ...account,
              isDefault: false,
            })),
            newAccount,
          ];
        }

        return [...current, newAccount];
      });

      setPaymentSuccess(
        "Payment account added successfully."
      );

      resetPaymentForm();
      setShowAddPayment(false);
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Unable to save payment account."
      );
    } finally {
      setPaymentSaving(false);
    }
  }

  function saveSettings() {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div>
          <p className="text-cyan-400 text-sm font-semibold tracking-wide">
            WORKSPACE
          </p>

          <h1 className="text-4xl md:text-5xl font-black mt-2">
            Settings
          </h1>

          <p className="text-gray-400 mt-3 max-w-2xl">
            Manage your ROFRAAI account, notifications, security and
            preferences.
          </p>
        </div>

        {/* SUCCESS MESSAGE */}
        {saved && (
          <div className="mt-6 rounded-2xl border border-green-400/20 bg-green-400/10 px-5 py-4 text-green-400">
            ✓ Your settings have been saved successfully.
          </div>
        )}

        {/* ACCOUNT */}
        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden">

          <div className="p-7 border-b border-white/10">
            <h2 className="text-xl font-bold">
              Account
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Manage your basic account information.
            </p>
          </div>

          <div className="p-7 space-y-6">

            <div>
              <label className="text-sm text-gray-400">
                Full name
              </label>

              <input
                type="text"
                defaultValue="ROFRAAI Worker"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-cyan-400/40"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">
                Email address
              </label>

              <input
                type="email"
                defaultValue="worker@example.com"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-cyan-400/40"
              />
            </div>

          </div>
        </section>

        {/* PAYMENT ACCOUNTS */}
        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden">

          <div className="p-7 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <h2 className="text-xl font-bold">
                Payment Accounts
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Manage where you receive your ROFRAAI earnings.
              </p>
            </div>

            <button
              onClick={() => {
                resetPaymentForm();
                setShowAddPayment(true);
                setPaymentError("");
                setPaymentSuccess("");
              }}
              className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-[#06101d] transition hover:bg-cyan-300"
            >
              + Add Payment Account
            </button>

          </div>

          <div className="p-7">

            {paymentError && (
              <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
                {paymentError}
              </div>
            )}

            {paymentSuccess && (
              <div className="mb-5 rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-300">
                {paymentSuccess}
              </div>
            )}

            {paymentLoading ? (
              <p className="text-sm text-gray-500">
                Loading payment accounts...
              </p>
            ) : paymentAccounts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">

                <div className="text-3xl">
                  💳
                </div>

                <p className="mt-3 font-semibold">
                  No payment accounts
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Add an M-Pesa or bank account to receive your
                  earnings.
                </p>

              </div>
            ) : (
              <div className="space-y-4">

                {paymentAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                  >

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                      <div>

                        <div className="flex items-center gap-3">

                          <p className="font-bold">
                            {account.type === "MPESA"
                              ? "M-Pesa"
                              : "Bank Account"}
                          </p>

                          {account.isDefault && (
                            <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold text-cyan-400">
                              Default
                            </span>
                          )}

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              account.status === "ACTIVE"
                                ? "bg-green-400/10 text-green-400"
                                : "bg-gray-400/10 text-gray-400"
                            }`}
                          >
                            {account.status}
                          </span>

                        </div>

                        {account.type === "MPESA" ? (
                          <p className="mt-2 text-sm text-gray-400">
                            {account.accountName || "M-Pesa"}{" "}
                            ·{" "}
                            {account.phoneNumber || "••••"}
                          </p>
                        ) : (
                          <p className="mt-2 text-sm text-gray-400">
                            {account.accountName} ·{" "}
                            {account.bankName} ·{" "}
                            {account.accountNumber}
                          </p>
                        )}

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>
        </section>

        {/* ADD PAYMENT ACCOUNT MODAL */}
        {showAddPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">

            <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0b1728] p-7 shadow-2xl">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-semibold text-cyan-400">
                    PAYMENTS
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Add payment account
                  </h2>
                </div>

                <button
                  onClick={() => setShowAddPayment(false)}
                  disabled={paymentSaving}
                  className="text-xl text-gray-500 hover:text-white disabled:opacity-40"
                >
                  ×
                </button>

              </div>

              {paymentError && (
                <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">
                  {paymentError}
                </div>
              )}

              <label className="mt-6 block">
                <span className="text-sm text-gray-400">
                  Account type
                </span>

                <select
                  value={paymentType}
                  onChange={(e) =>
                    setPaymentType(
                      e.target.value as "MPESA" | "BANK"
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#101d30] px-4 py-3 text-white outline-none focus:border-cyan-400/40"
                >
                  <option value="MPESA">
                    M-Pesa
                  </option>

                  <option value="BANK">
                    Bank Account
                  </option>
                </select>
              </label>

              {paymentType === "MPESA" ? (
                <>
                  <label className="mt-5 block">
                    <span className="text-sm text-gray-400">
                      M-Pesa phone number
                    </span>

                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(e.target.value)
                      }
                      placeholder="0712345678"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-cyan-400/40"
                    />
                  </label>

                  <label className="mt-5 block">
                    <span className="text-sm text-gray-400">
                      Account name
                    </span>

                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) =>
                        setAccountName(e.target.value)
                      }
                      placeholder="Optional"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-cyan-400/40"
                    />
                  </label>
                </>
              ) : (
                <>
                  <label className="mt-5 block">
                    <span className="text-sm text-gray-400">
                      Account name
                    </span>

                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) =>
                        setAccountName(e.target.value)
                      }
                      placeholder="Name on bank account"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-cyan-400/40"
                    />
                  </label>

                  <label className="mt-5 block">
                    <span className="text-sm text-gray-400">
                      Bank name
                    </span>

                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) =>
                        setBankName(e.target.value)
                      }
                      placeholder="Bank name"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-cyan-400/40"
                    />
                  </label>

                  <label className="mt-5 block">
                    <span className="text-sm text-gray-400">
                      Account number
                    </span>

                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) =>
                        setAccountNumber(e.target.value)
                      }
                      placeholder="Account number"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-cyan-400/40"
                    />
                  </label>

                  <label className="mt-5 block">
                    <span className="text-sm text-gray-400">
                      Bank code
                    </span>

                    <input
                      type="text"
                      value={bankCode}
                      onChange={(e) =>
                        setBankCode(e.target.value)
                      }
                      placeholder="Optional"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-cyan-400/40"
                    />
                  </label>
                </>
              )}

              <label className="mt-5 flex items-center gap-3 text-sm text-gray-400">
                <input
                  type="checkbox"
                  checked={makeDefault}
                  onChange={(e) =>
                    setMakeDefault(e.target.checked)
                  }
                  className="h-4 w-4 accent-cyan-400"
                />

                Make this my default payment account
              </label>

              <div className="mt-7 flex gap-3">

                <button
                  onClick={() => setShowAddPayment(false)}
                  disabled={paymentSaving}
                  className="flex-1 rounded-xl border border-white/10 px-5 py-3 text-gray-400 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  onClick={addPaymentAccount}
                  disabled={paymentSaving}
                  className="flex-1 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-[#06101d] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {paymentSaving
                    ? "Saving..."
                    : "Save Account"}
                </button>

              </div>

            </div>
          </div>
        )}

        {/* SECURITY */}
        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden">

          <div className="p-7 border-b border-white/10">
            <h2 className="text-xl font-bold">
              Security
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Protect your account and login information.
            </p>
          </div>

          <div className="divide-y divide-white/10">

            <SettingRow
              title="Two-factor authentication"
              description="Add an extra layer of protection to your account."
              enabled={twoFactor}
              onToggle={() => setTwoFactor(!twoFactor)}
            />

            <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>
                <p className="font-semibold">
                  Password
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Change your account password.
                </p>
              </div>

              <button className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/[0.06] transition text-sm font-semibold">
                Change Password
              </button>

            </div>

          </div>
        </section>

        {/* NOTIFICATIONS */}
        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden">

          <div className="p-7 border-b border-white/10">
            <h2 className="text-xl font-bold">
              Notifications
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Choose what notifications you want to receive.
            </p>
          </div>

          <div className="divide-y divide-white/10">

            <SettingRow
              title="Email notifications"
              description="Receive important account updates by email."
              enabled={emailNotifications}
              onToggle={() =>
                setEmailNotifications(!emailNotifications)
              }
            />

            <SettingRow
              title="New task notifications"
              description="Get notified when tasks matching your skills become available."
              enabled={taskNotifications}
              onToggle={() =>
                setTaskNotifications(!taskNotifications)
              }
            />

          </div>
        </section>

        {/* PRIVACY */}
        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden">

          <div className="p-7 border-b border-white/10">
            <h2 className="text-xl font-bold">
              Privacy
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Control how your profile appears to clients.
            </p>
          </div>

          <div className="p-6">

            <SettingRow
              title="Profile visibility"
              description="Allow clients to discover your profile when searching for workers."
              enabled={profileVisible}
              onToggle={() =>
                setProfileVisible(!profileVisible)
              }
            />

          </div>
        </section>

        {/* PREFERENCES */}
        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden">

          <div className="p-7 border-b border-white/10">
            <h2 className="text-xl font-bold">
              Preferences
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Customize your ROFRAAI experience.
            </p>
          </div>

          <div className="p-7 grid md:grid-cols-2 gap-6">

            <div>
              <label className="text-sm text-gray-400">
                Language
              </label>

              <select
                defaultValue="English"
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1728] px-4 py-3 outline-none focus:border-cyan-400/40"
              >
                <option>English</option>
                <option>French</option>
                <option>Spanish</option>
                <option>Portuguese</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400">
                Timezone
              </label>

              <select
                defaultValue="Africa/Nairobi"
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1728] px-4 py-3 outline-none focus:border-cyan-400/40"
              >
                <option>Africa/Nairobi</option>
                <option>America/New_York</option>
                <option>America/Chicago</option>
                <option>Europe/London</option>
                <option>Asia/Dubai</option>
              </select>
            </div>

          </div>
        </section>

        {/* SAVE */}
        <div className="mt-8 flex justify-end">

          <button
            onClick={saveSettings}
            className="px-7 py-3.5 rounded-xl bg-cyan-400 text-[#06101d] font-bold hover:bg-cyan-300 transition shadow-lg shadow-cyan-400/10"
          >
            Save Changes
          </button>

        </div>

        {/* DANGER ZONE */}
        <section className="mt-12 rounded-3xl border border-red-400/20 bg-red-400/[0.03] overflow-hidden">

          <div className="p-7 border-b border-red-400/10">

            <h2 className="text-xl font-bold text-red-400">
              Danger Zone
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              These actions can affect your ROFRAAI account permanently.
            </p>

          </div>

          <div className="p-7 space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

              <div>
                <p className="font-semibold">
                  Sign out
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Sign out of your ROFRAAI account on this device.
                </p>
              </div>

              <button className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/[0.06] transition text-sm font-semibold">
                Sign Out
              </button>

            </div>

            <div className="border-t border-red-400/10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

              <div>
                <p className="font-semibold text-red-400">
                  Delete account
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Permanently delete your ROFRAAI account and associated data.
                </p>
              </div>

              <button className="px-5 py-2.5 rounded-xl border border-red-400/30 text-red-400 hover:bg-red-400/10 transition text-sm font-semibold">
                Delete Account
              </button>

            </div>

          </div>
        </section>

        {/* FOOTER */}
        <div className="text-center py-10 text-gray-600 text-sm">
          ROFRAAI Account Settings
        </div>

      </div>
    </main>
  );
}

function SettingRow({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="p-6 flex items-center justify-between gap-6">

      <div>
        <p className="font-semibold">
          {title}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          {description}
        </p>
      </div>

      <button
        onClick={onToggle}
        aria-label={`Toggle ${title}`}
        className={`relative shrink-0 w-12 h-7 rounded-full transition ${
          enabled
            ? "bg-cyan-400"
            : "bg-white/10 border border-white/10"
        }`}
      >
        <span
          className={`absolute top-1 w-5 h-5 rounded-full transition ${
            enabled
              ? "right-1 bg-[#06101d]"
              : "left-1 bg-gray-500"
          }`}
        />
      </button>

    </div>
  );
}