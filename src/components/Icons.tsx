import type { ThemeIcon } from "../types";

interface IconProps {
  name: ThemeIcon | "check" | "plus" | "close" | "flag" | "activity" | "data" | "grip";
  size?: number;
}

export function Icon({ name, size = 18 }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "people":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="9.5" cy="7" r="3" />
          <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 4.13a3 3 0 0 1 0 5.75" />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path d="M20 12.5c0 4.5-7.5 8.5-8 8.5s-8-4-8-8.5A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 8 4.5Z" />
        </svg>
      );
    case "coins":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="6" rx="7" ry="3" />
          <path d="M5 6v4c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
          <path d="M5 10v4c0 1.7 3.1 3 7 3s7-1.3 7-3v-4" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M3 12h18" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="M4 11.5 12 4l8 7.5" />
          <path d="M6 10.5V20h12v-9.5" />
        </svg>
      );
    case "compass":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m15.5 8.5-2 7-7 2 2-7 7-2Z" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...common}>
          <path d="M5 19c8-1 13-8 14-14-6 1-13 6-14 14Z" />
          <path d="M5 19c3-6 8-10 14-14" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="m12 3 2.4 5.6L20 9.5l-4.2 3.9 1.2 6.1L12 16.4 7 19.5l1.2-6.1L4 9.5l5.6-.9L12 3Z" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5Z" />
          <path d="M4 5.5v16" />
          <path d="M8 7h8" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="M12 3v4M12 17v4M4.9 6.5l2.8 2.8M16.3 14.7l2.8 2.8M3 12h4M17 12h4M4.9 17.5l2.8-2.8M16.3 9.3l2.8-2.8" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M5 12.5 10 17l9-10" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case "flag":
      return (
        <svg {...common}>
          <path d="M5 21V4" />
          <path d="M5 4h11l-2 4 2 4H5" />
        </svg>
      );
    case "activity":
      return (
        <svg {...common}>
          <path d="M4 12h4l2.5-6 3 12L16 12h4" />
        </svg>
      );
    case "data":
      return (
        <svg {...common}>
          <path d="M4 20V9" />
          <path d="M10 20V4" />
          <path d="M16 20v-7" />
          <path d="M22 20v-4" />
        </svg>
      );
    case "grip":
      return (
        <svg {...common}>
          <circle cx="9" cy="7" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="15" cy="7" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="9" cy="12" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="15" cy="12" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="9" cy="17" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="15" cy="17" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}
