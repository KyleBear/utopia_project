"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

const options = [
  { value: "light" as const, icon: Sun, label: "라이트" },
  { value: "dark" as const, icon: Moon, label: "다크" },
  { value: "system" as const, icon: Monitor, label: "시스템" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme();

  return (
    <div className="flex items-center gap-0.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
      {options.map(({ value, icon: Icon, label }) => {
        // Before mount, we don't know the real theme — render no active state
        // so server HTML and first client render are identical.
        const isActive = mounted && theme === value;
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            title={label}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              isActive
                ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            <Icon size={14} />
          </button>
        );
      })}
    </div>
  );
}
