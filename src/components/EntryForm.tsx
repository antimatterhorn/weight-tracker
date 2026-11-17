"use client";

import { useEffect, useRef } from "react";
import { addEntry } from "@/lib/actions";

function todayLocalISODate(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export default function EntryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const today = todayLocalISODate();
    if (dateInputRef.current) {
      dateInputRef.current.value = today;
      dateInputRef.current.max = today;
    }
  }, []);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addEntry(formData);
        formRef.current?.reset();
      }}
      className="flex flex-wrap items-end gap-3"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="date" className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
          Date
        </label>
        <input
          ref={dateInputRef}
          id="date"
          name="date"
          type="date"
          required
          className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="weight" className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
          Weight
        </label>
        <input
          id="weight"
          name="weight"
          type="number"
          step="0.1"
          min="0"
          required
          placeholder="180.0"
          className="w-28 rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        />
      </div>
      <div className="flex flex-1 min-w-[160px] flex-col gap-1">
        <label htmlFor="note" className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
          Note (optional)
        </label>
        <input
          id="note"
          name="note"
          type="text"
          placeholder="after workout"
          className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
      >
        Add
      </button>
    </form>
  );
}
