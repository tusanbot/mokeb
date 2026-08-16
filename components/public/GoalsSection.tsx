import type { Goal } from "@/types/mokeb";
import GoalCard from "./GoalCard";

type GoalsSectionProps = {
    goals: Goal[];
};

export default function GoalsSection({ goals }: GoalsSectionProps) {
    const totalBudget = goals.reduce((sum, goal) => sum + goal.budget, 0);
    const totalSpent = goals.reduce((sum, goal) => sum + goal.spent, 0);

    const overallProgress =
        totalBudget > 0
            ? Math.round((totalSpent / totalBudget) * 100)
            : 0;

    return (
        <section id="goals" className="section bg-[var(--background)]">
            <div className="container">
                {/* Section Header */}
                <div className="section-header">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--primary-light)] px-4 py-2 text-xs font-bold text-[var(--primary)]">
                        <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                        اهداف و مسیر خدمت
                    </div>

                    <h2 className="section-title">
                        اهداف موکب خادم الرضا(ع)
                    </h2>

                    <p className="section-description">
                        هر هدف، بخشی از مسیر خدمت ماست. در این بخش می‌توانید اهداف،
                        میزان پیشرفت، بودجه و ریزاهداف هر بخش را مشاهده کنید.
                    </p>
                </div>

                {/* Summary */}
                <div className="mb-10 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm">
                        <div className="text-sm text-[var(--muted)]">
                            تعداد اهداف
                        </div>

                        <div className="mt-2 text-2xl font-black text-[var(--primary-dark)]">
                            {goals.length.toLocaleString("fa-IR")}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm">
                        <div className="text-sm text-[var(--muted)]">
                            مجموع بودجه
                        </div>

                        <div className="mt-2 text-xl font-black text-[var(--primary-dark)]">
                            {totalBudget.toLocaleString("fa-IR")}
                            <span className="mr-1 text-xs font-normal text-[var(--muted)]">
                                تومان
                            </span>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm">
                        <div className="text-sm text-[var(--muted)]">
                            پیشرفت مالی کلی
                        </div>

                        <div className="mt-2 text-xl font-black text-[var(--primary)]">
                            {overallProgress.toLocaleString("fa-IR")}٪
                        </div>
                    </div>
                </div>

                {/* Goals */}
                {goals.length > 0 ? (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {goals.map((goal) => (
                            <GoalCard key={goal.id} goal={goal} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary-light)] text-xl text-[var(--primary)]">
                            ✦
                        </div>

                        <h3 className="mt-5 text-lg font-bold text-[var(--primary-dark)]">
                            هنوز هدف فعالی ثبت نشده است
                        </h3>

                        <p className="mt-2 text-sm text-[var(--muted)]">
                            اهداف موکب پس از ثبت در این بخش نمایش داده خواهند شد.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}