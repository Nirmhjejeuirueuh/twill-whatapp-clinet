// Client-safe utility functions (no Twilio SDK dependency)

export function formatPhoneNumber(phoneNumber: string): string {
  // Remove whatsapp: prefix if present
  const cleaned = phoneNumber.replace('whatsapp:', '');
  // Format for display
  if (cleaned.length > 10) {
    return `+${cleaned.slice(0, -10)} ${cleaned.slice(-10, -7)} ${cleaned.slice(-7, -4)} ${cleaned.slice(-4)}`;
  }
  return cleaned;
}

export function getInitials(phoneNumber: string): string {
  const cleaned = phoneNumber.replace('whatsapp:', '').replace('+', '');
  return cleaned.slice(-2).toUpperCase();
}

export function getAvatarColor(phoneNumber: string): string {
  const colors = [
    'bg-emerald-600',
    'bg-blue-600',
    'bg-purple-600',
    'bg-pink-600',
    'bg-orange-600',
    'bg-teal-600',
    'bg-indigo-600',
    'bg-rose-600',
  ];
  const hash = phoneNumber.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}
