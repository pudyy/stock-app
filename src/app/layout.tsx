// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import SidebarNav from "@/components/SidebarNav";
import MobileNav from "@/components/MobileNav";

export const metadata: Metadata = {
  title: "SETCell",
  description: "Controle de estoque",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white">
        <div className="min-h-screen md:flex">
          {/* Desktop sidebar */}
          <div className="hidden md:block">
            <SidebarNav />
          </div>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Mobile header + drawer */}
            <MobileNav />

            {/* Page content */}
            <div>{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
