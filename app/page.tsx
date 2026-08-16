import Header from "@/components/public/Header";
import Hero from "@/components/public/Hero";
import GoalsSection from "@/components/public/GoalsSection";
import DonationsSection from "@/components/public/DonationsSection";
import ProgramsSection from "@/components/public/ProgramsSection";
import Footer from "@/components/public/Footer";

import {
  goals,
  donations,
} from "@/data/mokeb-data";

import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data: programs } = await supabase
    .from("programs")
    .select(
      "id, title, description, date, time, location, status"
    )
    .order("date", {
      ascending: true,
    });

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <Hero />

        <GoalsSection goals={goals} />

        <DonationsSection donations={donations} />

        <ProgramsSection
          programs={programs ?? []}
        />
      </main>

      <Footer />
    </div>
  );
}