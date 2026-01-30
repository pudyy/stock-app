// src/app/movements/history/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateTimeBR } from "@/lib/utils";
import { ArrowDownToLine, ArrowUpFromLine, History } from "lucide-react";
import { MovementFilterTabs } from "./MovementFilterTabs";
import DeleteMovementButton from "./DeleteMovementButton";

type FilterType = "ALL" | "IN" | "OUT";

export default async function MovementsHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const sp = await searchParams;
  const filter = (sp.filter === "IN" || sp.filter === "OUT" ? sp.filter : "ALL") as FilterType;

  const movements = await prisma.stockMovement.findMany({
    where: filter === "ALL" ? undefined : { type: filter },
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  return (
    <main className="p-4 md:p-6 space-y-4 md:space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold">Visão geral de movimentações</h1>
          <p className="text-sm text-neutral-400 mt-0.5">
            Histórico de entradas e saídas. Filtre por tipo para visualizar apenas o que deseja.
          </p>
        </div>

        <Link
          href="/movements"
          className="w-full sm:w-auto text-sm text-center text-neutral-300 hover:text-white border border-neutral-800 rounded-lg px-4 py-3 sm:py-2 bg-neutral-900 hover:border-neutral-600 shrink-0"
        >
          Registrar movimentação →
        </Link>
      </header>

      <section className="rounded-lg border border-neutral-800 bg-neutral-950 overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-neutral-300 shrink-0" />
            <h2 className="text-lg font-medium">Histórico</h2>
          </div>
          <MovementFilterTabs currentFilter={filter} />
          <div className="sm:ml-auto text-sm text-neutral-500">
            {movements.length} movimentação{movements.length !== 1 ? "ões" : ""}
          </div>
        </div>

        <div className="divide-y divide-neutral-900">
          {movements.map((m) => (
            <div
              key={m.id}
              className="p-4 hover:bg-neutral-900/40 flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-neutral-200">
                  <span
                    className={
                      m.type === "IN" ? "text-green-300" : "text-red-300"
                    }
                  >
                    {m.type === "IN" ? (
                      <ArrowDownToLine className="inline w-4 h-4 mr-1 align-middle shrink-0" />
                    ) : (
                      <ArrowUpFromLine className="inline w-4 h-4 mr-1 align-middle shrink-0" />
                    )}
                    {m.type === "IN" ? "Entrada" : "Saída"}
                  </span>
                  <span className="text-neutral-500 hidden sm:inline">•</span>
                  <span className="text-neutral-300 font-medium">{m.qty}</span>
                  <span className="text-neutral-500">un.</span>
                  <span className="text-neutral-500 hidden sm:inline">•</span>
                  <span className="font-medium break-words">{m.product.name}</span>
                </div>
                {m.reason && (
                  <div className="text-sm text-neutral-500 mt-1 break-words line-clamp-2 sm:truncate">
                    {m.reason}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 shrink-0 pt-1 md:pt-0 border-t border-neutral-800 md:border-t-0">
                <span className="text-sm text-neutral-500">
                  {formatDateTimeBR(m.createdAt)}
                </span>
                <DeleteMovementButton
                  movementId={m.id}
                  productName={m.product.name}
                  type={m.type as "IN" | "OUT"}
                  qty={m.qty}
                />
              </div>
            </div>
          ))}

          {movements.length === 0 && (
            <div className="p-6 text-neutral-400 text-center">
              {filter === "ALL"
                ? "Nenhuma movimentação registrada ainda."
                : `Nenhuma movimentação de ${filter === "IN" ? "entrada" : "saída"} encontrada.`}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
