"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
    ArrowRight,
    CalendarDays,
    Clock3,
    MapPin,
    Save,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import PersianDatePicker from "@/components/admin/PersianDatePicker";

export default function NewProgramPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("upcoming");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
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

        setLoading(true);

        try {
            const supabase = createClient();

            const { error: insertError } =
                await supabase
                    .from("programs")
                    .insert({
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
                    });

            if (insertError) {
                console.error(insertError);

                setError(
                    insertError.message ||
                    "ثبت برنامه با خطا مواجه شد."
                );

                return;
            }

            setSuccess(true);

            setTitle("");
            setDescription("");
            setDate("");
            setTime("");
            setLocation("");
            setStatus("upcoming");
        } catch (err) {
            console.error(err);

            setError(
                "خطایی در ارتباط با سامانه رخ داد."
            );
        } finally {
            setLoading(false);
        }
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
                                ثبت برنامه جدید
                            </h1>
                        </div>

                        <p className="mt-1 text-xs text-[var(--muted)]">
                            افزودن یک برنامه یا رویداد جدید برای موکب
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
                                اطلاعات اصلی برنامه را وارد کنید.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {/* Title */}
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
                                    placeholder="مثلاً: مراسم عزاداری شب اربعین"
                                    className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="mb-2 block text-sm font-bold text-[var(--primary-dark)]"
                                >
                                    توضیحات
                                    <span className="mr-1 text-xs font-normal text-[var(--muted)]">
                                        (اختیاری)
                                    </span>
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
                                    placeholder="توضیحات مربوط به برنامه..."
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

                            <p className="mt-1 text-xs leading-6 text-[var(--muted)]">
                                زمان و محل برگزاری برنامه را مشخص کنید.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {/* Date */}
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

                            {/* Time */}
                            <div>
                                <label
                                    htmlFor="time"
                                    className="mb-2 block text-sm font-bold text-[var(--primary-dark)]"
                                >
                                    ساعت
                                    <span className="mr-1 text-xs font-normal text-[var(--muted)]">
                                        (اختیاری)
                                    </span>
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

                            {/* Location */}
                            <div>
                                <label
                                    htmlFor="location"
                                    className="mb-2 block text-sm font-bold text-[var(--primary-dark)]"
                                >
                                    محل برگزاری
                                    <span className="mr-1 text-xs font-normal text-[var(--muted)]">
                                        (اختیاری)
                                    </span>
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
                                        placeholder="مثلاً: محل استقرار موکب"
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

                    {/* Error */}
                    {error && (
                        <div
                            role="alert"
                            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
                        >
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div
                            role="status"
                            className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-700"
                        >
                            برنامه با موفقیت ثبت شد.
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/admin/programs"
                            className="flex h-12 items-center justify-center rounded-xl border border-[var(--border)] bg-white px-6 text-sm font-bold text-[var(--primary-dark)] transition hover:bg-[var(--background)]"
                        >
                            انصراف
                        </Link>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-7 text-sm font-bold text-white transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save size={18} />

                            {loading
                                ? "در حال ثبت..."
                                : "ثبت برنامه"}
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
    value: string;
    current: string;
    label: string;
    onChange: (value: string) => void;
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