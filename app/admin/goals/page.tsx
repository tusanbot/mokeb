import Link from "next/link";
import { ArrowRight, CheckCircle2, Pencil, Plus, Target, Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import DeleteGoalButton from "@/components/admin/DeleteGoalButton";

export default async function AdminGoalsPage() {
    const supabase = await createClient();

    const { data: goals, error } = await supabase
        .from("goals")
        .select("id, title, description, budget, spent, progress, status, sub_goals(id, title, budget, spent, progress, completed)")
        .order("created_at", { ascending: false });

    const items = goals ?? [];

    return (
        <main className="min-h-screen bg-[var(--background)]">
            <header className="border-b border-[var(--border)] bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--primary)] hover:bg-[var(--primary-light)]">
                            <ArrowRight size={19} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <Target size={20} className="text-[var(--gold)]" />
                                <h1 className="text-xl font-black text-[var(--primary-dark)]">مدیریت اهداف</h1>
                            </div>
                            <p className="mt-1 text-xs text-[var(--muted)]">مدیریت اهداف، بودجه، پیشرفت و ریزاهداف موکب</p>
                        </div>
                    </div>
                    <Link href="/admin/goals/new" className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-white hover:bg-[var(--primary-dark)]">
                        <Plus size={18} />
                        <span className="hidden sm:inline">هدف جدید</span>
                        <span className="sm:hidden">افزودن</span>
                    </Link>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 grid gap-4 sm:grid-cols-3">
                    <StatCard title="کل اهداف" value={items.length} />
                    <StatCard title="اهداف در حال اجرا" value={items.filter((item) => item.status === "active").length} />
                    <StatCard title="اهداف تکمیل‌شده" value={items.filter((item) => item.status === "completed").length} />
                </div>

                {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">دریافت اهداف با خطا مواجه شد. ابتدا ساختار دیتابیس اهداف را اجرا کنید.</div>}

                <section className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-sm">
                    <div className="border-b border-[var(--border)] px-5 py-5">
                        <h2 className="font-black text-[var(--primary-dark)]">اهداف موکب</h2>
                        <p className="mt-1 text-xs text-[var(--muted)]">فهرست اهداف ثبت‌شده و ریزاهداف هر کدام</p>
                    </div>

                    {items.length === 0 ? (
                        <div className="px-5 py-16 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]"><Target size={28} /></div>
                            <h3 className="mt-4 font-black text-[var(--primary-dark)]">هنوز هدفـی ثبت نشده است</h3>
                            <p className="mt-2 text-sm text-[var(--muted)]">اولین هدف موکب را ثبت کنید.</p>
                            <Link href="/admin/goals/new" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white"><Plus size={17} /> افزودن هدف</Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--border)]">
                            {items.map((goal) => {
                                const subGoals = Array.isArray(goal.sub_goals) ? goal.sub_goals : [];
                                const status = statusConfig[goal.status as keyof typeof statusConfig] ?? statusConfig.planning;
                                return (
                                    <article key={goal.id} className="p-5 sm:p-6">
                                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-base font-black text-[var(--primary-dark)]">{goal.title}</h3>
                                                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${status.className}`}>{status.label}</span>
                                                </div>
                                                {goal.description && <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--muted)]">{goal.description}</p>}

                                                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                                    <Metric label="بودجه" value={Number(goal.budget)} />
                                                    <Metric label="هزینه‌شده" value={Number(goal.spent)} />
                                                    <div className="rounded-2xl bg-[var(--primary-light)] p-4">
                                                        <p className="text-xs text-[var(--muted)]">پیشرفت</p>
                                                        <p className="mt-2 text-lg font-black text-[var(--primary)]">{Number(goal.progress).toLocaleString("fa-IR")}٪</p>
                                                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${Math.min(Math.max(Number(goal.progress), 0), 100)}%` }} /></div>
                                                    </div>
                                                </div>

                                                {subGoals.length > 0 && (
                                                    <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                                                        <div className="mb-3 flex items-center justify-between"><span className="text-xs font-black text-[var(--primary-dark)]">ریـزاهداف</span><span className="text-xs text-[var(--muted)]">{subGoals.length.toLocaleString("fa-IR")} مورد</span></div>
                                                        <div className="space-y-2">
                                                            {subGoals.map((sub) => (
                                                                <div key={sub.id} className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2.5">
                                                                    <div className="flex min-w-0 items-center gap-2"><CheckCircle2 size={15} className={sub.completed ? "text-[var(--primary)]" : "text-[var(--muted)]"} /><span className="truncate text-xs font-bold text-[var(--primary-dark)]">{sub.title}</span></div>
                                                                    <span className="shrink-0 text-[11px] font-bold text-[var(--primary)]">{Number(sub.progress).toLocaleString("fa-IR")}٪</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex shrink-0 items-center gap-2">
                                                <Link href={`/admin/goals/${goal.id}/edit`} className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-bold text-[var(--primary)] hover:bg-[var(--primary-light)]"><Pencil size={15} /> ویرایش</Link>
                                                <DeleteGoalButton goalId={goal.id} goalTitle={goal.title} />
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

function StatCard({ title, value }: { title: string; value: number }) {
    return <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm"><p className="text-sm font-bold text-[var(--muted)]">{title}</p><p className="mt-3 text-2xl font-black text-[var(--primary-dark)]">{value.toLocaleString("fa-IR")}</p></div>;
}

function Metric({ label, value }: { label: string; value: number }) {
    return <div className="rounded-2xl bg-[var(--surface-muted)] p-4"><p className="text-xs text-[var(--muted)]">{label}</p><p className="mt-2 text-sm font-black text-[var(--primary-dark)]">{value.toLocaleString("fa-IR")} <span className="text-[11px] font-normal text-[var(--muted)]">تومان</span></p></div>;
}

const statusConfig = {
    planning: { label: "در حال برنامه‌ریزی", className: "bg-amber-50 text-amber-700" },
    active: { label: "در حال اجرا", className: "bg-emerald-50 text-emerald-700" },
    completed: { label: "تکمیل شده", className: "bg-blue-50 text-blue-700" },
};
