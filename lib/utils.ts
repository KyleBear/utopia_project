import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date: string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ko });
}

export function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  const masked = local.slice(0, 2) + "***";
  return `${masked}@${domain}`;
}
