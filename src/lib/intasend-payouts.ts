import { intasendRequest } from "@/lib/intasend";

type MpesaPayoutInput = {
  name: string;
  phoneNumber: string;
  amountKES: number;
  narrative: string;
  callbackUrl?: string;
  deviceId?: string;
  requiresApproval?: "YES" | "NO";
};

export async function initiateMpesaPayout(
  input: MpesaPayoutInput
) {
  const phone = input.phoneNumber
    .replace(/\s+/g, "")
    .replace(/^\+/, "");

  if (!/^254\d{9}$/.test(phone)) {
    throw new Error(
      "Invalid Kenyan M-Pesa phone number. Expected format 254XXXXXXXXX."
    );
  }

  if (!Number.isFinite(input.amountKES) || input.amountKES <= 0) {
    throw new Error("Invalid M-Pesa payout amount.");
  }

  const transaction: Record<string, unknown> = {
    name: input.name,
    account: phone,
    amount: input.amountKES,
    narrative: input.narrative,
    country: "KE",
  };

  return intasendRequest<unknown>(
    "/api/v1/send-money/initiate/",
    {
      method: "POST",
      body: {
        currency: "KES",
        provider: "MPESA-B2C",
        ...(input.deviceId
          ? { device_id: input.deviceId }
          : {}),
        ...(input.callbackUrl
          ? { callback_url: input.callbackUrl }
          : {}),
        requires_approval:
          input.requiresApproval ?? "NO",
        transactions: [transaction],
      },
    }
  );
}
