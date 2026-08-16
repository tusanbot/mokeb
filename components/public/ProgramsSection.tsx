import {
    CalendarDays,
    ChevronLeft,
    Sparkles,
} from "lucide-react";

import type { Program } from "@/types/mokeb";
import ProgramCard from "./ProgramCard";

type ProgramsSectionProps = {
    programs: Program[];
};

export default function ProgramsSection({
    programs,
}: ProgramsSectionProps) {
    console.log("PROGRAMS FROM SUPABASE:", programs);
    const upcomingPrograms = programs.filter(
        (program) => program.status !== "completed"
    );

    return (
        <section
            id="programs"
            className="section bg-[var(--background)]"
        >
            <div className="container">
                {/* Header */}
                <div className="section-header">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--primary-light)] px-4 py-2 text-xs font-bold text-[var(--primary)]">
                        <Sparkles size={14} />

                        <span>
                            تقویم خدمت
                        </span>
                    </div>

                    <h2 className="section-title">
                        برنامه‌های آتی موکب
                    </h2>

                    <p className="section-description">
                        برنامه‌های پیش‌رو، مراسم‌ها و فعالیت‌های موکب را از این بخش
                        دنبال کنید.
                    </p>
                </div>

                {/* Timeline */}
                {upcomingPrograms.length > 0 ? (
                    <div className="relative mx-auto max-w-4xl">
                        {/* Vertical Line */}
                        <div
                            className="absolute right-[38px] top-6 bottom-6 hidden w-px bg-[var(--border)] sm:block"
                            aria-hidden="true"
                        />

                        <div className="space-y-4">
                            {upcomingPrograms.map((program) => (
                                <div
                                    key={program.id}
                                    className="relative sm:pr-20"
                                >
                                    {/* Timeline Dot */}
                                    <div
                                        className="absolute right-[30px] top-8 z-10 hidden h-4 w-4 rounded-full border-4 border-[var(--background)] bg-[var(--gold)] sm:block"
                                        aria-hidden="true"
                                    />

                                    <ProgramCard program={program} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-[var(--border)] bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
                            <CalendarDays size={24} />
                        </div>

                        <h3 className="mt-5 text-lg font-bold text-[var(--primary-dark)]">
                            برنامه‌ای برای نمایش وجود ندارد
                        </h3>

                        <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                            برنامه‌های آینده موکب پس از ثبت در این بخش نمایش داده خواهند شد.
                        </p>
                    </div>
                )}

                {/* More Programs Hint */}
                {upcomingPrograms.length > 0 && (
                    <div className="mt-8 flex justify-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2.5 text-xs text-[var(--muted)]">
                            <span>
                                برنامه‌ها با توجه به زمان‌بندی موکب به‌روزرسانی می‌شوند
                            </span>

                            <ChevronLeft
                                size={14}
                                className="text-[var(--primary)]"
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}