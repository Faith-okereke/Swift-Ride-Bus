export const generateRef =
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
 * Get today's date in YYYY-MM-DD format
 */
export const today = () => new Date().toISOString().split('T')[0];

