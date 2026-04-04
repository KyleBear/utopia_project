import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ErrorMessage({ message, className }: { message: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2", className)}>
      <AlertCircle size={14} className="shrink-0" />
      {message}
    </div>
  );
}

export function SuccessMessage({ message, className }: { message: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2", className)}>
      {message}
    </div>
  );
}
