import { Mode } from "@/app/stores/cycleStore";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(t: number) {
    const hours = Math.floor((t / 60) / 60);

    const hoursStr = Math.floor((t / 60) / 60)
      .toString()
      .padStart(2, "0");
    const minutesStr = Math.floor((t / 60) % 60)
      .toString()
      .padStart(2, "0");
    const secondsStr = (t % 60)
      .toString()
      .padStart(2, "0");

    const timeStr = `
      ${hours > 0 ? `${hoursStr}:` : ''}${minutesStr}:${secondsStr}`;

    return timeStr;
};

export function hexToRgb(hex: string): { r: number; g: number; b: number; } | null {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  if (hex.length !== 6) {
    return {'r':255, 'g':255, 'b':255};
  } else {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
  }
}

export const generateColor = (mode: string) => {
  let color = "#27272a";
  switch (mode) {
    case Mode.FOCUS: {
      color = "#84cc16";
      break;
    }
    case Mode.LONG_BREAK: {
      color = "#06b6d4";
      break;
    }
    case Mode.SHORT_BREAK: {
      color = "#f59e0b";
      break;
    }
  }
  return color;
};
