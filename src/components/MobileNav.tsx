// src/components/MobileNav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  Search,
} from "lucide-react";

const items = [
  { href: "/dashboard", label: "Painel Geral", Icon: LayoutDashboard },
  { href: "/products", label: "Produtos", Icon: Package },
  { href: "/movements", label: "Movimentações", Icon: ArrowLeftRight },
  { href: "/search", label: "Pesquisar produtos", Icon: Search },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Top bar: agora é opaca (sem transparência) */}
      <div className="md:hidden sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950">
        <div className="h-14 px-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 border border-neutral-800 rounded px-3 py-2 bg-neutral-900"
          >
            <Menu className="w-4 h-4" />
            <span className="text-sm">Menu</span>
          </button>

          <div className="text-sm text-neutral-300">SETCell</div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          {/* overlay */}
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
          />

          {/* drawer */}
          <aside className="absolute left-0 top-0 h-full w-80 max-w-[85vw] border-r border-neutral-800 bg-neutral-950 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-400">SETCell</div>
                <div className="text-lg font-semibold">Controle de Estoque</div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border border-neutral-800 rounded p-2 bg-neutral-900"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="mt-4 space-y-1">
              {items.map(({ href, label, Icon }) => {
                const active =
                  pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
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
          </aside>
        </div>
      )}
    </>
  );
}
