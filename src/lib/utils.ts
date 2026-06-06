import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function parseAnyDate(date: string | Date) {
  if (date instanceof Date) return date;
  if (typeof date === 'string' && date.includes('/')) {
    const parts = date.split(' ')[0].split('/');
    if (parts.length === 3) {
      // Assuming DD/MM/YYYY
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
  }
  return new Date(date);
}

export function formatDate(date: string | Date) {
  if (!date) return '';
  const d = parseAnyDate(date);
  if (isNaN(d.getTime())) return '';
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateTime(date: string | Date) {
  if (!date) return '';
  const d = parseAnyDate(date);
  if (isNaN(d.getTime())) return '';
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
