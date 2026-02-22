import { format, formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

export function formatDate(date, pattern = 'dd. MMM yyyy') {
  return format(new Date(date), pattern, { locale: de });
}

export function formatRelative(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: de });
}

export function formatNumber(n) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatCurrency(amount, currency = 'EUR') {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency }).format(amount);
}

export function formatPercent(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}
