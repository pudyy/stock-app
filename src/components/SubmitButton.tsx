"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-white text-black rounded px-3 py-2 disabled:opacity-60"
    >
      {pending ? "Salvando..." : label}
    </button>
  );
}
