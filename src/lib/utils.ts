import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalaize(str: string) {
  if (!str) return "";
  const splittedText = str.split("");
  const hyphenIndex = splittedText.indexOf("_");
  splittedText[hyphenIndex] = " ";
  splittedText[0] = splittedText[0].toUpperCase();
  return splittedText.join("");
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

export function getStoragePathFromPublicUrl(publicUrl: string) {
  const marker = "/listing-images/";
  const index = publicUrl.indexOf(marker);
  if (index === -1) return null;
  return publicUrl.slice(index + marker.length);
}