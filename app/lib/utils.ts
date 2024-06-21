// npm install clsx tailwind-merge
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToAscii(inputString: string) {
  // remove non ascii characters by replacing them with an empty string
  // He got the regex from ChatGPT
  const asciiString = inputString.replace(/[^\x00-\x7F]+/g, "");
  return asciiString;
}
