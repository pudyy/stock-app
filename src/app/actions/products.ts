// src/app/actions/products.ts
"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function sanitizeFileName(name: string) {
  return name.replaceAll(" ", "_").replaceAll("..", ".");
}

async function saveImageToPublicUploads(file: File) {
  if (!file || file.size === 0) return null;

  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image too large (max 5MB)");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const safe = sanitizeFileName(file.name);
  const fileName = `${crypto.randomUUID()}-${safe}`;
  const relUrl = `/uploads/${fileName}`;

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true }); // <- garante pasta

  const absPath = path.join(uploadsDir, fileName);
  await fs.writeFile(absPath, buffer);

  return relUrl;
}

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const skuRaw = String(formData.get("sku") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  const costPrice = Number(formData.get("costPrice") ?? 0);
  const salePrice = Number(formData.get("salePrice") ?? 0);
  const stock = Number(formData.get("stock") ?? 0);

  const image = formData.get("image") as unknown as File | null;
  const imageUrl = image ? await saveImageToPublicUploads(image) : null;

  if (!name) throw new Error("Name is required");
  if (!Number.isFinite(costPrice) || costPrice < 0)
    throw new Error("Invalid costPrice");
  if (!Number.isFinite(salePrice) || salePrice < 0)
    throw new Error("Invalid salePrice");
  if (!Number.isInteger(stock) || stock < 0) throw new Error("Invalid stock");

  const product = await prisma.product.create({
    data: {
      name,
      sku: skuRaw ? skuRaw : null,
      category: category ? category : null,
      description: description ? description : null,
      imageUrl,
      costPrice,
      salePrice,
      stock,
    },
  });

  revalidatePath("/products"); // revalida cache da rota [web:132]
  redirect(`/products/${product.id}`); // redirect em Server Action [web:219]
}

export async function updateProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const skuRaw = String(formData.get("sku") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  const costPrice = Number(formData.get("costPrice") ?? 0);
  const salePrice = Number(formData.get("salePrice") ?? 0);
  const stock = Number(formData.get("stock") ?? 0);

  const image = formData.get("image") as unknown as File | null;
  const newImageUrl =
    image && image.size > 0 ? await saveImageToPublicUploads(image) : undefined;

  if (!id) throw new Error("Missing id");
  if (!name) throw new Error("Name is required");
  if (!Number.isFinite(costPrice) || costPrice < 0)
    throw new Error("Invalid costPrice");
  if (!Number.isFinite(salePrice) || salePrice < 0)
    throw new Error("Invalid salePrice");
  if (!Number.isInteger(stock) || stock < 0) throw new Error("Invalid stock");

  await prisma.product.update({
    where: { id },
    data: {
      name,
      sku: skuRaw ? skuRaw : null,
      category: category ? category : null,
      description: description ? description : null,
      costPrice,
      salePrice,
      stock,
      ...(newImageUrl !== undefined ? { imageUrl: newImageUrl } : {}),
    },
  });

  revalidatePath("/products"); // [web:132]
  revalidatePath(`/products/${id}`); // [web:132]
  revalidatePath("/movements"); // [web:132]
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing id");

  await prisma.product.delete({ where: { id } });

  revalidatePath("/products"); // [web:132]
  revalidatePath("/movements"); // [web:132]
  redirect("/products"); // [web:219]
}
