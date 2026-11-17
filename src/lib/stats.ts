export type Point = { date: string; weight: number };

export type Regression = {
  slope: number; // lbs per day
  intercept: number;
  firstDate: string;
};

function dayOffset(date: string, firstDate: string): number {
  const first = Date.parse(`${firstDate}T00:00:00Z`);
  const d = Date.parse(`${date}T00:00:00Z`);
  return (d - first) / 86_400_000;
}

export function linearRegression(points: Point[]): Regression | null {
  if (points.length < 2) return null;

  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));
  const firstDate = sorted[0].date;
  const xs = sorted.map((p) => dayOffset(p.date, firstDate));
  const ys = sorted.map((p) => p.weight);
  const n = xs.length;

  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((acc, x, i) => acc + x * ys[i], 0);
  const sumXX = xs.reduce((acc, x) => acc + x * x, 0);

  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return null; // all entries on the same day

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept, firstDate };
}

export function predictedWeight(reg: Regression, date: string): number {
  return reg.slope * dayOffset(date, reg.firstDate) + reg.intercept;
}

/** Days from `fromDate` until the regression line crosses targetWeight. Null if the trend never reaches it. */
export function daysToReach(
  reg: Regression,
  fromDate: string,
  targetWeight: number,
): number | null {
  if (reg.slope === 0) return null;
  const xFrom = dayOffset(fromDate, reg.firstDate);
  const xTarget = (targetWeight - reg.intercept) / reg.slope;
  const days = xTarget - xFrom;
  return days > 0 ? days : null;
}
