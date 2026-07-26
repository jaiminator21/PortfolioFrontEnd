/**
 * Date helpers for CV-style content.
 *
 * Everything derives from the stored dates rather than from pre-formatted
 * strings, so "5+ years" and "Present" can never drift out of date.
 */

/** Whole years since `startDate`, floored. */
export function yearsSince(startDate: string | null | undefined): number | null {
  if (!startDate) return null;
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return null;

  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  const monthDelta = now.getMonth() - start.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < start.getDate())) {
    years -= 1;
  }
  return Math.max(0, years);
}

/** "mar 2025" — month and year in the active locale. */
export function formatMonthYear(date: string | null | undefined, locale: string): string {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(parsed);
}

/**
 * "ene 2022 – Presente". `presentLabel` comes from the UI translations so the
 * word matches the active language.
 */
export function formatPeriod(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  locale: string,
  presentLabel: string
): string {
  const start = formatMonthYear(startDate, locale);
  const end = endDate ? formatMonthYear(endDate, locale) : presentLabel;
  if (!start) return end;
  return `${start} – ${end}`;
}

/** A role with no end date is the current one. */
export function isCurrent(endDate: string | null | undefined): boolean {
  return !endDate;
}

/** True when an expiry date exists and has passed. */
export function isExpired(expiryDate: string | null | undefined): boolean {
  if (!expiryDate) return false;
  const parsed = new Date(expiryDate);
  return !Number.isNaN(parsed.getTime()) && parsed.getTime() < Date.now();
}
