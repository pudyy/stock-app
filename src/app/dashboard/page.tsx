// src/app/dashboard/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateTimeBR } from "@/lib/utils";
import {
  PackagePlus,
  Search,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";

export default async function DashboardPage() {
  const totalProducts = await prisma.product.count();

  const stockSummary = await prisma.product.aggregate({
    _sum: { stock: true },
  });

  const recentMovements = await prisma.stockMovement.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { product: true },
  });

  const totalStock = stockSummary._sum.stock ?? 0;

  return (
    <main className="p-4 md:p-6 space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-semibold">Painel Geral</h1>

      <section className="rounded-lg border border-neutral-800 p-4 space-y-3">
        <h2 className="text-lg font-medium">Ações rápidas</h2>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/products"
            className="rounded border border-neutral-800 bg-neutral-900 hover:border-neutral-600 px-4 py-3 flex items-start gap-3"
          >
            <PackagePlus className="w-5 h-5 text-neutral-400 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-medium">Criar produtos</div>
              <div className="text-sm text-neutral-400">
                Adicionar um novo item ao estoque
              </div>
            </div>
          </Link>

          <Link
            href="/search"
            className="rounded border border-neutral-800 bg-neutral-900 hover:border-neutral-600 px-4 py-3 flex items-start gap-3"
          >
            <Search className="w-5 h-5 text-neutral-400 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-medium">Pesquisar produtos</div>
              <div className="text-sm text-neutral-400">
                Encontre itens rapidamente
              </div>
            </div>
          </Link>

          <Link
            href="/movements?type=IN"
            className="rounded border border-neutral-800 bg-neutral-900 hover:border-neutral-600 px-4 py-3 flex items-start gap-3"
          >
            <ArrowDownToLine className="w-5 h-5 text-green-400 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-medium">Registrar entrada de produto</div>
              <div className="text-sm text-neutral-400">Entrada de estoque</div>
            </div>
          </Link>

          <Link
            href="/movements?type=OUT"
            className="rounded border border-neutral-800 bg-neutral-900 hover:border-neutral-600 px-4 py-3 flex items-start gap-3"
          >
            <ArrowUpFromLine className="w-5 h-5 text-red-400 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-medium">Registrar saída de produto</div>
              <div className="text-sm text-neutral-400">Saída de estoque</div>
            </div>
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="rounded-lg border border-neutral-800 p-4">
          <div className="text-sm text-neutral-400">Total de produtos</div>
          <div className="text-2xl sm:text-3xl font-semibold mt-1">{totalProducts}</div>
        </div>

        <div className="rounded-lg border border-neutral-800 p-4">
          <div className="text-sm text-neutral-400">Itens no estoque</div>
          <div className="text-2xl sm:text-3xl font-semibold mt-1">{totalStock}</div>
        </div>

        <div className="rounded-lg border border-neutral-800 p-4">
          <div className="text-sm text-neutral-400">Movimentações recentes</div>
          <div className="text-2xl sm:text-3xl font-semibold mt-1">
            {recentMovements.length}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Últimas 10 movimentações</h2>
          <Link
            href="/movements"
            className="text-sm text-neutral-300 hover:text-white"
          >
            Ver todas →
          </Link>
        </div>

        <div className="space-y-2">
          {recentMovements.map((m) => (
            <div
              key={m.id}
              className="border border-neutral-800 rounded-lg px-4 py-3"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span
                      className={
                        m.type === "IN" ? "text-green-300" : "text-red-300"
                      }
                    >
                      {m.type}
                    </span>
                    <span className="text-neutral-500">•</span>
                    <span className="font-medium">{m.qty}</span>
                    <span className="text-neutral-500">un.</span>
                    <span className="text-neutral-500">•</span>
                    <span className="break-words">{m.product.name}</span>
                  </div>
                  {m.reason && (
                    <div className="text-sm text-neutral-400 mt-0.5 break-words line-clamp-2 md:truncate">
                      {m.reason}
                    </div>
                  )}
                </div>

                <div className="text-sm text-neutral-400 shrink-0">
                  {formatDateTimeBR(m.createdAt)}
                </div>
              </div>
            </div>
          ))}

          {recentMovements.length === 0 && (
            <div className="text-neutral-400 text-sm">
              Nenhuma movimentação ainda.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
