const locale = 'en-US';

export const formatCurrency = (cents: number) =>
  new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(cents / 100);

export const formatDate = (d: Date | string) =>
  new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(d));

export const formatDateTime = (d: Date | string) =>
  new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(d));
