import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formata data/hora no fuso do Brasil (America/Sao_Paulo) para exibição consistente em SSR. */
export function formatDateTimeBR(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
}
