export function rupiahFormatter(price) {
  const betterPriceFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  });

  return betterPriceFormatter.format(price);
}
