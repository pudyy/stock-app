// src/components/SidebarNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LayoutDashboard, Package, ArrowLeftRight, Search } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Painel geral", Icon: LayoutDashboard },
  { href: "/products", label: "Produtos", Icon: Package },
  { href: "/movements", label: "Movimentações", Icon: ArrowLeftRight },
  { href: "/search", label: "Pesquisa", Icon: Search },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-neutral-800 bg-neutral-950 p-4">
      <div className="mb-4">
        <div className="text-sm text-neutral-400">SETCell</div>
        <div className="text-lg font-semibold">Controle de Estoque</div>
      </div>

      <nav className="space-y-1">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded px-3 py-2 text-sm border",
                active
                  ? "bg-neutral-900 border-neutral-700 text-white"
                  : "bg-transparent border-transparent text-neutral-300 hover:bg-neutral-900 hover:border-neutral-800 hover:text-white",
              )}
            >
              <Icon
                className={clsx(
                  "h-4 w-4",
                  active ? "text-white" : "text-neutral-400",
                )}
              />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 pt-4 border-t border-neutral-800 text-xs text-neutral-500">
        v0.1 • SETCELL
      </div>
    </aside>
  );
}
