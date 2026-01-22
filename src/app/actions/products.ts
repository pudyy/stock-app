// src/app/actions/products.ts
"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function sanitizeFileName(name: string) {
  return name.replaceAll(" ", "_").replaceAll("..", ".");
}

async function uploadImageToBlob(file: File) {
  if (!file || file.size === 0) return null;

  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  // IMPORTANTE: na Vercel Functions tem limite de body ~4.5MB; > isso, use client upload
  if (file.size > 4.5 * 1024 * 1024) {
    throw new Error("Image too large for server upload (max ~4.5MB).");
  }

  const safe = sanitizeFileName(file.name);
  const ext = safe.includes(".") ? safe.split(".").pop() : "jpg";
  const pathname = `products/${crypto.randomUUID()}.${ext ?? "jpg"}`;

  const blob = await put(pathname, file, {
    access: "public",
    contentType: file.type || "image/jpeg",
  });

  return blob.url;
}

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const skuRaw = String(formData.get("sku") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  const costPrice = Number(formData.get("costPrice") ?? 0);
  const salePrice = Number(formData.get("salePrice") ?? 0);
  const stock = Number(formData.get("stock") ?? 0);

  const image = formData.get("image");
  const imageUrl =
    image instanceof File && image.size > 0
      ? await uploadImageToBlob(image)
      : null;

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

  revalidatePath("/products");
  redirect(`/products/${product.id}`);
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

  const image = formData.get("image");
  const newImageUrl =
    image instanceof File && image.size > 0
      ? await uploadImageToBlob(image)
      : undefined;

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

  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  revalidatePath("/movements");
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing id");

  await prisma.product.delete({ where: { id } });

  revalidatePath("/products");
  revalidatePath("/movements");
  revalidatePath("/dashboard");
  redirect("/products");

}
