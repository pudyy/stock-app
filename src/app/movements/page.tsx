// src/app/movements/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createMovement } from "@/app/actions/movements";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-neutral-400">{children}</div>;
}

export default async function RegisterMovementPage({
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

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Registrar novas movimentações</h1>
          <p className="text-sm text-neutral-400">
            Registre a entrada (IN) ou saída (OUT) de produtos no estoque.
          </p>
        </div>

        <Link
          href="/movements/history"
          className="text-sm text-neutral-300 hover:text-white border border-neutral-800 rounded px-3 py-2 bg-neutral-900 hover:border-neutral-600"
        >
          Ver histórico →
        </Link>
      </header>

      <section className="rounded border border-neutral-800 bg-neutral-950">
        <div className="p-4 border-b border-neutral-800 flex items-center gap-2">
          {preset === "IN" ? (
            <ArrowDownToLine className="w-4 h-4 text-green-300" />
          ) : (
            <ArrowUpFromLine className="w-4 h-4 text-red-300" />
          )}
          <h2 className="text-lg font-medium">Nova movimentação</h2>
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
              <option value="IN">Entrada (IN)</option>
              <option value="OUT">Saída (OUT)</option>
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
    </main>
  );
}
