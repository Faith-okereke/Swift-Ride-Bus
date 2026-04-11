export const generateRef = () =>
  'BK-' + Date.now().toString().slice(-8).toUpperCase();

/**
 * Format a date string to readable format
 */
export const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Format date short
 */
export const formatDateShort = (dateStr: string) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Calculate service fee (2%)
 */
export const calcFee = (base:number) => Math.round(base * 0.02);

/**
 * Get today's date in YYYY-MM-DD format
 */
export const today = () => new Date().toISOString().split('T')[0];

/**
 * Format credit card number with spaces
 */
export const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').substring(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

/**
 * Format expiry MM/YY
 */
export const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length >= 2) return digits.substring(0, 2) + '/' + digits.substring(2, 4);
  return digits;
};
