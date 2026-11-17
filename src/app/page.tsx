import { desc } from "drizzle-orm";
import { db } from "@/db";
import { entries, goal } from "@/db/schema";
import EntryForm from "@/components/EntryForm";
import EntryList from "@/components/EntryList";
import GoalCard from "@/components/GoalCard";
import WeightChart from "@/components/WeightChart";
import LogoutButton from "@/components/LogoutButton";
import { daysToReach, linearRegression, predictedWeight } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [allEntries, goals] = await Promise.all([
    db.select().from(entries).orderBy(desc(entries.date)),
    db.select().from(goal).limit(1),
  ]);

  const points = [...allEntries]
    .reverse()
    .map((e) => ({ date: e.date, weight: e.weight }));

  const targetWeight = goals[0]?.targetWeight ?? null;
  const currentWeight = allEntries[0]?.weight ?? null;
  const startingWeight = points[0]?.weight ?? null;

  const regression = linearRegression(points);
  const chartData = points.map((p) => ({
    ...p,
    trend: regression ? predictedWeight(regression, p.date) : undefined,
  }));
  const lbsPerWeek = regression ? regression.slope * 7 : null;
  const daysToGoal =
    regression && targetWeight != null
      ? daysToReach(regression, new Date().toISOString().slice(0, 10), targetWeight)
      : null;

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-8 dark:bg-neutral-950 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Weight Tracker
          </h1>
          <LogoutButton />
        </header>

        <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Trend
          </h2>
          <WeightChart data={chartData} targetWeight={targetWeight} />
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <GoalCard
            targetWeight={targetWeight}
            currentWeight={currentWeight}
            startingWeight={startingWeight}
            lbsPerWeek={lbsPerWeek}
            daysToGoal={daysToGoal}
          />
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Log an entry
          </h2>
          <EntryForm />
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            History
          </h2>
          <EntryList entries={allEntries} />
        </section>
      </div>
    </div>
  );
}
