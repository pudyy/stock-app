// src/components/SearchBar.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [value, setValue] = useState(searchParams.get("q") ?? "");

  function submit(nextValue: string) {
    startTransition(() => {
      const q = nextValue.trim();
      router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
    });
  }

  return (
    <div className="flex gap-2">
      <div className="flex items-center gap-2 flex-1 border border-neutral-800 rounded bg-neutral-900 px-3 py-2">
        <Search className="w-4 h-4 text-neutral-400" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit(value);
          }}
          placeholder="Procure pelo nome, SKU, categoria..."
          className="bg-transparent outline-none w-full text-sm text-neutral-200 placeholder:text-neutral-500"
        />
        {value.trim().length > 0 && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              submit("");
            }}
            className="text-neutral-400 hover:text-white"
            aria-label="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <button
        type="button"
        disabled={isPending}
        onClick={() => submit(value)}
        className="bg-white text-black rounded px-4 py-2 hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? "..." : "Procurar"}
      </button>
    </div>
  );
}
