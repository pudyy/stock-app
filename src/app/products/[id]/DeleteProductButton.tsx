"use client";

import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/actions/products";

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

export default function DeleteProductButton({
  productId,
}: {
  productId: string;
}) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 border border-red-900/60 bg-red-950/40 text-red-200 rounded px-3 py-2 hover:bg-red-950/70"
      >
        <Trash2 className="w-4 h-4" />
        Deletar
      </button>

      {/* Form real do delete (só é submetido ao confirmar) */}
      <form ref={formRef} action={deleteProduct}>
        <input type="hidden" name="id" value={productId} />
      </form>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que quer deletar?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação é permanente e não dá pra desfazer.
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
              Sim, deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
