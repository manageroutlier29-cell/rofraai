const USD_TO_KES_RATE = Number(
  process.env.USD_TO_KES_RATE
);

if (
  !Number.isFinite(USD_TO_KES_RATE) ||
  USD_TO_KES_RATE <= 0
) {
  console.warn(
    "USD_TO_KES_RATE is not configured correctly."
  );
}

export function getUsdToKesRate(): number {
  if (
    !Number.isFinite(USD_TO_KES_RATE) ||
    USD_TO_KES_RATE <= 0
  ) {
    throw new Error(
      "USD_TO_KES_RATE is not configured."
    );
  }

  return USD_TO_KES_RATE;
}

export function calculateKesPayout(
  usdAmount: number
) {
  const rate = getUsdToKesRate();

  if (
    !Number.isFinite(usdAmount) ||
    usdAmount <= 0
  ) {
    throw new Error("Invalid USD payout amount.");
  }

  const kesAmount =
    Math.round(usdAmount * rate * 100) / 100;

  return {
    exchangeRate: rate,
    payoutAmount: kesAmount,
    payoutCurrency: "KES",
    payoutCurrencyCode: "KES",
  };
}
