import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate random activity data for mini charts
export function generateActivityData(type: string): number[] { 
  // Different patterns based on wallet type
  if (type === "Smart Money") {
    return [3, 4, 5, 4, 6, 7, 8, 7, 9, 8, 10, 11, 12];
  } else if (type === "Institution") {
    return [8, 7, 6, 8, 9, 8, 9, 10, 11, 10, 9, 10, 11];
  } else if (type === "Risk Alert") {
    return [12, 10, 9, 8, 10, 8, 7, 6, 5, 6, 4, 3, 4];
  } else {
    return [5, 6, 8, 10, 9, 11, 12, 14, 15, 16, 15, 17, 18];
  }
}

// Format large numbers with K, M, B suffixes
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Format blockchain addresses (0x7a25...1fe2)
export function formatAddress(address: string): string {
  if (!address) return '';
  if (address.length <= 12) return address;
  
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Get color class based on type
export function getColorForType(type: string): string {
  switch(type.toLowerCase()) {
    case 'smart money':
      return 'text-cyan-400 bg-cyan-400/10';
    case 'institution':
      return 'text-purple-500 bg-purple-500/10';
    case 'risk alert':
      return 'text-pink-500 bg-pink-500/10';
    case 'bullish':
      return 'text-green-400 bg-green-400/10';
    case 'bearish':
      return 'text-pink-500 bg-pink-500/10';
    case 'exchange outflow':
      return 'text-cyan-400 bg-cyan-400/10';
    case 'validator deposit':
      return 'text-purple-500 bg-purple-500/10';
    case 'defi interaction':
      return 'text-green-400 bg-green-400/10';
    case 'potential sell':
      return 'text-pink-500 bg-pink-500/10';
    default:
      return 'text-gray-400 bg-white/10';
  }
}

// Get appropriate icon for a transaction or insight type
export function getIconForType(type: string): string {
  switch(type.toLowerCase()) {
    case 'large transfer':
    case 'exchange outflow':
    case 'exchange deposit':
    case 'whale movement':
      return 'ri-arrow-right-circle-line';
    case 'smart contract':
    case 'defi interaction':
      return 'ri-bubble-chart-line';
    case 'btc accumulation alert':
      return 'ri-flashlight-line';
    case 'eth exchange outflows':
      return 'ri-radar-line';
    case 'defi protocol attention':
      return 'ri-bubble-chart-line';
    default:
      return 'ri-funds-line';
  }
}
