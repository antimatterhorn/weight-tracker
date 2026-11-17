import { clearGoal, setGoal } from "@/lib/actions";

function formatProjectedDate(daysFromNow: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + Math.round(daysFromNow));
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function GoalCard({
  targetWeight,
  currentWeight,
  startingWeight,
  lbsPerWeek,
  daysToGoal,
}: {
  targetWeight: number | null;
  currentWeight: number | null;
  startingWeight: number | null;
  lbsPerWeek: number | null;
  daysToGoal: number | null;
}) {
  const diff =
    targetWeight != null && currentWeight != null
      ? currentWeight - targetWeight
      : null;

  const percentLost =
    startingWeight != null && currentWeight != null && startingWeight !== 0
      ? ((startingWeight - currentWeight) / startingWeight) * 100
      : null;

  return (
    <div className="space-y-3">
      {targetWeight != null ? (
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Goal weight</p>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                {targetWeight}
              </p>
              {diff != null && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {diff > 0
                    ? `${diff.toFixed(1)} to go`
                    : diff < 0
                      ? `${Math.abs(diff).toFixed(1)} past goal`
                      : "At goal"}
                  {percentLost != null && (
                    <>
                      {" · "}
                      {percentLost > 0
                        ? `${percentLost.toFixed(1)}% lost`
                        : percentLost < 0
                          ? `${Math.abs(percentLost).toFixed(1)}% gained`
                          : "no change"}
                    </>
                  )}
                </p>
              )}
            </div>
            {lbsPerWeek != null && Math.abs(lbsPerWeek) >= 0.05 && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Trending {lbsPerWeek < 0 ? "down" : "up"}{" "}
                {Math.abs(lbsPerWeek).toFixed(1)} lbs/week
              </p>
            )}
            {diff != null && diff > 0 && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {daysToGoal != null
                  ? `At this rate: ~${Math.round(daysToGoal)} days (${(daysToGoal / 7).toFixed(1)} wks) to goal — around ${formatProjectedDate(daysToGoal)}`
                  : "Trend isn't heading toward your goal yet."}
              </p>
            )}
          </div>
          <form action={clearGoal}>
            <button
              type="submit"
              className="text-xs text-neutral-500 hover:underline dark:text-neutral-400"
            >
              Clear
            </button>
          </form>
        </div>
      ) : (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No goal set.
        </p>
      )}
      <form action={setGoal} className="flex items-end gap-2">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="targetWeight"
            className="text-xs font-medium text-neutral-600 dark:text-neutral-400"
          >
            {targetWeight != null ? "Update goal" : "Set a goal"}
          </label>
          <input
            id="targetWeight"
            name="targetWeight"
            type="number"
            step="0.1"
            min="0"
            required
            placeholder="170.0"
            className="w-28 rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
          />
        </div>
        <button
          type="submit"
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium dark:border-neutral-700"
        >
          Save
        </button>
      </form>
    </div>
  );
}
