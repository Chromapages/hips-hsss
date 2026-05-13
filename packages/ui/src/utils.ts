import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Shared avatar color palettes used across session components
export const AVATAR_COLORS = [
  { primary: '#E07A5F', accent: '#F2CC8F' },
  { primary: '#81B29A', accent: '#F2CC8F' },
  { primary: '#3D405B', accent: '#81B29A' },
  { primary: '#F2CC8F', accent: '#E07A5F' },
  { primary: '#5C6B73', accent: '#9DB4C0' },
  { primary: '#2D6A4F', accent: '#95D5B2' },
  { primary: '#1B263B', accent: '#415A77' },
  { primary: '#D4A373', accent: '#CCD5AE' },
  { primary: '#BC6C25', accent: '#D4A373' },
  { primary: '#6C757D', accent: '#ADB5BD' },
  { primary: '#7B2D8E', accent: '#C77DFF' },
  { primary: '#0077B6', accent: '#00B4D8' },
]
