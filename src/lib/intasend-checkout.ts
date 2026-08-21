const INTASEND_BASE_URL =
  process.env.INTASEND_BASE_URL || "https://api.intasend.com";

const INTASEND_PUBLISHABLE_KEY =
  process.env.INTASEND_PUBLISHABLE_KEY;

type CheckoutInput = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  amountKES: number;
  apiRef: string;
  host: string;
  redirectUrl: string;
};

type CheckoutResponse = {
  url?: string;
  invoice_id?: string;
  [key: string]: unknown;
};

export async function createIntaSendCheckout(
  input: CheckoutInput
): Promise<CheckoutResponse> {
  if (!INTASEND_PUBLISHABLE_KEY) {
    throw new Error(
      "INTASEND_PUBLISHABLE_KEY is not configured."
    );
  }

  if (
    !Number.isFinite(input.amountKES) ||
    input.amountKES <= 0
  ) {
    throw new Error("Invalid checkout amount.");
  }

  const response = await fetch(
    `${INTASEND_BASE_URL}/api/v1/checkout/`,
    {
      method: "POST",
      headers: {
        "X-IntaSend-Public-API-Key":
          INTASEND_PUBLISHABLE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email,
        phone_number: input.phoneNumber,
        country: "KE",

        // IntaSend collection is made in KES.
        amount: input.amountKES.toFixed(2),
        currency: "KES",

        api_ref: input.apiRef,
        method: "M-PESA",
        channel: "WEBSITE",
        host: input.host,
        redirect_url: input.redirectUrl,
        mobile_tarrif: "BUSINESS-PAYS",
        card_tarrif: "BUSINESS-PAYS",
      }),
      cache: "no-store",
    }
  );

  const text = await response.text();

  let data: unknown;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    console.error("IntaSend checkout error:", {
      status: response.status,
      data,
    });

    throw new Error(
      `IntaSend checkout failed with status ${response.status}`
    );
  }

  return data as CheckoutResponse;
}
