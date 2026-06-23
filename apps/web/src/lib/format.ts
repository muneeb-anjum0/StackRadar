export function compactNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "N/A";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function salary(min?: number | null, max?: number | null, currency?: string | null): string {
  if (!min || !max) return "Not disclosed";
  const prefix = currency ? `${currency} ` : "";
  return `${prefix}${compactNumber(min)} - ${compactNumber(max)}`;
}
