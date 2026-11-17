import { deleteEntry } from "@/lib/actions";

type Entry = {
  id: number;
  date: string;
  weight: number;
  note: string | null;
};

export default function EntryList({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        No entries yet.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
          <tr>
            <th className="px-3 py-2">Date</th>
            <th className="px-3 py-2">Weight</th>
            <th className="px-3 py-2">Note</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className="px-3 py-2 whitespace-nowrap">{entry.date}</td>
              <td className="px-3 py-2 whitespace-nowrap">{entry.weight}</td>
              <td className="px-3 py-2 text-neutral-500 dark:text-neutral-400">
                {entry.note ?? ""}
              </td>
              <td className="px-3 py-2 text-right">
                <form action={deleteEntry}>
                  <input type="hidden" name="id" value={entry.id} />
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:underline dark:text-red-400"
                  >
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
