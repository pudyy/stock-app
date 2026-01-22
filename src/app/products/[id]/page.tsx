// src/app/products/[id]/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/app/actions/products";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import DeleteProductButton from "@/app/products/[id]/DeleteProductButton";

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-neutral-400">{children}</div>;
}

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return (
      <main className="p-6 space-y-4">
        <div className="text-neutral-200">Produto não encontrado.</div>
        <Link href="/products" className="text-neutral-300 hover:text-white">
          ← Voltar
        </Link>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para produtos
          </Link>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <div className="text-sm text-neutral-400">
            {product.category ?? "Sem categoria"} • SKU: {product.sku ?? "-"}
          </div>
        </div>

        {/* Botão com confirmação */}
        <DeleteProductButton productId={product.id} />
      </header>

      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded border border-neutral-800 bg-neutral-950 overflow-hidden">
          <div className="aspect-square bg-neutral-900 flex items-center justify-center overflow-hidden">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-neutral-500">Sem foto</span>
            )}
          </div>
          <div className="p-4">
            <div className="text-sm text-neutral-400 mb-2">Foto atual</div>
            <div className="text-xs text-neutral-500 break-all">
              {product.imageUrl ?? "-"}
            </div>
          </div>
        </div>

        <section className="rounded border border-neutral-800 bg-neutral-950">
          <div className="p-4 border-b border-neutral-800 flex items-center gap-2">
            <Save className="w-4 h-4 text-neutral-300" />
            <h2 className="text-lg font-medium">Editar produto</h2>
          </div>

          <form
            action={updateProduct}
            className="p-4 grid gap-3 md:grid-cols-2"
          >
            <input type="hidden" name="id" value={product.id} />

            <div className="space-y-1 md:col-span-2">
              <Label>Nome</Label>
              <input
                name="name"
                required
                defaultValue={product.name}
                className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 w-full focus:outline-none focus:border-neutral-600"
              />
            </div>

            <div className="space-y-1">
              <Label>SKU</Label>
              <input
                name="sku"
                defaultValue={product.sku ?? ""}
                className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 w-full focus:outline-none focus:border-neutral-600"
              />
            </div>

            <div className="space-y-1">
              <Label>Categoria</Label>
              <input
                name="category"
                defaultValue={product.category ?? ""}
                className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 w-full focus:outline-none focus:border-neutral-600"
              />
            </div>

            <div className="space-y-1">
              <Label>Estoque</Label>
              <input
                name="stock"
                type="number"
                min={0}
                defaultValue={product.stock}
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
                defaultValue={Number(product.costPrice)}
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
                defaultValue={Number(product.salePrice)}
                className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 w-full focus:outline-none focus:border-neutral-600"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <Label>Descrição/Especificações</Label>
              <textarea
                name="description"
                rows={5}
                defaultValue={product.description ?? ""}
                className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 w-full focus:outline-none focus:border-neutral-600"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <Label>Trocar foto (opcional)</Label>
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
                Salvar mudanças
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}
