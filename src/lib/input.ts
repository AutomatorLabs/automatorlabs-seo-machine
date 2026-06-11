export function parseCalculatorNumber(value: FormDataEntryValue | null): number {
  if (value === null) {
    return Number.NaN;
  }

  const normalized = String(value)
    .trim()
    .replace(/[$,\s]/g, '');

  if (normalized === '') {
    return Number.NaN;
  }

  return Number(normalized);
}

export function parseOptionalCalculatorNumber(
  value: FormDataEntryValue | null,
): number | null {
  if (value === null || String(value).trim() === '') {
    return null;
  }

  return parseCalculatorNumber(value);
}
