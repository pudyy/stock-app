// src/app/search/[id]/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateTimeBR } from "@/lib/utils";
import { ArrowLeft, Pencil, Image as ImageIcon, Tag } from "lucide-react";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-neutral-900 py-2">
      <div className="text-sm text-neutral-400">{label}</div>
      <div className="text-sm text-neutral-200 text-right">{value}</div>
    </div>
  );
}

export default async function SearchProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { id } = await params;
  const { q } = await searchParams;

  const product = await prisma.product.findUnique({ where: { id } });

  const backHref = q ? `/search?q=${encodeURIComponent(q)}` : "/search";

  if (!product) {
    return (
      <main className="p-6 space-y-4">
        <div className="text-neutral-200">Produto não encontrado.</div>
        <Link href={backHref} className="text-neutral-300 hover:text-white">
          ← Voltar para busca
        </Link>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between gap-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para busca
        </Link>

        <Link
          href={`/products/${product.id}`}
          className="inline-flex items-center gap-2 text-sm text-neutral-200 hover:text-white border border-neutral-800 rounded px-3 py-2 bg-neutral-900 hover:border-neutral-600"
        >
          <Pencil className="w-4 h-4" />
          Editar produto
        </Link>
      </header>

      <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
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
              <ImageIcon className="w-6 h-6 text-neutral-600" />
            )}
          </div>

          <div className="p-4 space-y-2">
            <div className="text-xl font-semibold">{product.name}</div>

            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Tag className="w-4 h-4" />
              <span className="truncate">
                {product.category ?? "No category"}
              </span>
              <span className="text-neutral-600">•</span>
              <span>SKU: {product.sku ?? "-"}</span>
            </div>

            <div className="rounded border border-neutral-800 p-3 mt-2">
              <InfoRow label="Estoque" value={product.stock} />
              <InfoRow
                label="Preço de venda"
                value={`R$ ${Number(product.salePrice).toFixed(2)}`}
              />
              <InfoRow
                label="Preço de custo"
                value={`R$ ${Number(product.costPrice).toFixed(2)}`}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <section className="rounded border border-neutral-800 bg-neutral-950 p-4 space-y-2">
            <h2 className="text-lg font-medium">Description / specs</h2>
            <div className="text-sm text-neutral-200 whitespace-pre-wrap">
              {product.description?.trim()
                ? product.description
                : "No description."}
            </div>
          </section>

          <section className="rounded border border-neutral-800 bg-neutral-950 p-4 space-y-2">
            <h2 className="text-lg font-medium">Metadata</h2>
            <div className="text-sm text-neutral-400">
              Criado em: {formatDateTimeBR(product.createdAt)}
              <br />
              Atualizado em: {formatDateTimeBR(product.updatedAt)}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
