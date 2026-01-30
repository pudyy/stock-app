"use client";

import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteMovement } from "@/app/actions/movements";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DeleteMovementButton({
  movementId,
  productName,
  type,
  qty,
}: {
  movementId: string;
  productName: string;
  type: "IN" | "OUT";
  qty: number;
}) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const typeLabel = type === "IN" ? "Entrada" : "Saída";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-1.5 border border-neutral-700 rounded-lg px-3 py-2.5 min-h-[44px] text-neutral-400 hover:text-red-300 hover:border-red-900/60 hover:bg-red-950/30 transition-colors touch-manipulation"
        title="Remover movimentação"
      >
        <Trash2 className="w-4 h-4 shrink-0" />
        <span className="text-sm">Remover</span>
      </button>

      <form ref={formRef} action={deleteMovement}>
        <input type="hidden" name="id" value={movementId} />
      </form>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover esta movimentação?</AlertDialogTitle>
            <AlertDialogDescription>
              A movimentação &quot;{typeLabel}&quot; de {qty} un. de {productName} será
              removida e o estoque do produto será ajustado automaticamente. Essa ação
              não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="text-black">
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => formRef.current?.requestSubmit()}
            >
              Sim, remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
