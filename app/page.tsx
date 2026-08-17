import Header from "@/components/public/Header";
import Hero from "@/components/public/Hero";
import GoalsSection from "@/components/public/GoalsSection";
import DonationsSection from "@/components/public/DonationsSection";
import ProgramsSection from "@/components/public/ProgramsSection";
import Footer from "@/components/public/Footer";

import { createClient } from "@/lib/supabase/server";
import type { Donation, Goal } from "@/types/mokeb";

export default async function Home() {
  const supabase = await createClient();

  const [
    goalsResult,
    donationsResult,
    programsResult,
  ] = await Promise.all([
    supabase
      .from("goals")
      .select(
        "id, title, description, budget, spent, progress, status, sub_goals(id, title, description, budget, spent, progress, completed)"
      )
      .order("created_at", {
        ascending: true,
      }),

    supabase
      .from("donations")
      .select(
        "id, donor_name, type, amount, description, date"
      )
      .order("date", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      }),

    supabase
      .from("programs")
      .select(
        "id, title, description, date, time, location, status"
      )
      .order("date", {
        ascending: true,
      }),
  ]);

  if (goalsResult.error) {
    console.error("HOME GOALS FETCH ERROR:", goalsResult.error);
  }

  const goals: Goal[] = (goalsResult.data ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description ?? "",
    budget: Number(item.budget ?? 0),
    spent: Number(item.spent ?? 0),
    progress: Number(item.progress ?? 0),
    status: item.status as Goal["status"],
    subGoals: (item.sub_goals ?? []).map((subGoal) => ({
      id: subGoal.id,
      title: subGoal.title,
      description: subGoal.description ?? "",
      budget: Number(subGoal.budget ?? 0),
      spent: Number(subGoal.spent ?? 0),
      progress: Number(subGoal.progress ?? 0),
      completed: Boolean(subGoal.completed),
    })),
  }));

  const donations: Donation[] =
    (donationsResult.data ?? []).map((item) => ({
      id: item.id,
      donorName: item.donor_name ?? undefined,
      type: item.type as Donation["type"],
      amount:
        item.amount !== null
          ? Number(item.amount)
          : undefined,
      description:
        item.description ?? "",
      date: item.date,
    }));

  const programs = programsResult.data ?? [];

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <Hero />

        <GoalsSection goals={goals} />

        <DonationsSection
          donations={donations}
        />

        <ProgramsSection
          programs={programs}
        />
      </main>

      <Footer />
    </div>
  );
}