// src/app/search/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SearchBar from "@/components/SearchBar";
import { Image as ImageIcon, Tag } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const products = await prisma.product.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query } },
            { sku: { contains: query } },
            { category: { contains: query } },
            { description: { contains: query } },
          ],
        }
      : undefined,
    orderBy: { name: "asc" },
  });

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Pesquisa</h1>
          <p className="text-sm text-neutral-400">
            Navegue pelos produtos e clique para acessar os detalhes.
          </p>
        </div>

        <Link
          href="/products"
          className="text-sm text-neutral-300 hover:text-white border border-neutral-800 rounded px-3 py-2 bg-neutral-900 hover:border-neutral-600"
        >
          Editar produtos →
        </Link>
      </header>

      <section className="rounded border border-neutral-800 bg-neutral-950 p-4 space-y-3">
        <SearchBar />

        <div className="text-sm text-neutral-500">
          {query
            ? `${products.length} resultados para "${query}"`
            : `${products.length} produtos total`}
        </div>
      </section>

      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <Link
              key={p.id}
              href={{
                pathname: `/search/${p.id}`,
                query: query ? { q: query } : {},
              }}
              className="block border border-neutral-800 rounded overflow-hidden bg-neutral-950 hover:border-neutral-600"
            >
              <div className="aspect-square bg-neutral-900 flex items-center justify-center overflow-hidden">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-neutral-600" />
                )}
              </div>

              <div className="p-3 space-y-2">
                <div className="font-medium truncate text-neutral-100">
                  {p.name}
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="truncate">
                    {p.category ?? "Sem categoria"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 text-sm">
                  <div className="text-neutral-200">
                    R$ {Number(p.salePrice).toFixed(2)}
                  </div>
                  <div
                    className={
                      p.stock === 0
                        ? "text-red-300"
                        : p.stock <= 3
                          ? "text-yellow-300"
                          : "text-neutral-400"
                    }
                  >
                    Estoque: {p.stock}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-neutral-400 text-center py-12">
            {query ? `Sem resultados para "${query}".` : "Nenhum produto disponível."}
          </div>
        )}
      </section>
    </main>
  );
}
