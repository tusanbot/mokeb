import Link from "next/link";
import {
    ArrowRight,
    CalendarDays,
    Clock3,
    MapPin,
    Plus,
    Trash2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { formatPersianDateLong } from "@/lib/date";
import { DeleteProgramButton } from "@/components/admin/DeleteProgramButton";

export default async function AdminProgramsPage() {
    const supabase = await createClient();

    const { data: programs, error } = await supabase
        .from("programs")
        .select("*")
        .order("date", {
            ascending: true,
        });

    const items = programs ?? [];

    return (
        <main className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <header className="border-b border-[var(--border)] bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--primary)] transition hover:bg-[var(--primary-light)]"
                        >
                            <ArrowRight size={19} />
                        </Link>

                        <div>
                            <div className="flex items-center gap-2">
                                <CalendarDays
                                    size={20}
                                    className="text-[var(--gold)]"
                                />

                                <h1 className="text-xl font-black text-[var(--primary-dark)]">
                                    مدیریت برنامه‌ها
                                </h1>
                            </div>

                            <p className="mt-1 text-xs text-[var(--muted)]">
                                مدیریت برنامه‌ها و رویدادهای موکب
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/admin/programs/new"
                        className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--primary-dark)]"
                    >
                        <Plus size={18} />

                        <span className="hidden sm:inline">
                            برنامه جدید
                        </span>

                        <span className="sm:hidden">
                            افزودن
                        </span>
                    </Link>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Stats */}
                <div className="mb-8 grid gap-4 sm:grid-cols-3">
                    <StatCard
                        title="کل برنامه‌ها"
                        value={items.length}
                    />

                    <StatCard
                        title="برنامه‌های پیش‌رو"
                        value={
                            items.filter(
                                (item) =>
                                    item.status ===
                                    "upcoming"
                            ).length
                        }
                    />

                    <StatCard
                        title="برنامه‌های تکمیل‌شده"
                        value={
                            items.filter(
                                (item) =>
                                    item.status ===
                                    "completed"
                            ).length
                        }
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        دریافت برنامه‌ها با خطا مواجه شد.
                    </div>
                )}

                {/* Programs */}
                <section className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-sm">
                    <div className="border-b border-[var(--border)] px-5 py-5">
                        <h2 className="font-black text-[var(--primary-dark)]">
                            برنامه‌های موکب
                        </h2>

                        <p className="mt-1 text-xs text-[var(--muted)]">
                            فهرست برنامه‌های ثبت‌شده
                        </p>
                    </div>

                    {items.length === 0 ? (
                        <div className="px-5 py-16 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]">
                                <CalendarDays size={28} />
                            </div>

                            <h3 className="mt-4 font-black text-[var(--primary-dark)]">
                                هنوز برنامه‌ای ثبت نشده است
                            </h3>

                            <p className="mt-2 text-sm text-[var(--muted)]">
                                اولین برنامه موکب را ثبت کنید.
                            </p>

                            <Link
                                href="/admin/programs/new"
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white"
                            >
                                <Plus size={17} />

                                افزودن برنامه
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--border)]">
                            {items.map((program) => (
                                <ProgramRow
                                    key={program.id}
                                    program={program}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}


/* =========================================================
   Stat Card
========================================================= */

function StatCard({
    title,
    value,
}: {
    title: string;
    value: number;
}) {
    return (
        <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-[var(--muted)]">
                {title}
            </p>

            <p className="mt-3 text-2xl font-black text-[var(--primary-dark)]">
                {value.toLocaleString("fa-IR")}
            </p>
        </div>
    );
}


/* =========================================================
   Program Row
========================================================= */

function ProgramRow({
    program,
}: {
    program: {
        id: string;
        title: string;
        description: string;
        date: string;
        time?: string | null;
        location?: string | null;
        status: string;
    };
}) {
    const statusMap: Record<
        string,
        {
            label: string;
            className: string;
        }
    > = {
        upcoming: {
            label: "پیش‌رو",
            className:
                "bg-amber-50 text-amber-700",
        },

        active: {
            label: "در حال برگزاری",
            className:
                "bg-emerald-50 text-emerald-700",
        },

        completed: {
            label: "برگزار شده",
            className:
                "bg-slate-100 text-slate-600",
        },
    };

    const status =
        statusMap[program.status] ??
        statusMap.upcoming;

    return (
        <article className="px-5 py-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-black text-[var(--primary-dark)]">
                            {program.title}
                        </h3>

                        <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${status.className}`}
                        >
                            {status.label}
                        </span>
                    </div>

                    {program.description && (
                        <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                            {program.description}
                        </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-[var(--muted)]">
                        <span className="flex items-center gap-1.5">
                            <CalendarDays size={15} />

                            {formatPersianDateLong(
                                program.date
                            )}
                        </span>

                        {program.time && (
                            <span className="flex items-center gap-1.5">
                                <Clock3 size={15} />

                                {program.time}
                            </span>
                        )}

                        {program.location && (
                            <span className="flex items-center gap-1.5">
                                <MapPin size={15} />

                                {program.location}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <Link
                        href={`/admin/programs/${program.id}/edit`}
                        className="rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-bold text-[var(--primary)] transition hover:bg-[var(--primary-light)]"
                    >
                        ویرایش
                    </Link>

                    <DeleteProgramButton
                        programId={program.id}
                        programTitle={program.title}
                    />
                </div>
            </div>
        </article>
    );
}