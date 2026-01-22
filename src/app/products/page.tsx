// src/app/products/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createProduct } from "@/app/actions/products";
import { Plus, Pencil, Image as ImageIcon } from "lucide-react";

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-neutral-400">{children}</div>;
}

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Produtos</h1>
          <p className="text-sm text-neutral-400">
            Crie e edite produtos já existentes (foto, preço, quantidade).
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
          <Plus className="w-4 h-4 text-neutral-300" />
          <h2 className="text-lg font-medium">Criar produto</h2>
        </div>

        <form action={createProduct} className="p-4 grid gap-3 md:grid-cols-2">
          <div className="space-y-1 md:col-span-2">
            <Label>Nome</Label>
            <input
              name="name"
              required
              className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 w-full focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div className="space-y-1">
            <Label>SKU (opcional)</Label>
            <input
              name="sku"
              className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 w-full focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div className="space-y-1">
            <Label>Categoria (opcional)</Label>
            <input
              name="category"
              className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 w-full focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div className="space-y-1">
            <Label>Estoque</Label>
            <input
              name="stock"
              type="number"
              min={0}
              defaultValue={0}
              className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 w-full focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div className="space-y-1">
            <Label>Valor de custo</Label>
            <input
              name="costPrice"
              type="number"
              step="0.01"
              min={0}
              defaultValue={0}
              className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 w-full focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div className="space-y-1">
            <Label>Valor de venda</Label>
            <input
              name="salePrice"
              type="number"
              step="0.01"
              min={0}
              defaultValue={0}
              className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 w-full focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <Label>Descrição / especificações</Label>
            <textarea
              name="description"
              rows={4}
              className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 w-full focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <Label>Foto</Label>
            <div className="flex items-center gap-3 border border-neutral-800 rounded bg-neutral-900 px-3 py-2">
              <ImageIcon className="w-4 h-4 text-neutral-400" />
              <input
                name="image"
                type="file"
                accept="image/*"
                className="w-full text-sm text-neutral-300 file:mr-3 file:rounded file:border-0 file:bg-neutral-800 file:px-3 file:py-1.5 file:text-neutral-200 hover:file:bg-neutral-700"
              />
            </div>
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
            <button
              type="submit"
              className="bg-white text-black rounded px-4 py-2 hover:opacity-90"
            >
              Criar e abrir
            </button>
          </div>
        </form>
      </section>

      <section className="rounded border border-neutral-800 bg-neutral-950 overflow-hidden">
        <div className="p-4 border-b border-neutral-800">
          <h2 className="text-lg font-medium">Todos os produtos</h2>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-950 sticky top-0">
              <tr className="text-left text-neutral-400 border-b border-neutral-800">
                <th className="p-3 w-[64px]">Img</th>
                <th className="p-3">Nome</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Venda</th>
                <th className="p-3">Estoque</th>
                <th className="p-3 w-[120px]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-neutral-900 hover:bg-neutral-900/40"
                >
                  <td className="p-3">
                    <div className="w-10 h-10 rounded bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center">
                      {p.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-neutral-600" />
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-neutral-100">{p.name}</div>
                    <div className="text-xs text-neutral-500">
                      SKU: {p.sku ?? "-"}
                    </div>
                  </td>
                  <td className="p-3 text-neutral-300">{p.category ?? "-"}</td>
                  <td className="p-3 text-neutral-300">
                    R$ {Number(p.salePrice).toFixed(2)}
                  </td>
                  <td className="p-3 text-neutral-300">{p.stock}</td>
                  <td className="p-3">
                    <Link
                      href={`/products/${p.id}`}
                      className="inline-flex items-center gap-2 text-neutral-200 hover:text-white border border-neutral-800 rounded px-3 py-1.5 bg-neutral-900 hover:border-neutral-600"
                    >
                      <Pencil className="w-4 h-4" />
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td className="p-6 text-neutral-400" colSpan={6}>
                    Sem produtos ainda...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
