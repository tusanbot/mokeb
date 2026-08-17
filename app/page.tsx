import Header from "@/components/public/Header";
import Hero from "@/components/public/Hero";
import GoalsSection from "@/components/public/GoalsSection";
import DonationsSection from "@/components/public/DonationsSection";
import ProgramsSection from "@/components/public/ProgramsSection";
import Footer from "@/components/public/Footer";

import { goals } from "@/data/mokeb-data";

import { createClient } from "@/lib/supabase/server";
import type { Donation } from "@/types/mokeb";

export default async function Home() {
  const supabase = await createClient();

  const [
    donationsResult,
    programsResult,
  ] = await Promise.all([
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