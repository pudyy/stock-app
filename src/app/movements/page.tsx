// src/app/movements/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createMovement } from "@/app/actions/movements";
import { ArrowDownToLine, ArrowUpFromLine, History } from "lucide-react";

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-neutral-400">{children}</div>;
}

export default async function MovementsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const sp = await searchParams;
  const preset = sp.type === "OUT" ? "OUT" : "IN";

  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, stock: true },
  });

  const movements = await prisma.stockMovement.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { product: true },
  });

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Movimentações</h1>
          <p className="text-sm text-neutral-400">
            Registre a entrada de produtos (IN) e saídas (OUT).
          </p>
        </div>

        <Link
          href="/search"
          className="text-sm text-neutral-300 hover:text-white border border-neutral-800 rounded px-3 py-2 bg-neutral-900 hover:border-neutral-600"
        >
          Abrir pesquisa →
        </Link>
      </header>

      <section className="rounded border border-neutral-800 bg-neutral-950">
        <div className="p-4 border-b border-neutral-800 flex items-center gap-2">
          {preset === "IN" ? (
            <ArrowDownToLine className="w-4 h-4 text-green-300" />
          ) : (
            <ArrowUpFromLine className="w-4 h-4 text-red-300" />
          )}
          <h2 className="text-lg font-medium">Registrar movimentação</h2>
        </div>

        <form action={createMovement} className="p-4 grid gap-3 md:grid-cols-2">
          <div className="space-y-1 md:col-span-2">
            <Label>Produto</Label>
            <select
              name="productId"
              required
              defaultValue=""
              className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 w-full focus:outline-none focus:border-neutral-600"
            >
              <option value="" disabled>
                Selecione um produto...
              </option>

              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Estoque: {p.stock})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <Label>Tipo</Label>
            <select
              name="type"
              defaultValue={preset}
              className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 w-full focus:outline-none focus:border-neutral-600"
            >
              <option value="IN">Entrou (IN)</option>
              <option value="OUT">Saiu (OUT)</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label>Quantidade</Label>
            <input
              name="qty"
              type="number"
              min={1}
              step={1}
              defaultValue={1}
              className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 w-full focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <Label>Razão (opcional)</Label>
            <input
              name="reason"
              className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 w-full focus:outline-none focus:border-neutral-600"
              placeholder="Ex: Venda, Uso interno, etc... (Informar nome para melhor organização)"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-end pt-2">
            <button
              type="submit"
              className="bg-white text-black rounded px-4 py-2 hover:opacity-90"
            >
              Salvar movimentação
            </button>
          </div>
        </form>
      </section>

      <section className="rounded border border-neutral-800 bg-neutral-950 overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex items-center gap-2">
          <History className="w-4 h-4 text-neutral-300" />
          <h2 className="text-lg font-medium">Movimentações recentes</h2>
          <div className="ml-auto text-sm text-neutral-500">
            {movements.length} últimas movimentações
          </div>
        </div>

        <div className="divide-y divide-neutral-900">
          {movements.map((m) => (
            <div key={m.id} className="p-4 hover:bg-neutral-900/40">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="truncate text-neutral-200">
                    <span
                      className={
                        m.type === "IN" ? "text-green-300" : "text-red-300"
                      }
                    >
                      {m.type}
                    </span>{" "}
                    • <span className="text-neutral-300">{m.qty}</span> •{" "}
                    <span className="font-medium">{m.product.name}</span>
                  </div>
                  {m.reason && (
                    <div className="text-sm text-neutral-500 truncate">
                      {m.reason}
                    </div>
                  )}
                </div>

                <div className="text-sm text-neutral-500 whitespace-nowrap">
                  {new Date(m.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}

          {movements.length === 0 && (
            <div className="p-6 text-neutral-400">
              Nenhuma movimentação ainda.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
