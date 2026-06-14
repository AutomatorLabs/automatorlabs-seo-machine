type Gtag = (
  command: 'event',
  eventName: string,
  parameters: { calculator: string },
) => void;

function updateCalculatorUrl(): void {
  const form = document.querySelector<HTMLFormElement>('#calculator-form');
  if (!form) {
    return;
  }

  const params = new URLSearchParams();

  for (const field of Array.from(form.elements)) {
    if (
      !(
        field instanceof HTMLInputElement ||
        field instanceof HTMLSelectElement ||
        field instanceof HTMLTextAreaElement
      ) ||
      !field.name ||
      field.disabled
    ) {
      continue;
    }

    const value = field.value.trim();
    if (value) {
      params.set(field.name, value);
    }
  }

  const url = new URL(window.location.href);
  url.search = params.toString();
  window.history.replaceState({}, '', url);
}

export function trackSuccessfulCalculation(
  calculator: string,
  calculation: () => boolean,
): void {
  if (!calculation()) {
    return;
  }

  updateCalculatorUrl();
  window.dispatchEvent(new CustomEvent('calculator:success'));

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
