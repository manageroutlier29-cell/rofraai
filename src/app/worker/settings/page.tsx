"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskNotifications, setTaskNotifications] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [saved, setSaved] = useState(false);

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
