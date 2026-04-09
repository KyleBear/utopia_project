"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { X, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  defaultTags?: string[];
}

export function TagInput({ defaultTags = [] }: TagInputProps) {
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag(value: string) {
    const tag = value.trim().replace(/[,\s]+/g, "");
    if (!tag || tag.length > 20 || tags.includes(tag) || tags.length >= 5) return;
    setTags(prev => [...prev, tag]);
    setInput("");
  }

  function removeTag(tag: string) {
    setTags(prev => prev.filter(t => t !== tag));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      setTags(prev => prev.slice(0, -1));
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Tag size={13} className="text-slate-400" />
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          태그
          <span className="ml-1 text-xs font-normal text-slate-400">(최대 5개, Enter 또는 쉼표로 추가)</span>
        </label>
      </div>

      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "input flex flex-wrap gap-1.5 min-h-[42px] cursor-text",
          tags.length > 0 ? "py-1.5" : ""
        )}
      >
        {tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs rounded-full border border-brand-200 dark:border-brand-800">
            #{tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-brand-800 dark:hover:text-brand-200">
              <X size={10} />
            </button>
          </span>
        ))}
        {tags.length < 5 && (
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => addTag(input)}
            placeholder={tags.length === 0 ? "태그 입력..." : ""}
            className="flex-1 min-w-[80px] bg-transparent outline-none text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400"
          />
        )}
      </div>

      <input type="hidden" name="tags" value={tags.join(",")} />
    </div>
  );
}
