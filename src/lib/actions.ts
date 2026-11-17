"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { entries, goal } from "@/db/schema";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
} from "@/lib/auth";

export async function login(formData: FormData): Promise<{ error?: string }> {
  const password = formData.get("password");
  const expected = process.env.APP_PASSWORD;

  if (!expected) {
    return { error: "Server is misconfigured: APP_PASSWORD is not set." };
  }

  if (typeof password !== "string" || password !== expected) {
    return { error: "Incorrect password." };
  }

  const token = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect("/");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}

export async function addEntry(formData: FormData): Promise<void> {
  const date = formData.get("date");
  const weightRaw = formData.get("weight");
  const noteRaw = formData.get("note");

  if (typeof date !== "string" || !date) {
    throw new Error("Date is required.");
  }
  const weight = Number(weightRaw);
  if (!Number.isFinite(weight) || weight <= 0) {
    throw new Error("Weight must be a positive number.");
  }
  const note =
    typeof noteRaw === "string" && noteRaw.trim() ? noteRaw.trim() : null;

  await db
    .insert(entries)
    .values({ date, weight, note })
    .onConflictDoUpdate({
      target: entries.date,
      set: { weight, note },
    });

  revalidatePath("/");
}

export async function deleteEntry(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;

  await db.delete(entries).where(eq(entries.id, id));
  revalidatePath("/");
}

export async function setGoal(formData: FormData): Promise<void> {
  const targetWeight = Number(formData.get("targetWeight"));
  if (!Number.isFinite(targetWeight) || targetWeight <= 0) {
    throw new Error("Goal weight must be a positive number.");
  }

  const existing = await db.select({ id: goal.id }).from(goal).limit(1);

  if (existing.length > 0) {
    await db
      .update(goal)
      .set({ targetWeight, updatedAt: sql`CURRENT_TIMESTAMP` })
      .where(eq(goal.id, existing[0].id));
  } else {
    await db.insert(goal).values({ targetWeight });
  }

  revalidatePath("/");
}

export async function clearGoal(): Promise<void> {
  await db.delete(goal);
  revalidatePath("/");
}
