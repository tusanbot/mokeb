import Header from "@/components/public/Header";
import Hero from "@/components/public/Hero";
import GoalsSection from "@/components/public/GoalsSection";
import DonationsSection from "@/components/public/DonationsSection";
import ProgramsSection from "@/components/public/ProgramsSection";
import Footer from "@/components/public/Footer";

import { goals as fallbackGoals, donations } from "@/data/mokeb-data";
import type { Goal } from "@/types/mokeb";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const [{ data: programs }, { data: dbGoals }] = await Promise.all([
    supabase
      .from("programs")
      .select("id, title, description, date, time, location, status")
      .order("date", { ascending: true }),
    supabase
      .from("goals")
      .select("id, title, description, budget, spent, progress, status, sub_goals(id, title, description, budget, spent, progress, completed)")
      .order("created_at", { ascending: true }),
  ]);

  const goals: Goal[] = dbGoals?.map((goal) => ({
    id: goal.id,
    title: goal.title,
    description: goal.description ?? "",
    budget: Number(goal.budget),
    spent: Number(goal.spent),
    progress: Number(goal.progress),
    status: goal.status,
    subGoals: (goal.sub_goals ?? []).map((sub) => ({
      id: sub.id,
      title: sub.title,
      description: sub.description ?? "",
      budget: Number(sub.budget),
      spent: Number(sub.spent),
      progress: Number(sub.progress),
      completed: Boolean(sub.completed),
    })),
  })) ?? fallbackGoals;

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <GoalsSection goals={goals} />
        <DonationsSection donations={donations} />
        <ProgramsSection programs={programs ?? []} />
      </main>
      <Footer />
    </div>
  );
}
