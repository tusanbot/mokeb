"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, Plus, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type SubGoal = {
    id?: string;
    title: string;
    description: string;
    budget: string;
    spent: string;
    progress: string;
    completed: boolean;
};

type GoalFormProps = {
    mode: "create" | "edit";
    goalId?: string;
    initial?: {
        title: string;
        description: string;
        budget: string;
        spent: string;
        progress: string;
        status: "planning" | "active" | "completed";
        subGoals: SubGoal[];
    };
};

const emptySubGoal = (): SubGoal => ({
    title: "",
    description: "",
    budget: "0",
    spent: "0",
    progress: "0",
    completed: false,
});

export default function GoalForm({ mode, goalId, initial }: GoalFormProps) {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [budget, setBudget] = useState(initial?.budget ?? "0");
    const [spent, setSpent] = useState(initial?.spent ?? "0");
    const [progress, setProgress] = useState(initial?.progress ?? "0");
    const [status, setStatus] = useState<"planning" | "active" | "completed">(initial?.status ?? "planning");
    const [subGoals, setSubGoals] = useState<SubGoal[]>(initial?.subGoals ?? []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function updateSubGoal(index: number, patch: Partial<SubGoal>) {
        setSubGoals((items) => items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const cleanTitle = title.trim();
        const goalBudget = Number(budget);

        if (!cleanTitle) return setError("عنوان هدف را وارد کنید.");
        if (!Number.isFinite(goalBudget) || goalBudget < 0) return setError("بودجه هدف نامعتبر است.");

        const cleanedSubGoals = subGoals
            .filter((item) => item.title.trim())
            .map((item) => ({
                id: item.id,
                title: item.title.trim(),
                description: item.description.trim(),
                budget: Number(item.budget) || 0,
                spent: Number(item.spent) || 0,
                progress: Math.min(Math.max(Number(item.progress) || 0, 0), 100),
                completed: item.completed,
            }));

        if (cleanedSubGoals.some((item) => item.budget < 0 || item.spent < 0)) {
            return setError("بودجه و هزینه ریزاهداف نمی‌تواند منفی باشد.");
        }

        setLoading(true);

        try {
            const supabase = createClient();
            let currentGoalId = goalId;

            if (mode === "create") {
                const { data, error } = await supabase
                    .from("goals")
                    .insert({
                        title: cleanTitle,
                        description: description.trim(),
                        budget: goalBudget,
                        status,
                    })
                    .select("id")
                    .single();

                if (error) throw error;
                currentGoalId = data.id;
            } else {
                if (!currentGoalId) throw new Error("شناسه هدف مشخص نیست.");

                // spent و progress مالی عمداً اینجا تغییر داده نمی‌شوند.
                // این دو مقدار توسط تراکنش‌های هزینه و trigger دیتابیس محاسبه می‌شوند.
                const { error } = await supabase
                    .from("goals")
                    .update({
                        title: cleanTitle,
                        description: description.trim(),
                        budget: goalBudget,
                        status,
                    })
                    .eq("id", currentGoalId);

                if (error) throw error;

                const { error: deleteError } = await supabase
                    .from("sub_goals")
                    .delete()
                    .eq("goal_id", currentGoalId);

                if (deleteError) throw deleteError;
            }

            if (currentGoalId && cleanedSubGoals.length > 0) {
                const { error } = await supabase.from("sub_goals").insert(
                    cleanedSubGoals.map((item) => ({
                        goal_id: currentGoalId,
                        title: item.title,
                        description: item.description,
                        budget: item.budget,
                        spent: item.spent,
                        progress: item.progress,
                        completed: item.completed,
                    }))
                );

                if (error) throw error;
            }

            window.location.href = "/admin/goals";
        } catch (err) {
            console.error("GOAL SAVE ERROR:", err);
            setError(err instanceof Error ? err.message : "ذخیره هدف با خطا مواجه شد.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[var(--background)]">
            <header className="border-b border-[var(--border)] bg-white">
                <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-5 sm:px-6">
                    <Link href="/admin/goals" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--primary)] hover:bg-[var(--primary-light)]">
                        <ArrowRight size={19} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-[var(--primary-dark)]">
                            {mode === "create" ? "ثبت هدف جدید" : "ویرایش هدف"}
                        </h1>
                        <p className="mt-1 text-xs text-[var(--muted)]">هدف و ریزاهداف مربوط به آن را مدیریت کنید.</p>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <section className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-7">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="عنوان هدف" value={title} onChange={setTitle} placeholder="مثلاً: خدمت‌رسانی به زائران" className="sm:col-span-2" />
                            <Field label="بودجه هدف (تومان)" value={budget} onChange={setBudget} type="number" />

                            <div>
                                <label className="mb-2 block text-sm font-bold text-[var(--primary-dark)]">هزینه‌شده (خودکار)</label>
                                <input
                                    type="text"
                                    value={`${Number(spent).toLocaleString("fa-IR")} تومان`}
                                    disabled
                                    className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm text-[var(--muted)] outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-[var(--primary-dark)]">پیشرفت مالی (خودکار)</label>
                                <input
                                    type="text"
                                    value={`${Number(progress).toLocaleString("fa-IR")}٪`}
                                    disabled
                                    className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm text-[var(--muted)] outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-[var(--primary-dark)]">وضعیت</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--primary)]">
                                    <option value="planning">در حال برنامه‌ریزی</option>
                                    <option value="active">در حال اجرا</option>
                                    <option value="completed">تکمیل شده</option>
                                </select>
                            </div>

                            <div className="rounded-2xl border border-[var(--primary)]/15 bg-[var(--primary-light)] p-4 text-xs leading-6 text-[var(--primary-dark)] sm:col-span-2">
                                هزینه‌شده و پیشرفت مالی این هدف از روی هزینه‌هایی که هنگام ثبت، به این هدف متصل می‌شوند محاسبه خواهد شد و نیازی به ورود دستی آنها نیست.
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-sm font-bold text-[var(--primary-dark)]">توضیحات</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-7 outline-none focus:border-[var(--primary)]" placeholder="توضیحات هدف..." />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-7">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="font-black text-[var(--primary-dark)]">ریـزاهداف</h2>
                                <p className="mt-1 text-xs text-[var(--muted)]">مراحل و بخش‌های کوچک‌تر این هدف را ثبت کنید.</p>
                            </div>
                            <button type="button" onClick={() => setSubGoals((items) => [...items, emptySubGoal()])} className="flex items-center gap-2 rounded-xl bg-[var(--primary-light)] px-4 py-2.5 text-xs font-bold text-[var(--primary)]">
                                <Plus size={16} /> افزودن ریزهدف
                            </button>
                        </div>

                        {subGoals.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">هنوز ریزهدفی اضافه نشده است.</div>
                        ) : (
                            <div className="space-y-4">
                                {subGoals.map((item, index) => (
                                    <div key={index} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                                        <div className="mb-4 flex items-center justify-between">
                                            <span className="text-xs font-black text-[var(--primary)]">ریزهدف {index + 1}</span>
                                            <button type="button" onClick={() => setSubGoals((items) => items.filter((_, i) => i !== index))} className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"><Trash2 size={17} /></button>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <Field label="عنوان" value={item.title} onChange={(value) => updateSubGoal(index, { title: value })} className="sm:col-span-2" />
                                            <Field label="بودجه" value={item.budget} onChange={(value) => updateSubGoal(index, { budget: value })} type="number" />
                                            <Field label="هزینه‌شده" value={item.spent} onChange={(value) => updateSubGoal(index, { spent: value })} type="number" />
                                            <Field label="پیشرفت" value={item.progress} onChange={(value) => updateSubGoal(index, { progress: value })} type="number" min={0} max={100} />
                                            <label className="flex h-12 items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 text-sm font-bold text-[var(--primary-dark)]">
                                                <input type="checkbox" checked={item.completed} onChange={(e) => updateSubGoal(index, { completed: e.target.checked })} className="h-4 w-4 accent-[var(--primary)]" />
                                                تکمیل شده
                                            </label>
                                            <div className="sm:col-span-2">
                                                <label className="mb-2 block text-xs font-bold text-[var(--primary-dark)]">توضیحات</label>
                                                <textarea value={item.description} onChange={(e) => updateSubGoal(index, { description: e.target.value })} rows={2} className="w-full resize-none rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--primary)]" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">{error}</div>}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link href="/admin/goals" className="flex h-12 items-center justify-center rounded-xl border border-[var(--border)] bg-white px-6 text-sm font-bold text-[var(--primary-dark)]">انصراف</Link>
                        <button disabled={loading} type="submit" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-7 text-sm font-bold text-white hover:bg-[var(--primary-dark)] disabled:opacity-60">
                            <Save size={18} /> {loading ? "در حال ذخیره..." : "ذخیره هدف"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

function Field({ label, value, onChange, placeholder, type = "text", min, max, className = "" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; min?: number; max?: number; className?: string }) {
    return (
        <div className={className}>
            <label className="mb-2 block text-sm font-bold text-[var(--primary-dark)]">{label}</label>
            <input type={type} min={min} max={max} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--primary)]" />
        </div>
    );
}
