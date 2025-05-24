function formatPriceUSD(price, showSymbol = true) {
  if (price == null) return "";
  const number = typeof price === "number" ? price : Number(price);
  if (isNaN(number)) return "";

  return number.toLocaleString("en-US", {
    style: showSymbol ? "currency" : "decimal",
    currency: showSymbol ? "USD" : undefined,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default formatPriceUSD;
