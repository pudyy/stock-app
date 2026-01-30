// src/app/movements/history/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
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
    <main className="p-6 space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Visão geral de movimentações</h1>
          <p className="text-sm text-neutral-400">
            Histórico de entradas e saídas. Filtre por tipo para visualizar apenas o que deseja.
          </p>
        </div>

        <Link
          href="/movements"
          className="text-sm text-neutral-300 hover:text-white border border-neutral-800 rounded px-3 py-2 bg-neutral-900 hover:border-neutral-600"
        >
          Registrar movimentação →
        </Link>
      </header>

      <section className="rounded border border-neutral-800 bg-neutral-950 overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-neutral-300" />
            <h2 className="text-lg font-medium">Histórico</h2>
          </div>
          <MovementFilterTabs currentFilter={filter} />
          <div className="ml-auto text-sm text-neutral-500">
            {movements.length} movimentação{movements.length !== 1 ? "ões" : ""}
          </div>
        </div>

        <div className="divide-y divide-neutral-900">
          {movements.map((m) => (
            <div
              key={m.id}
              className="p-4 hover:bg-neutral-900/40 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 truncate text-neutral-200">
                  <span
                    className={
                      m.type === "IN" ? "text-green-300" : "text-red-300"
                    }
                  >
                    {m.type === "IN" ? (
                      <ArrowDownToLine className="inline w-4 h-4 mr-1 align-middle" />
                    ) : (
                      <ArrowUpFromLine className="inline w-4 h-4 mr-1 align-middle" />
                    )}
                    {m.type === "IN" ? "Entrada" : "Saída"}
                  </span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-neutral-300 font-medium">{m.qty}</span>
                  <span className="text-neutral-500">un.</span>
                  <span className="text-neutral-500">•</span>
                  <span className="font-medium">{m.product.name}</span>
                </div>
                {m.reason && (
                  <div className="text-sm text-neutral-500 truncate mt-0.5">
                    {m.reason}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm text-neutral-500 whitespace-nowrap">
                  {new Date(m.createdAt).toLocaleString("pt-BR")}
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
