const INTASEND_BASE_URL =
  process.env.INTASEND_BASE_URL || "https://api.intasend.com";

const INTASEND_API_KEY = process.env.INTASEND_API_KEY;

if (!INTASEND_API_KEY) {
  console.warn("INTASEND_API_KEY is not configured.");
}

type IntaSendRequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
};

export async function intasendRequest<T>(
  path: string,
  options: IntaSendRequestOptions = {}
): Promise<T> {
  if (!INTASEND_API_KEY) {
    throw new Error("INTASEND_API_KEY is not configured.");
  }

  const response = await fetch(
    `${INTASEND_BASE_URL}${path}`,
    {
      method: options.method || "GET",
      headers: {
        Authorization: `Bearer ${INTASEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body:
        options.body !== undefined
          ? JSON.stringify(options.body)
          : undefined,
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
    console.error("IntaSend API error:", {
      status: response.status,
      data,
    });

    throw new Error(
      `IntaSend request failed with status ${response.status}`
    );
  }

  return data as T;
}
