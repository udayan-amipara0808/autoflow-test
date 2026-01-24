export const formatAddress = (address) => {
  if (!address) return '';
  return address.substring(0, 6) + '...' + address.substring(address.length - 4);
};

export const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return diffInSeconds + "s ago";
  if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + "m ago";
  if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + "h ago";
  return Math.floor(diffInSeconds / 86400) + "d ago";
};

export const formatHash = (hash) => {
  if (!hash) return '';
  return hash.substring(0, 8) + '...';
};

export const formatPercentage = (value) => {
  return Number(value).toFixed(1) + '%';
};
