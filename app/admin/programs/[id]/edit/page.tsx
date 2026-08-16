"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    ArrowRight,
    CalendarDays,
    Clock3,
    MapPin,
    Save,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import PersianDatePicker from "@/components/admin/PersianDatePicker";

type Program = {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string | null;
    location: string | null;
    status: "upcoming" | "active" | "completed";
};

export default function EditProgramPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const [programId, setProgramId] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] =
        useState<Program["status"]>("upcoming");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        async function loadProgram() {
            const { id } = await params;

            setProgramId(id);

            const supabase = createClient();

            const { data, error } = await supabase
                .from("programs")
                .select("*")
                .eq("id", id)
                .single();

            if (error || !data) {
                setError(
                    "برنامه موردنظر پیدا نشد."
                );

                setLoading(false);
                return;
            }

            setTitle(data.title ?? "");
            setDescription(
                data.description ?? ""
            );
            setDate(data.date ?? "");
            setTime(data.time ?? "");
            setLocation(data.location ?? "");
            setStatus(
                data.status ?? "upcoming"
            );

            setLoading(false);
        }

        loadProgram();
    }, [params]);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setSuccess(false);

        if (!title.trim()) {
            setError("عنوان برنامه را وارد کنید.");
            return;
        }

        if (!date) {
            setError("تاریخ برنامه را انتخاب کنید.");
            return;
        }

        setSaving(true);

        try {
            const supabase = createClient();

            const { error: updateError } =
                await supabase
                    .from("programs")
                    .update({
                        title: title.trim(),
                        description:
                            description.trim(),
                        date,
                        time:
                            time.trim() ||
                            null,
                        location:
                            location.trim() ||
                            null,
                        status,
                    })
                    .eq("id", programId);

            if (updateError) {
                console.error(updateError);

                setError(
                    updateError.message ||
                    "ویرایش برنامه با خطا مواجه شد."
                );

                return;
            }

            setSuccess(true);
        } catch (err) {
            console.error(err);

            setError(
                "خطایی در ارتباط با سامانه رخ داد."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
                <div className="text-sm font-bold text-[var(--muted)]">
                    در حال دریافت اطلاعات برنامه...
                </div>
            </main>
        );
    }

    if (error && !programId) {
        return (
            <main className="min-h-screen bg-[var(--background)] p-6">
                <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
                    {error}
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <header className="border-b border-[var(--border)] bg-white">
                <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-5 sm:px-6">
                    <Link
                        href="/admin/programs"
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
                                ویرایش برنامه
                            </h1>
                        </div>

                        <p className="mt-1 text-xs text-[var(--muted)]">
                            تغییر اطلاعات برنامه موکب
                        </p>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* Basic Information */}
                    <section className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-7">
                        <div className="mb-6">
                            <h2 className="font-black text-[var(--primary-dark)]">
                                اطلاعات برنامه
                            </h2>

                            <p className="mt-1 text-xs leading-6 text-[var(--muted)]">
                                اطلاعات اصلی برنامه را ویرایش کنید.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label
                                    htmlFor="title"
                                    className="mb-2 block text-sm font-bold text-[var(--primary-dark)]"
                                >
                                    عنوان برنامه
                                </label>

                                <input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(
                                            event.target
                                                .value
                                        )
                                    }
                                    className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="description"
                                    className="mb-2 block text-sm font-bold text-[var(--primary-dark)]"
                                >
                                    توضیحات
                                </label>

                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(
                                            event.target
                                                .value
                                        )
                                    }
                                    rows={4}
                                    className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-7 outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Date & Time */}
                    <section className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-7">
                        <div className="mb-6">
                            <h2 className="font-black text-[var(--primary-dark)]">
                                زمان و مکان
                            </h2>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-[var(--primary-dark)]">
                                    تاریخ برنامه
                                </label>

                                <PersianDatePicker
                                    value={date}
                                    onChange={setDate}
                                    placeholder="انتخاب تاریخ برنامه"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="time"
                                    className="mb-2 block text-sm font-bold text-[var(--primary-dark)]"
                                >
                                    ساعت
                                </label>

                                <div className="relative">
                                    <Clock3
                                        size={18}
                                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                                    />

                                    <input
                                        id="time"
                                        type="time"
                                        value={time}
                                        onChange={(event) =>
                                            setTime(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 pr-11 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="location"
                                    className="mb-2 block text-sm font-bold text-[var(--primary-dark)]"
                                >
                                    محل برگزاری
                                </label>

                                <div className="relative">
                                    <MapPin
                                        size={18}
                                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                                    />

                                    <input
                                        id="location"
                                        type="text"
                                        value={location}
                                        onChange={(event) =>
                                            setLocation(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 pr-11 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Status */}
                    <section className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-7">
                        <div className="mb-5">
                            <h2 className="font-black text-[var(--primary-dark)]">
                                وضعیت برنامه
                            </h2>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <StatusOption
                                value="upcoming"
                                current={status}
                                label="پیش‌رو"
                                onChange={setStatus}
                            />

                            <StatusOption
                                value="active"
                                current={status}
                                label="در حال برگزاری"
                                onChange={setStatus}
                            />

                            <StatusOption
                                value="completed"
                                current={status}
                                label="برگزار شده"
                                onChange={setStatus}
                            />
                        </div>
                    </section>

                    {error && (
                        <div
                            role="alert"
                            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
                        >
                            {error}
                        </div>
                    )}

                    {success && (
                        <div
                            role="status"
                            className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-700"
                        >
                            تغییرات با موفقیت ذخیره شد.
                        </div>
                    )}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/admin/programs"
                            className="flex h-12 items-center justify-center rounded-xl border border-[var(--border)] bg-white px-6 text-sm font-bold text-[var(--primary-dark)] transition hover:bg-[var(--background)]"
                        >
                            بازگشت
                        </Link>

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-7 text-sm font-bold text-white transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save size={18} />

                            {saving
                                ? "در حال ذخیره..."
                                : "ذخیره تغییرات"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}


/* =========================================================
   Status Option
========================================================= */

function StatusOption({
    value,
    current,
    label,
    onChange,
}: {
    value: Program["status"];
    current: Program["status"];
    label: string;
    onChange: (
        value: Program["status"]
    ) => void;
}) {
    const selected = value === current;

    return (
        <button
            type="button"
            onClick={() => onChange(value)}
            className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${selected
                    ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]"
                    : "border-[var(--border)] bg-white text-[var(--muted)] hover:bg-[var(--background)]"
                }`}
        >
            {label}
        </button>
    );
}