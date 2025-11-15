export const timeAgo = (iso?: string) => {
  if (!iso) return '';

  const timestamp = new Date(iso).getTime();
  const now = Date.now();

  if (isNaN(timestamp)) return '';
  if (timestamp > now) return 'just now';

  const diff = now - timestamp;

  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m`;
  if (hrs < 24) return `${hrs}h`;

  return `${days}d`;
};

