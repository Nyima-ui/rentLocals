import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalaize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatStartEndDate(isoString: string) {
  const date = new Date(isoString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${day} ${month}`;
}

export function getOrdinalSuffix(day: number) {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function formatSystemDate(isoString: string) {
  const date = new Date(isoString);

  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);

  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `Date: ${day}${suffix} ${month}, ${year}`;
}
