"use client";

import Link from "next/link";
import clsx from "clsx";

type FilterType = "ALL" | "IN" | "OUT";

const filters: { value: FilterType; label: string }[] = [
  { value: "ALL", label: "Ambos" },
  { value: "IN", label: "Entrada" },
  { value: "OUT", label: "Saída" },
];

export function MovementFilterTabs({ currentFilter }: { currentFilter: FilterType }) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900/50 p-1">
      {filters.map(({ value, label }) => {
        const href = value === "ALL" ? "/movements/history" : `/movements/history?filter=${value}`;
        const isActive = currentFilter === value;

        return (
          <Link
            key={value}
            href={href}
            className={clsx(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-neutral-700 text-white"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800",
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
