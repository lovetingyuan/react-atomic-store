import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { create } from "mutative";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function im<T>(callback: (v: T) => void) {
  return (oldValue: T) => {
    return create(oldValue, callback);
  };
}
