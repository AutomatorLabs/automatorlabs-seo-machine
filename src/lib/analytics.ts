type Gtag = (
  command: 'event',
  eventName: string,
  parameters: { calculator: string },
) => void;

export function trackSuccessfulCalculation(
  calculator: string,
  calculation: () => boolean,
): void {
  if (!calculation()) {
    return;
  }

  const gtag = (window as Window & { gtag?: Gtag }).gtag;

  if (typeof gtag !== 'function') {
    return;
  }

  try {
    gtag('event', 'calculate', { calculator });
  } catch {
    // Analytics must never interrupt calculator behavior.
  }
}
