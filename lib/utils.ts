import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string, locale: string = 'it-IT'): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr + '-01')
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'long' })
  } catch {
    return dateStr
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
