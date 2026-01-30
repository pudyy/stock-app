// src/app/actions/movements.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type MovementType = "IN" | "OUT";

export async function createMovement(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const type = String(formData.get("type") ?? "IN") as MovementType;
  const qty = Number(formData.get("qty") ?? 0);
  const reason = String(formData.get("reason") ?? "").trim();

  if (!productId) throw new Error("Missing productId");
  if (type !== "IN" && type !== "OUT") throw new Error("Invalid type");
  if (!Number.isInteger(qty) || qty <= 0)
    throw new Error("Qty must be an integer > 0");

  await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error("Product not found");

    const nextStock = type === "IN" ? product.stock + qty : product.stock - qty;
    if (nextStock < 0) throw new Error("Not enough stock for OUT");

    await tx.product.update({
      where: { id: productId },
      data: { stock: nextStock },
    });

    await tx.stockMovement.create({
      data: {
        productId,
        type,
        qty,
        reason: reason || null,
      },
    });
  });

  revalidatePath("/dashboard");
  revalidatePath("/movements");
  revalidatePath("/movements/history");
  revalidatePath("/products");
  revalidatePath("/search");
}

export async function deleteMovement(formData: FormData) {
  const movementId = String(formData.get("id") ?? "");
  if (!movementId) throw new Error("Missing movement id");

  await prisma.$transaction(async (tx) => {
    const movement = await tx.stockMovement.findUnique({
      where: { id: movementId },
      include: { product: true },
    });
    if (!movement) throw new Error("Movimentação não encontrada");

    // Reverte o estoque: IN tinha somado, então subtrai; OUT tinha subtraído, então soma
    const delta = movement.type === "IN" ? -movement.qty : movement.qty;
    const nextStock = movement.product.stock + delta;
    if (nextStock < 0)
      throw new Error(
        "Não é possível remover esta movimentação: o estoque atual do produto não permite reverter a entrada.",
      );

    await tx.product.update({
      where: { id: movement.productId },
      data: { stock: nextStock },
    });

    await tx.stockMovement.delete({
      where: { id: movementId },
    });
  });

  revalidatePath("/dashboard");
  revalidatePath("/movements");
  revalidatePath("/movements/history");
  revalidatePath("/products");
  revalidatePath("/search");
}
